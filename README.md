# भिडे वाडा पुनर्वसन समिती

Marathi-first React + Node website based on the supplied visual reference and client handover document.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:5038` by default and Vite forwards `/api` requests to it. Set `PORT` to override the backend port.

## News, events, gallery, and admin

The News, Events, and Gallery pages load published content from MongoDB. The protected admin dashboard at `/admin/dashboard` lets the configured administrator create, edit, and delete those records. The `/admin/hero` manager controls active Home hero images; active images rotate on the home page. Sign in at `/admin/login`; direct dashboard and content-manager routes require an authenticated session.

Before starting the backend:

1. Copy `.env.example` to `.env` and replace every example value.
2. Set `MONGODB_URI` to a MongoDB Atlas connection string. Add the machine running the backend to the Atlas network access list and URL-encode special characters in the database password.
3. Set the Cloudinary cloud name, API key, and API secret. Gallery accepts image/video file uploads and public HTTPS media URLs, which are imported into Cloudinary. YouTube links are embedded with YouTube's privacy-enhanced player and are not uploaded as files to Cloudinary. There is no application-defined file-size limit; practical upload limits depend on available server disk space, network timeouts, and your Cloudinary plan.
4. Set a unique `ADMIN_USERNAME` and an `ADMIN_PASSWORD` at least 14 characters long. There is no public admin registration or default password.
5. If Vite starts on a port other than 5173, set `CLIENT_ORIGIN` to that frontend origin. For a separately hosted frontend, set `VITE_API_URL` to the backend origin when building the frontend, and set `CLIENT_ORIGIN` to the deployed frontend origin.

The admin session is held in an HTTP-only cookie and expires after eight hours. It uses SameSite=Strict in development and SameSite=None with Secure in production to support separately hosted frontend/API origins; all admin mutations validate the exact configured `CLIENT_ORIGIN`. For production, serve over HTTPS and set `CLIENT_ORIGIN` to the exact frontend origin. Admin sessions are kept in backend memory, so sign-ins are cleared when the backend restarts.

The backend process serves the API; deploy the generated `dist/` frontend separately or configure the production web server to serve it, with history fallback enabled so direct visits and refreshes on `/news`, `/events`, `/gallery`, and `/admin/*` load the React application.

## Production

```bash
npm run build
npm run start
```

## Enquiries

The contact form validates name and phone server-side and stores submitted records as newline-delimited JSON in `data/enquiries.ndjson`. For a production launch, replace this with the approved email/CRM/database workflow.

## Content approval before launch

Phone numbers, email, social links, news, events, statistics, committee details, and imagery are representative content drawn from the design direction. Replace them with verified, client-approved information before publishing.
