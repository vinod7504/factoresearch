# Facto Research

This project now has:

- a Vite/React frontend
- a separate Node/Express mail API for form submission

## Frontend setup

The frontend lives in `client/`.

Set these values in `client/.env`:

- `VITE_API_BASE_URL`: your Render backend URL, for example `https://factoresearch-mail-api.onrender.com`

Run the frontend:

```bash
cd client
npm install
npm run dev
```

## Backend setup

The backend lives in `server/`.

Set these values in `server/.env`:

- `SUPPORT_EMAIL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM_NAME`
- `SMTP_FROM_EMAIL`
- `ALLOWED_ORIGINS`
- `SMTP_CONNECTION_TIMEOUT_MS` (optional, default `10000`)
- `SMTP_GREETING_TIMEOUT_MS` (optional, default `10000`)
- `SMTP_SOCKET_TIMEOUT_MS` (optional, default `20000`)
- `SMTP_SEND_TIMEOUT_MS` (optional, default `25000`)

Run the backend:

```bash
cd server
npm install
npm run dev
```

## Render deployment

Create a new Render Web Service with:

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

Set the required environment variables in Render to match `server/.env`.

For `ALLOWED_ORIGINS`, include your Netlify domain, for example:

```text
https://your-site.netlify.app
```

## Netlify deployment

Set this environment variable in Netlify:

```text
VITE_API_BASE_URL=https://your-render-service.onrender.com
```

Set Netlify publish settings to:

```text
Base directory: client
Build command: npm run build
Publish directory: client/dist
```

Then redeploy the frontend.

## Mail behavior

Forms now submit to the backend API and the backend sends the email to `support@factoresearch.com`.

The email entered by the user is used as `reply-to`, which is the correct and safe approach. The backend should not forge the user email as the SMTP sender.

## SMTP auth troubleshooting

If `/api/contact` returns an SMTP authentication error (`535`, `EAUTH`), the SMTP login is being rejected by the mail provider.

Verify:

- `SMTP_USER` and `SMTP_PASS` are valid mailbox credentials (or an app password if required).
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` match your provider settings.
- Render can reach your SMTP host from its network region (firewall/provider allowlist issues can cause timeouts and gateway `502`).
- On Render free web services, outbound SMTP ports `25`, `465`, and `587` are blocked (effective September 26, 2025). Use a paid Render instance or a mail provider API over HTTPS.

Common values:

- GoDaddy Workspace Email: `SMTP_HOST=smtpout.secureserver.net`, `SMTP_PORT=465`, `SMTP_SECURE=true`
- Microsoft 365 (including many GoDaddy M365 mailboxes): `SMTP_HOST=smtp.office365.com`, `SMTP_PORT=587`, `SMTP_SECURE=false`
