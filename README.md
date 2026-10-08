# भिडे वाडा पुनर्वसन समिती

Marathi-first React + Node website based on the supplied visual reference and client handover document.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:5038` by default and Vite forwards `/api` requests to it. Set `PORT` to override the backend port.

To use the deployed VPS API while running the frontend locally, put `VITE_API_PROXY_TARGET=https://api.phulewadarashtriyasmarak.com` in the root `.env.development.local`. Vite then proxies `/api` requests locally, avoiding browser CORS errors. Admin login and other protected mutations also require the VPS backend's trusted `CLIENT_ORIGIN` to allow the exact local origin (for example, `http://127.0.0.1:5173`); restart the backend after changing its environment.

## News, events, gallery, and admin

The News, Events, and Gallery pages load published content from MongoDB. The protected admin dashboard at `/admin/dashboard` lets the configured administrator create, edit, and delete those records. The `/admin/hero` manager controls active Home hero images; active images rotate on the home page. Sign in at `/admin/login`; direct dashboard and content-manager routes require an authenticated session.

Before starting the backend:

1. Copy `.env.example` to `bhide_wada_backend/.env` and replace every example value. The backend loads its environment file from that directory.
2. Set `MONGODB_URI` to a MongoDB Atlas connection string. Add the machine running the backend to the Atlas network access list and URL-encode special characters in the database password.
3. Set the Cloudinary cloud name, API key, and API secret. Gallery accepts image/video file uploads and public HTTPS media URLs, which are imported into Cloudinary. YouTube links are embedded with YouTube's privacy-enhanced player and are not uploaded as files to Cloudinary. There is no application-defined file-size limit; practical upload limits depend on available server disk space, network timeouts, and your Cloudinary plan.
4. Set a unique `ADMIN_USERNAME` and an `ADMIN_PASSWORD` at least 14 characters long. There is no public admin registration or default password.
5. For local development, keep `PORT=5038` and `CLIENT_ORIGIN=http://localhost:5173`; Vite proxies `/api` requests to the backend. If Vite starts on a different port, update `CLIENT_ORIGIN`. For a separately hosted frontend, set `VITE_API_URL` in the frontend build environment to the backend origin (or its `/api` URL), and set `CLIENT_ORIGIN` in the backend environment to the deployed frontend origin.

The admin session is held in an HTTP-only cookie and expires after eight hours. It uses SameSite=Strict in development and SameSite=None with Secure in production to support separately hosted frontend/API origins; all admin mutations validate the exact configured `CLIENT_ORIGIN`. For production, serve over HTTPS and set `CLIENT_ORIGIN` to the exact frontend origin. Admin sessions are kept in backend memory, so sign-ins are cleared when the backend restarts.

The backend process serves the API; deploy the generated `dist/` frontend separately or configure the production web server to serve it, with history fallback enabled so direct visits and refreshes on `/news`, `/events`, `/gallery`, and `/admin/*` load the React application.

## Production

```bash
npm run build
npm run start
```

The production frontend build reads `.env.production` and calls `https://api.phulewadarashtriyasmarak.com/api`. Keep local development on the default same-origin `/api` URL so Vite can proxy requests to `http://localhost:5038`.

### VPS API setup

1. Create a DNS `A` record for `api.phulewadarashtriyasmarak.com` pointing to the VPS public IPv4 address. Configure HTTPS for that hostname.
2. Install Node.js 18 or newer on the VPS, deploy the project, and run `npm ci --omit=dev` from the project root.
3. Create `bhide_wada_backend/.env` on the VPS with the production `MONGODB_URI`, Cloudinary credentials, a unique `ADMIN_USERNAME`, a strong `ADMIN_PASSWORD` (at least 14 characters), `PORT=5038`, `NODE_ENV=production`, and `CLIENT_ORIGIN=https://phulewadarashtriyasmarak.com`. Do not commit or share this file.
4. Run the backend with a process manager such as systemd. Configure the HTTPS reverse proxy for `api.phulewadarashtriyasmarak.com` to forward `/api/` to `http://127.0.0.1:5038/api/`. Keep the frontend hosted at `https://phulewadarashtriyasmarak.com`.
5. Verify `https://api.phulewadarashtriyasmarak.com/api/health` returns `{"status":"ok"}`, then build and deploy the frontend with `npm run build`.

## Enquiries

The contact form validates name and phone server-side and stores submitted records as newline-delimited JSON in `data/enquiries.ndjson`. For a production launch, replace this with the approved email/CRM/database workflow.

## Content approval before launch

Phone numbers, email, social links, news, events, statistics, committee details, and imagery are representative content drawn from the design direction. Replace them with verified, client-approved information before publishing.
