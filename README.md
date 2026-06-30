# Biolink Platform

A self-hosted, customizable bio-link platform (à la Linktree/guns.lol-style sites) with
user accounts, custom backgrounds, music player, custom cursor effects, Discord presence,
view counters, and social links. Built from scratch — Node/Express + SQLite, no external
services required except optional Discord presence (via the free Lanyard API).

## Features

- Email/username + password auth (JWT in httpOnly cookie, bcrypt-hashed passwords)
- Per-user public profile page at `yoursite.com/username`
- Avatar, background (image/video upload), and background music upload
- Built-in animated particle background (no upload needed) as the default look
- Custom cursor effects (glow dot / trail / none)
- Discord presence widget via [Lanyard](https://github.com/Phineas/lanyard) (free, public API —
  the visitor must have joined the Lanyard support Discord server for their status to show)
- View counter
- Up to 12 social/external links per profile, user-managed from a dashboard

## Setup

1. **Install Node.js** (v18+) from nodejs.org if you don't have it.
2. Unzip this project, then in a terminal:

```bash
cd biolink
npm install
cp .env.example .env
```

3. Open `.env` and set `JWT_SECRET` to a long random string (this signs login sessions).
4. Start the server:

```bash
npm start
```

5. Visit `http://localhost:3000` in your browser. Register an account, then go to
   `/dashboard` to customize your page. Your public page will be live at
   `http://localhost:3000/<your-username>`.

## Deploying it for real (so it's usable, not just local)

This app is a standard Node/Express app, so it deploys to most hosts as-is:

- **Railway / Render / Fly.io**: connect the GitHub repo, set the `JWT_SECRET` env var,
  it'll auto-detect `npm start`. Note: SQLite is a file on disk, so use a host with
  persistent storage/volumes (Railway and Fly both support this) or switch to a hosted
  Postgres/MySQL for production scale.
- **A VPS** (DigitalOcean, Linode, etc.): clone the repo, `npm install`, run with
  `pm2 start server.js` or behind `nginx` as a reverse proxy with a real domain + TLS
  (e.g. via Certbot).
- **Custom domain per-user**: not built in — this gives every user a path
  (`yoursite.com/username`). Adding subdomains-per-user is a bigger project (wildcard DNS +
  routing), let me know if you want that built out too.

## Project structure

```
biolink/
  server.js          → app entrypoint, routing
  auth.js             → JWT helpers + auth middleware
  upload.js           → multer config for avatar/background/audio uploads
  db/database.js      → SQLite schema + connection
  routes/auth.js       → register/login/logout
  routes/profile.js    → profile CRUD, links, public profile API, Discord proxy
  public/              → all frontend pages (vanilla JS, no build step)
    index.html, login.html, register.html, dashboard.html, profile.html
  uploads/              → user-uploaded avatars/backgrounds/audio (created at runtime)
  data.sqlite           → the database file (created on first run)
```

## Notes / things to harden before going public with real users

- Add rate limiting on `/api/auth/login` and `/register` (e.g. `express-rate-limit`) to
  prevent brute-force / spam signups.
- Add file-type/size validation is already in place via multer, but consider adding
  virus scanning or a CDN (S3 + CloudFront) for uploads at scale instead of local disk.
- Consider email verification before allowing a profile to go live.
- The Discord widget depends on the third-party Lanyard service's uptime/rate limits —
  fine for personal/small-scale use, but for serious scale you'd want your own bot
  tracking presence via Discord's Gateway API instead.
- Switch SQLite → Postgres if you expect heavy concurrent writes (view counters can
  contend under high traffic).

This is entirely original code — nothing copied from guns.lol or any other site — so it's
yours to modify, extend, white-label, and deploy however you like.
"# exiles.lol" 
