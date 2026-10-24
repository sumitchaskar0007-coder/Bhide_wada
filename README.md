# Bhide Wada website

React frontend and Node.js / Express backend, with an authenticated administration dashboard. Content, administrator accounts, sessions, activity history and enquiries use **MongoDB Atlas when `MONGODB_URI` is configured**, with SQLite retained as an offline fallback when that variable is absent. Uploaded media is stored locally; Cloudinary is not required. A configured Atlas connection must succeed before the API starts—connection failures do not silently switch databases.

## Run locally

Requires Node.js **22.13 or newer** (the backend uses the built-in `node:sqlite` module).

```sh
npm ci
# Configure .env first if you want to use Atlas.
npm run admin:setup
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://127.0.0.1:5173`. The API listens at `http://127.0.0.1:5038`; Vite forwards `/api` requests to it. If another frontend is already running on port 5173, Vite may use 5174. Both localhost and 127.0.0.1 on ports 5173 and 5174 are allowed by default.

The setup command creates the first administrator and writes a randomly generated password to **`.data/initial-admin.txt`** with owner-only access. Sign in at **`/admin/login`**, change the password under Account settings, and delete the initial credential file. An existing account is never overwritten by setup. To choose initial credentials, set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in a root `.env` file before running setup (minimum password length: 14 characters). They are used for initial setup only; later password changes are saved in the selected database.

Copy `.env.example` to `.env` to customize backend settings. For Atlas, set `MONGODB_URI` and optionally `MONGODB_DB_NAME` (default `bhide_wada`). URL-encode database passwords containing reserved URI characters. Credentials are read only by the backend and are never exposed as `VITE_` environment variables. Keep environment and initial credential files private. The `.data/` directory and root `.env` are excluded from Git.

To move an existing local installation to Atlas, set `MONGODB_URI` first, stop the local backend, then run:

```sh
npm run db:migrate
npm run server
```

The migration copies administrators (including their existing password hashes), content, enquiries and activity history into namespaced `bw_` collections. It uses an atomic, insert-only transaction: reruns skip existing IDs, and existing remote documents are never overwritten. Local SQLite data and uploaded files remain intact. Sessions are not migrated; sign in again with the same administrator credentials. Existing username conflicts abort the migration. Atlas must allow the machine’s public IP in Network Access, and the database user must have read/write permissions.

The Atlas adapter uses transactions for content/audit changes and password/session revocation, unique administrator usernames, and a TTL index for expired sessions.

## Dashboard

- **Overview:** content counts, published/hidden totals, unread enquiries and recent activity.
- **Announcements:** create/edit/delete notices, save drafts, pin important notices and optionally set expiry dates and links. Published notices appear in the homepage update strip and `/announcements`.
- **News:** manage stories, summaries, text and optional cover media; published news appears at `/news`.
- **Events:** manage event details, dates and locations; published records appear at `/events`. Dates are stored in UTC and shown in the visitor's local timezone.
- **Gallery:** upload images/videos, link to public HTTPS media, or embed YouTube videos. Published records appear at `/gallery`.
- **Hero slides:** upload additional banner images, publish/unpublish them, and enable/disable them in the slideshow. The three existing local hero images remain; dashboard images are appended. The homepage introduction text remains on its first image only.
- **Enquiries:** view messages submitted through `/contact`, mark them read/resolved or delete them. This is an inbox; it does not send email.
- **Account settings:** change the password and revoke other signed-in sessions.

Content forms support browser-local drafts, record search and publication filters. Unpublished records remain accessible only through the authenticated API. The existing public page text, branding and image assets are retained.

For ongoing site coverage, publish verified photographs and videos through **Gallery**, and dated reports through **News**. Gallery records support an optional date taken and HTTPS source/photographer link; news records support an optional HTTPS source link. These appear publicly so an upload date is not mistaken for the date a photograph was taken. Identify Bhidewada and Phulewada accurately, credit contributors, label archival material, and unpublish obsolete progress claims. The generated homepage banner is labelled as a heritage illustration; it is not a photograph of present site conditions. New content still requires authentic material and editorial review; no recurring publishing automation is enabled.

