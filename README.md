# Facto Research

This project now has:

- a Vite/React frontend
- a separate Node/Express mail API for form submission

## Frontend setup

The frontend lives in `client/`.

Copy `client/.env.example` to `client/.env` and set:

- `VITE_API_BASE_URL`: your Render backend URL, for example `https://factoresearch-mail-api.onrender.com`

Run the frontend:

```bash
cd client
npm install
npm run dev
```

## Backend setup

The backend lives in `server/`.

Copy `server/.env.example` to `server/.env` and set:

- `SUPPORT_EMAIL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM_NAME`
- `SMTP_FROM_EMAIL`
- `ALLOWED_ORIGINS`

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

Set the environment variables from `server/.env.example`.

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
