# Persona Web Server (Gurukul backend)

Express + TypeScript API that powers a persona-based chat app (Hitesh / Piyush
"gurus"), backed by your choice of OpenAI, Anthropic, or Gemini. Everything
except the actual chat call (personas list, health, status) works even with
no API key configured.

## Endpoints

| Method | Path            | Purpose                                   |
|--------|-----------------|--------------------------------------------|
| GET    | `/api/health`   | Liveness check (uptime)                    |
| GET    | `/api/status`   | Which LLM providers are configured         |
| GET    | `/api/personas` | Public persona metadata (no system prompts)|
| POST   | `/api/chat`     | Send a message, get a reply                |

## Local development

```bash
cp .env.example .env   # fill in at least one *_API_KEY
npm install
npm run dev             # tsx watch, http://localhost:5001
```

## Production build (bare metal / VM)

```bash
npm ci
npm run build           # tsc -> dist/
NODE_ENV=production npm start
```

Put a process manager in front of it so it restarts on crash and on reboot:

```bash
npm install -g pm2
pm2 start dist/index.js --name gurukul-api
pm2 save
pm2 startup             # follow the printed instructions
```

Then reverse-proxy it (nginx/Caddy) and terminate TLS there. Example nginx:

```nginx
server {
    listen 443 ssl;
    server_name api.yourdomain.com;
    location / {
        proxy_pass http://127.0.0.1:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Docker (works on any server with Docker installed)

```bash
cp .env.example .env    # fill in your keys + ALLOWED_ORIGINS
docker compose up -d --build
```

Or without compose:

```bash
docker build -t gurukul-api .
docker run -d --name gurukul-api --env-file .env -p 5001:5001 gurukul-api
```

The image runs as a non-root user and exposes a container `HEALTHCHECK`
against `/api/health`.

## One-click / PaaS hosts

Render, Railway, Fly.io, and similar platforms all work with either the
Dockerfile above or, if they build from source directly, these settings:

- **Build command:** `npm ci && npm run build`
- **Start command:** `npm start`
- **Node version:** 20+

Set the environment variables below in the platform's dashboard — do not
commit a real `.env` file.

## Required environment variables

See `.env.example` for the full list with defaults. At minimum for a working
deploy, set:

- One of `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`
- `ALLOWED_ORIGINS` — comma-separated list of the exact origin(s) your
  frontend is served from in production (e.g. `https://gurukul.app`).
  **This must not be left as `localhost` in production** — the API will
  reject cross-origin requests from anything not in this list.
- `NODE_ENV=production`

The server validates all environment variables on boot (via `zod`) and will
exit immediately with a clear error if something is missing or malformed,
rather than starting in a broken state.

## Notes on production behavior already built in

- `trust proxy` is enabled in production so rate limiting and `req.ip` see
  the real client IP behind a reverse proxy/load balancer.
- `helmet`, `compression`, and CORS allowlisting are on by default.
- Two-tier rate limiting: a general per-IP budget for all routes, and a
  tighter one specifically for `/api/chat` since each call costs money.
- Requests to LLM providers are wrapped in a timeout (`LLM_TIMEOUT_MS`) so a
  hung provider call can't hang a client request forever.
- `SIGTERM`/`SIGINT` trigger a graceful shutdown (finish in-flight requests,
  then exit) — important for zero-downtime deploys and container restarts.
- Unhandled exceptions are logged as structured JSON and exit the process;
  most container platforms/PM2 will restart it automatically.

## Things you still need to decide before shipping

These are intentionally left to you since they depend on your setup:

- **Logging/monitoring**: current logger writes structured JSON to stdout —
  fine for most PaaS log pipelines, but wire up a real APM/error tracker
  (Sentry, Datadog, etc.) if you want alerting.
- **Secrets management**: don't commit `.env`; use your host's secret store.
- **Persistence**: this MVP is stateless (no database) — chat history is
  passed in by the client each request, nothing is stored server-side.
- **Horizontal scaling**: safe to run multiple instances behind a load
  balancer as-is, since there's no in-memory state shared across requests
  (rate limiting is per-instance, not global — use a shared store like
  Redis if you need a global limit across multiple instances).
