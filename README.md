# Book Finder — Open Library API Consumer

A full-stack web app built on the free [Open Library API](https://openlibrary.org/developers/api). Search books by title, author, or subject, view details and covers, and discover similar titles in one place instead of juggling the raw API and cover endpoints.

**Assessment variant:** Public API consumer (no API key required).

## What it does

- Search with filters (title / author / subject)
- Book cards with covers, year, and subjects
- Detail modal with description and edition info
- “Find similar books” based on shared subjects
- Handles slow API, API errors, and invalid user input

## Prerequisites

- [Node.js](https://nodejs.org/) **18+** (16+ should work)
- **npm** (included with Node.js)
- Two terminal windows (backend + frontend)

No API key is required. Do not commit secrets; optional env vars are documented in `.env.example`.

## How to run (fresh machine)

From the project root (`Book-Recommendation-System-`):

### Terminal 1 — Backend

```bash
cd backend
npm install
npm start
```

Wait for: `Server running on http://localhost:5000`

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually **http://localhost:5173**). If that port is busy, Vite may use **5174** — use whatever URL appears in the terminal.

### Quick check

1. Search for `1984` (type: Title).
2. Confirm book covers load on the cards.
3. Click a book → open details → try **Find Similar Books**.
4. Stop the backend and search again → you should see a connection error message (not a crash).

### Restart backend (if port 5000 is in use)

**Windows (PowerShell):**

```powershell
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
cd backend
npm start
```

## Project structure

```
Book-Recommendation-System-/
├── backend/          # Express API proxy to Open Library
├── frontend/         # React + Vite UI
├── README.md         # Setup (this file)
├── ANSWERS.md        # Technical assessment answers (5 questions)
└── .env.example      # Optional PORT / FRONTEND_URL
```

## API routes (local)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | Health check |
| GET | `/api/books/search?q=&type=&limit=&offset=` | Search books (paginated) |
| GET | `/api/books/details/:id` | Work details |
| GET | `/api/books/similar/:id` | Similar by subject |

## Error handling (what reviewers can test)

| Scenario | Behavior |
|----------|----------|
| Empty / invalid query | `400` from backend; UI shows validation message |
| No results | Friendly “no books found” message |
| Open Library slow / timeout | `504` after 5s; UI shows timeout message |
| Backend not running | Network error in UI |
| Missing or broken cover | Placeholder; no broken-image icon |

## Tech stack

- **Frontend:** React 18, Vite, CSS
- **Backend:** Node.js, Express, Axios
- **External API:** Open Library (search + covers)

## Assessment files

- **README.md** — how to run (this file)
- **ANSWERS.md** — stack choice, edge case, AI usage, honest gap

## License

MIT
