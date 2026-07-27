# exiles.lol

A modern link-in-bio platform inspired by guns.lol.

## Features

- Discord + Google login
- User dashboard (`/dashboard`)
- Public profiles (`/username`)
- Customizable bio, background, accent color, and links
- Clean dark theme with glow effects

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite path (default works for local) |
| `NEXTAUTH_URL` | `http://localhost:3000` for local |
| `NEXTAUTH_SECRET` | Random string (`openssl rand -base64 32`) |
| `DISCORD_CLIENT_ID` | From Discord Developer Portal |
| `DISCORD_CLIENT_SECRET` | From Discord Developer Portal |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |

#### Discord OAuth setup
1. Go to https://discord.com/developers/applications
2. Create an application
3. OAuth2 → Redirects → add `http://localhost:3000/api/auth/callback/discord`
4. Copy Client ID and Client Secret

#### Google OAuth setup
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Authorized redirect URIs → add `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret

### 3. Database

```bash
npx prisma db push
```

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000

## Deploy to production

1. Push to GitHub
2. Deploy on **Vercel** (recommended) or Railway
3. Add the same environment variables
4. Update OAuth redirect URIs to your production domain:
   - `https://exiles.lol/api/auth/callback/discord`
   - `https://exiles.lol/api/auth/callback/google`
5. Point your domain `exiles.lol` DNS to the host

For production database, switch Prisma to PostgreSQL (change `provider` in `schema.prisma` and update `DATABASE_URL`).

## Project structure

```
app/
  page.tsx              → Landing page
  login/page.tsx        → Login (Discord + Google)
  dashboard/page.tsx    → User dashboard
  [username]/page.tsx   → Public profile
  api/auth/[...nextauth] → NextAuth
  api/profile/          → Profile update API
components/
  DashboardClient.tsx
  ProfileView.tsx
  Providers.tsx
lib/
  auth.ts
  prisma.ts
  utils.ts
prisma/
  schema.prisma
```
