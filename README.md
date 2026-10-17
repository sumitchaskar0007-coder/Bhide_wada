# Bhide Wada website

React frontend and Node.js / Express backend, with an authenticated administration dashboard. Content, administrator accounts, sessions, activity history and enquiries are stored in SQLite. Uploaded media is stored locally. MongoDB and Cloudinary are not required.

## Run locally

Requires Node.js **22.13 or newer** (the backend uses the built-in `node:sqlite` module).

```sh
npm ci
npm run admin:setup
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://127.0.0.1:5173`. The API listens at `http://127.0.0.1:5038`; Vite forwards `/api` requests to it. If another frontend is already running on port 5173, Vite may use 5174. Both localhost and 127.0.0.1 on ports 5173 and 5174 are allowed by default.

The setup command creates the first administrator and writes a randomly generated password to **`.data/initial-admin.txt`** with owner-only access. Sign in at **`/admin/login`**, change the password under Account settings, and delete the initial credential file. An existing account is never overwritten by setup. To choose initial credentials, set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in a root `.env` file before running setup (minimum password length: 14 characters). They are used for initial setup only; later password changes are saved in the database.

Copy `.env.example` to `.env` to customize backend settings. Keep environment and initial credential files private. The `.data/` directory is excluded from Git.

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

## Media

Supported uploads: PNG, JPEG, WebP, GIF, MP4 and WebM. Hero slides accept images only. Files are checked against their content signatures and MIME type, assigned random filenames, and limited to **50 MB per file** by default (`MAX_UPLOAD_MB`). Replacing or deleting a record removes its old local media. Public media is served from `/api/media/…` with MIME sniffing disabled.

HTTPS media links remain hosted at their source; the backend does not download remote URLs. YouTube links are converted to privacy-enhanced embed URLs. Local upload files and the SQLite database must be retained together when backing up or migrating.

## Authentication

Passwords use Node's salted scrypt password hashing. Session cookies are HTTP-only, expire after eight hours, and contain only a random token; token hashes are stored in SQLite. Logging out invalidates the session. Changing the password revokes all previous sessions. Protected API endpoints enforce authentication independently of the frontend, mutations validate the exact request Origin, and login/password attempts are rate limited. HTTPS production cookies use Secure and SameSite=Lax.

Sessions and content persist across backend restarts. Deploy a **single backend instance** with a writable persistent data directory. In-process rate limits reset when that process restarts. There is one administrator account; public registration, email-based recovery and multiple administrative roles are not included.

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
```

Provision the initial admin against the same data directory, then start the app:

```sh
npm run admin:setup
npm start
```

Use a process manager and an HTTPS reverse proxy forwarding the website and `/api` to this Node server. It serves the `dist/` frontend with history fallback and the API on the same origin. The production frontend defaults to relative `/api` requests. `CLIENT_ORIGIN` must match the exact HTTPS website origin; comma-separated trusted origins are supported. Configure reverse-proxy request-size limits for your chosen upload limit. Production startup requires HTTPS origins.

Back up `.data/` (or `DATA_DIR`) while the server is stopped, including the SQLite database and uploads. Do not publish this directory or its credential file as static content. This repository does not deploy infrastructure or configure external backups.

For a separate API hostname, explicitly set `VITE_API_URL` before building and add the frontend's HTTPS origin to `CLIENT_ORIGIN`. The supplied defaults are for same-origin hosting.

## Verification

```sh
npm test
npm run build
```

The integration suite uses a temporary SQLite database and local HTTP server. It covers protected endpoints, login/cookies, invalid origins, draft/public content separation, announcement pinning/expiry, date validation, upload validation and cleanup, gallery links, enquiry handling, persistence, password changes, session expiry/logout, and rate limiting. Test records and credentials are never written to the live data directory.