## Media

Supported uploads: PNG, JPEG, WebP, GIF, MP4 and WebM. Hero slides accept images only. Files are checked against their content signatures and MIME type, assigned random filenames, and limited to **50 MB per file** by default (`MAX_UPLOAD_MB`). Replacing or deleting a record removes its old local media. Public media is served from `/api/media/…` with MIME sniffing disabled.

HTTPS media links remain hosted at their source; the backend does not download remote URLs. YouTube links are converted to privacy-enhanced embed URLs. Local upload files and the SQLite database must be retained together when backing up or migrating.

## Authentication

Passwords use Node's salted scrypt password hashing. Session cookies are HTTP-only, expire after eight hours, and contain only a random token; token hashes are stored in the selected database. Logging out invalidates the session. Changing the password revokes all previous sessions. Protected API endpoints enforce authentication independently of the frontend, mutations validate the exact request Origin, and login/password attempts are rate limited. HTTPS production cookies use Secure and SameSite=Lax.

Sessions and content persist across backend restarts. Deploy a **single backend instance** with a writable persistent media directory. Atlas stores database records remotely; the SQLite fallback stores them in `.data/admin.sqlite`. In-process rate limits reset when that process restarts. There is one administrator account; public registration, email-based recovery and multiple administrative roles are not included.

## Production

Build the frontend:

```sh
npm run build
```

Configure the root `.env` on the server:

```dotenv
NODE_ENV=production
HOST=127.0.0.1
PORT=5038
CLIENT_ORIGIN=https://your-domain.com
DATA_DIR=/absolute/path/to/persistent/bhide-data
MAX_UPLOAD_MB=50
MONGODB_URI=mongodb+srv://<username>:<url-encoded-password>@<cluster-host>/bhide_wada?retryWrites=true&w=majority
MONGODB_DB_NAME=bhide_wada
```

For a fresh installation, provision the initial admin against the same database, then start the app. For an existing SQLite installation, run `npm run db:migrate` instead of `admin:setup`:

```sh
npm run admin:setup
npm start
```

Use a process manager and an HTTPS reverse proxy forwarding the website and `/api` to this Node server. It serves the `dist/` frontend with history fallback and the API on the same origin. The production frontend defaults to relative `/api` requests. `CLIENT_ORIGIN` must match the exact HTTPS website origin; comma-separated trusted origins are supported. Configure reverse-proxy request-size limits for your chosen upload limit. Production startup requires HTTPS origins.

The backend trusts forwarded visitor IPs only from loopback proxies, matching the supplied Nginx configuration and `HOST=127.0.0.1`. Nginx overwrites `X-Forwarded-For` with the connecting visitor's address. Login and enquiry limits therefore apply per visitor IP. Keep the backend bound to loopback; a proxy on another host or a CDN requires reviewing the trusted proxy configuration for that topology.

Back up `.data/` (or `DATA_DIR`) while the server is stopped, including uploads and the SQLite database if used. Configure database backups separately in Atlas when MongoDB is enabled. Do not publish this directory or its credential file as static content. This repository does not deploy infrastructure or configure external backups.

For a separate API hostname, explicitly set `VITE_API_URL` before building and add the frontend's HTTPS origin to `CLIENT_ORIGIN`. The supplied defaults are for same-origin hosting.

## Verification

```sh
npm test          # Isolated local SQLite tests; no Atlas connection
npm run test:mongo # Full suite in a random temporary Atlas database
npm run build
```

The integration suite uses a temporary database and local HTTP server. `npm test` uses SQLite. `npm run test:mongo` reads the ignored `.env`, creates its own randomly named `bhide_wada_test_…` Atlas database, runs the same suite, and drops only that database afterwards; it requires permission to create and drop a test database. It covers protected endpoints, login/cookies, invalid origins, draft/public content separation, announcement pinning/expiry, date validation, upload validation and cleanup, gallery links, enquiry handling, persistence, password changes, session expiry/logout, and rate limiting. Test records and credentials are never written to the live data directory.
