# भिडे वाडा पुनर्वसन समिती

Marathi-first React + Node website based on the supplied visual reference and client handover document.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:3001` and Vite forwards `/api` requests to it.

## Production

```bash
npm run build
npm run start
```

## Enquiries

The contact form validates name and phone server-side and stores submitted records as newline-delimited JSON in `data/enquiries.ndjson`. For a production launch, replace this with the approved email/CRM/database workflow.

## Content approval before launch

Phone numbers, email, social links, news, events, statistics, committee details, and imagery are representative content drawn from the design direction. Replace them with verified, client-approved information before publishing.
