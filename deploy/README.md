# Host bhidewada on 187.127.137.105

Target website: **https://phulewadarashtriyasmarak.com**.
The Node service serves the React build and `/api` together. Nginx forwards
requests to `127.0.0.1:5039`. No separate frontend process is needed.

The supplied server output confirms that the domain currently serves
`/var/www/bhide_wada_f/dist`, and `api.phulewadarashtriyasmarak.com` forwards
to the old backend at port 5038. DNS and the existing HTTPS certificate are
already configured. Leave DNS unchanged.

This deployment uses `/var/www/bhidewada` and a separate backend on port 5039.
Keep the old frontend, API, environment and data intact for rollback. The files
here are local preparation; deployment has not been performed.

## 2. Check the server before uploading

Run in your existing server terminal:

```sh
node --version
command -v node
sudo ss -ltnp | grep ':5039\b'
sudo nginx -T
```

Node must be at least 22.13. The service file assumes `/usr/bin/node`; change
`ExecStart` if Node is installed elsewhere (the dedicated service user must be
able to access it). If port 5039 belongs to another app, choose an unused port
and update the Nginx configs in `deploy/` and the production `.env`.

## 3. Build and upload from this Mac

Replace the SSH target if you connect with a different username or alias:

```sh
npm ci
npm run build
ssh root@187.127.137.105 'mkdir -p /var/www/bhidewada'
rsync -az --exclude=node_modules --exclude=.git --exclude=.data --exclude=.env --exclude=.env.local --exclude=.env.development --exclude=.env.development.local --exclude=.env.production.local --exclude=.DS_Store ./ root@187.127.137.105:/var/www/bhidewada/
```

The upload intentionally excludes local credentials and data and does not
delete server files. Never upload the development `.env` as production config.

## 4. Install the app on the server

Ensure Nginx and Certbot with the Nginx plugin are installed using the server's
supported package manager. See [Certbot's installation instructions](https://certbot.eff.org/instructions?ws=nginx).

Run as root (or prefix administrative commands with `sudo`):

```sh
id bhidewada || useradd --system --user-group --home-dir /var/lib/bhidewada --shell /usr/sbin/nologin bhidewada
install -d -o bhidewada -g bhidewada -m 700 /var/lib/bhidewada
cd /var/www/bhidewada
npm ci --omit=dev
# First installation only; preserve .env on future deployments.
if [ ! -e .env ]; then install -o root -g bhidewada -m 640 deploy/production.env.example .env; fi
nano .env
```

Choose the database before starting. The blank MongoDB URI in the example
creates a fresh SQLite database in `/var/lib/bhidewada`. To deploy existing
content from this project's local database, transfer a consistent backup of
its data and uploads and set ownership to `bhidewada`. For this project's Atlas
adapter, configure the correct MongoDB URI/database and Atlas IP allowlist.

The old backend is a different codebase: its collections, credentials and
uploads are not known to be compatible. Do not assume pointing the new app at
its database will migrate its content. Preserve its data and inspect schemas
before planning a migration. Never paste database credentials into chat.

For a **fresh database only**, create the administrator:

```sh
sudo -u bhidewada /usr/bin/node bhide_wada_backend/setup-admin.js
```

The initial password is saved to `/var/lib/bhidewada/initial-admin.txt`;
read it privately on the server, sign in at `/admin/login`, change the password,
then delete the credential file. Existing databases keep their administrator.

Install and start the service:

```sh
install -m 644 deploy/bhidewada.service /etc/systemd/system/bhidewada.service
systemctl daemon-reload
systemctl enable --now bhidewada
curl --fail http://127.0.0.1:5039/api/health
```

## 5. Switch the existing HTTPS domain to the new app

Only proceed when `curl --fail http://127.0.0.1:5039/api/health` returns
`{"status":"ok"}`. The following updates the existing site, retaining the
certificate paths supplied in the server output. It leaves the old API
subdomain and other websites alone. Do not enable `deploy/nginx.conf` as a
second site for the same domain.

Run on the server as root:

```sh
site_path=$(readlink -f /etc/nginx/sites-enabled/phulewadarashtriyasmarak.com)
backup_path="/root/phulewada-nginx-$(date +%Y%m%d-%H%M%S).conf"
cp -p "$site_path" "$backup_path"
cat /var/www/bhidewada/deploy/nginx-existing-https.conf > "$site_path"
if nginx -t; then
    systemctl reload nginx
else
    cp -p "$backup_path" "$site_path"
    echo 'Configuration restored; fix the reported error before continuing.'
fi
```

Verify the public website and API:

```sh
curl --fail https://phulewadarashtriyasmarak.com/api/health
curl --fail https://www.phulewadarashtriyasmarak.com/api/health
```

Open the home page, a direct link such as `/gallery`, admin login, an upload
and a contact enquiry in the browser. Confirm the existing Certbot renewal
job remains enabled. If the new website fails, restore the backup path printed
by `ls /root/phulewada-nginx-*.conf`, then run `nginx -t` and reload Nginx.
The old frontend and old API remain available for rollback.

## Updates and troubleshooting

Build locally, repeat the upload, then run `npm ci --omit=dev` in the server's
app directory and `systemctl restart bhidewada`. Keep `.env` and
`/var/lib/bhidewada` across deployments. Back up local data while the service
is stopped and configure Atlas backups separately when used.

```sh
systemctl status bhidewada --no-pager
journalctl -u bhidewada -n 80 --no-pager
tail -n 80 /var/log/nginx/error.log
```
