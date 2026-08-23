For Windows, after PostgreSQL is installed and its `psql` command is on PATH, run `./start-api.ps1` to create a local `.env`, apply `schema.sql`, and start the API automatically.
# KoraPoint

A browser-based point-of-sale app with a multi-tenant API foundation. Each company gets an isolated tenant, and each tenant can have multiple staff accounts.

## Backend foundation

The API uses Node.js, Express, PostgreSQL, bcrypt password hashing, JWT access tokens, and tenant-scoped queries. The schema is in `schema.sql`.

1. Create a PostgreSQL database and enable `pgcrypto` (for UUIDs) and `citext`.
2. Run `schema.sql` against that database.
3. Copy `.env.example` to `.env`, set a random `JWT_SECRET` of at least 32 characters, and set a private `BUSINESS_APPROVAL_CODE`.
4. Install dependencies with `npm install`.
5. Start the API with `npm start`.

For Windows, after PostgreSQL is installed and its `psql` command is on PATH, run `./start-api.ps1` to create a local `.env`, apply `schema.sql`, and start the API automatically.

The API provides company onboarding and sessions (`POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/refresh`, `GET /api/auth/me`), tenant bootstrap (`GET /api/bootstrap`), products and stock, atomic sales/refunds/purchases, suppliers, expenses, customers, staff accounts, and register operations. Refresh tokens are stored hashed and rotated on use.

The POS screens now authenticate against the API and route products, stock, checkout, refunds, purchases, register actions, suppliers, expenses, and staff management through tenant-scoped endpoints. localStorage remains only as a temporary UI cache and backup mechanism.

## Run the frontend locally

Open `index.html` in a browser, or run a local server from this folder:

```powershell
python -m http.server 8000
```

Then open http://localhost:8000.

The frontend expects the API to be running at `http://localhost:3000`. Create a company account from the sign-in screen; there is no shared default account.

## New-user tour

On first use, the app opens a short guided tour covering the dashboard, products, checkout, reports, register, backups, and settings. Users can skip it and restart it later from **Settings > Guided Tour > Start Tour**.

## Deploy for clients

Use GitHub Pages for the frontend and Render for the API plus PostgreSQL. GitHub Pages cannot run Node.js or store client accounts.

1. Push this repository to GitHub.
2. In Render, create a new Blueprint from the repository. Render will use `render.yaml` to create the API and database.
3. In the Render API service, set `CLIENT_ORIGIN` to your GitHub Pages URL, for example `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY`.
	Also set `BUSINESS_APPROVAL_CODE` to a private code. Give this code only to businesses you approve.
4. Deploy the API and copy its HTTPS URL, for example `https://nexatill-api.onrender.com`.
5. In GitHub, open **Settings > Secrets and variables > Actions > Variables** and create `NEXATILL_API_URL` with that Render URL.
6. Open **Settings > Pages**, choose **GitHub Actions**, and push to `main`.
7. Your clients can use the GitHub Pages URL. Their companies and records are stored in the shared PostgreSQL database, separated by tenant ID.

The GitHub workflow replaces `config.js` with the hosted API URL during deployment. Never commit `.env`, database passwords, or JWT secrets.

## Updating the app

Edit the files locally, test with the local server, then commit and push:

```powershell
git add .
git commit -m "Update POS"
git push origin main
```

GitHub Pages will redeploy automatically.

## Data migration status

Authentication, company onboarding, tenant bootstrap, inventory, checkout, refunds, purchases, suppliers, expenses, staff, registers, and audit records use the backend API. localStorage remains only as a temporary cache and backup mechanism. Before charging clients, configure database backups, a paid production database plan, HTTPS, monitoring, and email/password-reset workflows.
