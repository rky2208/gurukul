# Persona Web Client (Gurukul frontend)

Vite + React + TypeScript + MUI single-page app. Talks to the
[persona-web-server](../server) backend. Builds to a fully static bundle —
no server-side rendering, no runtime Node process required to serve it.

## Local development

```bash
npm install
npm run dev   # http://localhost:5173, proxies /api -> http://localhost:5001
```

The dev server proxies `/api/*` to the backend (see `vite.config.ts`), so no
env var is needed locally as long as the backend runs on port 5001.

## Production build

```bash
npm run build     # tsc --noEmit + vite build -> dist/
npm run preview   # optional: serve the build locally to sanity check it
```

`dist/` is a static bundle — HTML, JS, CSS, fonts preconnect. Deploy it to
any static host or web server.

### Pointing the build at your deployed backend

In production there's no dev-server proxy, so the app needs to know the
backend's origin at **build time**:

```bash
VITE_API_URL=https://api.gurukul.app npm run build
```

Leave it unset only if you're serving the frontend from the exact same
origin as the backend (rare — usually they're on different domains/subdomains).
Whatever origin you use here must also be listed in the backend's
`ALLOWED_ORIGINS` env var, or the browser will get CORS errors.

## Deploying the static build

### Static hosts (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3+CDN, etc.)

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variable:** `VITE_API_URL` set to your backend's origin
- Since this is a single-page app with no client-side router, there's no
  history-fallback rewrite rule needed — but it doesn't hurt to add one if
  your host asks for it (`/* -> /index.html`).

### Docker (nginx) — works on any server with Docker installed

```bash
docker build --build-arg VITE_API_URL=https://api.gurukul.app -t gurukul-client .
docker run -d --name gurukul-client -p 8080:80 gurukul-client
```

Or with compose:

```bash
VITE_API_URL=https://api.gurukul.app docker compose up -d --build
```

This serves the built static files via nginx (`nginx.conf`), with long-lived
caching for fingerprinted assets and no caching on `index.html` so new
deploys are picked up immediately without a stale service worker/browser
cache problem.

### Plain nginx / Apache on a VM (no Docker)

```bash
VITE_API_URL=https://api.gurukul.app npm run build
# copy dist/ to your web root, e.g.:
rsync -av dist/ user@server:/var/www/gurukul/
```

Point your web server's root at that directory. `nginx.conf` in this repo
is a working reference config if you're setting up nginx from scratch.

## Required configuration

| Variable        | When needed                          | Example                        |
|------------------|---------------------------------------|---------------------------------|
| `VITE_API_URL`   | Any production build (baked in at build time, not runtime) | `https://api.gurukul.app` |

There's no `.env` read at runtime in the browser — Vite only substitutes
`VITE_*` variables at build time, so **rebuild whenever the backend URL
changes**, you can't change it by editing a file on the server afterward.

## Notes on what's already handled

- **Offline-safe boot**: if the backend is unreachable, the app falls back
  to a local persona list so the UI still renders (browsing, personas,
  layout) — only actual chat replies require the live server.
- **Error boundary**: a render-time crash anywhere in the tree shows a
  recovery screen with a reload button instead of a blank page.
- **Chat history persistence**: stored in `localStorage`, best-effort (never
  breaks the app if storage is unavailable, e.g. private browsing).
- **Request timeouts**: both the status/persona fetches and the chat call
  are wrapped in client-side timeouts so a hung network request can't leave
  the UI stuck loading forever.
- **Vendor code splitting**: MUI/framer-motion/React are split into a
  separate `vendor` chunk so browsers can cache them independently from
  app code that changes more often.

## Things you still need to decide before shipping

- **Analytics/error tracking**: nothing is wired up (e.g. Sentry, PostHog) —
  add it in `main.tsx` if you want visibility into real-world crashes.
- **CSP / security headers**: the provided `nginx.conf` is intentionally
  minimal (caching + SPA fallback). Add `Content-Security-Policy` and other
  headers there if your threat model calls for it.
- **CDN**: for a global audience, put a CDN in front of whichever host you
  pick — the build output is fully static and CDN-friendly as-is.
