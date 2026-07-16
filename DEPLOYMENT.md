# Deployment Guide — Nimish Patil Portfolio

A beginner-friendly walkthrough for moving this project from Replit to GitHub and deploying it on Vercel.

---

## 1. Which Vercel services are used?

| Service | Purpose |
|---|---|
| **Vercel Blob** | Stores uploaded certificate images and PDFs permanently in the cloud |
| **Vercel Serverless Functions** | Runs the Express API (`/api/*`) without needing a separate server |
| **Vercel Postgres** *(recommended)* | Hosts the PostgreSQL database in production |
| **Vercel Hosting** | Serves the React frontend as a static site |

---

## 2. Which environment variables are needed?

Copy `.env.example` and fill in the real values:

```
DATABASE_URL        PostgreSQL connection string (Vercel Postgres provides this)
SESSION_SECRET      Random 32-char secret for admin login sessions
ADMIN_USERNAME      Admin panel login username  (default: admin)
ADMIN_PASSWORD      Admin panel login password  (change this!)
BLOB_READ_WRITE_TOKEN  Vercel Blob token — get it from your Blob store settings
PORT                8080 (only used locally, not needed on Vercel)
```

Set these in: **Vercel Dashboard → Your Project → Settings → Environment Variables**

---

## 3. Where are uploaded certificates stored?

Uploaded images and PDFs are stored in **Vercel Blob** — Vercel's global cloud object storage.

- Files are stored permanently at a public URL like:  
  `https://xxxx.public.blob.vercel-storage.com/certificates/img/17000000-abc123.jpg`
- The URL is saved in your PostgreSQL database (the `image_url` or `pdf_url` column in the `certificates` table).
- Files remain available even when you redeploy, restart, or modify your code.

---

## 4. Does GitHub store uploaded certificates?

**No.** GitHub only stores your source code.

Uploaded certificate files live in Vercel Blob, not in your repository. This is intentional — binary files (images, PDFs) should never be committed to Git.

---

## 5. How do uploads continue working after redeployment?

Because the files are in Vercel Blob (cloud storage), not on any server's disk:

1. Admin uploads a certificate → file goes to Vercel Blob → URL saved to DB.
2. You redeploy the app → new code deployed, same DB, same Blob store.
3. Visitors still see the certificate at the same Blob URL. ✅

---

## 6. How to migrate from Replit to GitHub

### Step 1 — Create a GitHub repository
1. Go to [github.com/new](https://github.com/new)
2. Name it (e.g. `portfolio`)
3. Keep it **private** (you can make it public later)
4. Click **Create repository**

### Step 2 — Push the code
Open a terminal in Replit and run:

```bash
git init
git add .
git commit -m "Initial portfolio commit"
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

### Step 3 — Add a `.gitignore`
Make sure `.env` is excluded (it already should be via the default `.gitignore`).

---

## 7. How to deploy on Vercel

### Step 1 — Connect GitHub
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Vercel detects the framework automatically

### Step 2 — Set up Vercel Postgres
1. Vercel Dashboard → **Storage** → **Create Database** → **Postgres**
2. Connect it to your project
3. Copy the `DATABASE_URL` from the Postgres panel → paste into Environment Variables

### Step 3 — Set up Vercel Blob
1. Vercel Dashboard → **Storage** → **Create Database** → **Blob**
2. Connect it to your project
3. Copy the `BLOB_READ_WRITE_TOKEN` → paste into Environment Variables

### Step 4 — Set remaining environment variables
In Vercel → Settings → Environment Variables, add:
- `SESSION_SECRET` — run `openssl rand -hex 32` to generate one
- `ADMIN_USERNAME` and `ADMIN_PASSWORD`

### Step 5 — Run DB migrations on Vercel
After the first deploy, open a terminal and run:

```bash
DATABASE_URL="<your_vercel_postgres_url>" pnpm --filter @workspace/db run push
```

This creates the tables in your production database.

### Step 6 — Deploy
Click **Deploy** in the Vercel dashboard (or just push to `main` — Vercel auto-deploys).

---

## 8. How future updates are deployed

Every time you push code to the `main` branch on GitHub, Vercel automatically:
1. Pulls the new code
2. Builds the project (`pnpm run build`)
3. Deploys the new version (zero downtime)

To deploy manually: push a commit, or click **Redeploy** in the Vercel dashboard.

---

## 9. Do uploaded certificates survive redeployments?

**Yes, permanently.** Here's why:

```
Code deploy  →  Only replaces server code & frontend files
Vercel Blob  →  Completely separate cloud storage, untouched by deploys
PostgreSQL   →  Completely separate database, untouched by deploys
```

Uploaded files are stored in Blob with permanent URLs. As long as you don't manually delete them from the Blob store, they will always be available.

---

## 10. Project architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Repository                      │
│          (source code only — no uploaded files)             │
└───────────────────────┬─────────────────────────────────────┘
                        │ auto-deploy on push
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                        Vercel                               │
│                                                             │
│  ┌──────────────────────┐  ┌─────────────────────────────┐  │
│  │  Frontend (React)    │  │  API (Express / Serverless) │  │
│  │  artifacts/my-       │  │  artifacts/api-server/      │  │
│  │  portfolio/dist/     │  │  → /api/*                   │  │
│  └──────────────────────┘  └──────────────┬──────────────┘  │
│                                           │                 │
│  ┌────────────────────┐  ┌────────────────┴─────────────┐  │
│  │   Vercel Blob      │  │      Vercel Postgres          │  │
│  │  (images & PDFs)   │◄─│  (certificates, profile,      │  │
│  │  permanent URLs    │  │   skills, experience, etc.)   │  │
│  └────────────────────┘  └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

User visits site:
  Browser → Vercel CDN → React frontend
  Browser → /api/... → Express serverless function → Postgres
  Admin uploads file → /api/admin/upload → Vercel Blob → URL saved to Postgres
```

### Data flow for a certificate upload:
```
Admin panel  →  POST /api/admin/upload (multipart)
             →  Express validates auth
             →  Uploads to Vercel Blob
             →  Returns { url: "https://blob.vercel-storage.com/..." }
Admin panel  →  PUT /api/admin/certificates/:id  { imageUrl: url }
             →  Saved in Postgres
Visitor      →  GET /api/portfolio/certificates
             →  Postgres returns list with Blob URLs
             →  Browser loads images directly from Vercel Blob CDN  ✅
```

---

*Questions? Open an issue on your GitHub repository.*
