# Gurukul

Persona-based AI chat app — sit down with an AI "guru" and talk it through.

- **`/client`** — React + Vite frontend (deploy to Vercel/Netlify)
- **`/server`** — Express + TypeScript backend (deploy to Render)

See the README inside each folder for that part's setup and deploy details.

## Quick local dev

```bash
# Terminal 1
cd server
cp .env.example .env   # add at least one LLM API key
npm install
npm run dev             # http://localhost:5001

# Terminal 2
cd client
npm install
npm run dev              # http://localhost:5173
```
