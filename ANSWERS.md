# Technical Assessment — ANSWERS.md

**Project:** Book Finder (Open Library public API consumer)  
**Repo:** Book-Recommendation-System-

---

## 1. How to run

Exact steps on a fresh machine (after cloning the repo):

**Install & run backend**

```bash
cd backend
npm install
npm start
```

Expected: `Server running on http://localhost:5000`

**Install & run frontend** (second terminal)

```bash
cd frontend
npm install
npm run dev
```

Open the dev URL from the terminal (typically `http://localhost:5173`).

**Nothing else to install** beyond Node.js/npm. No API key. Optional: copy `.env.example` to `backend/.env` if you need a custom `PORT` (default `5000`).

**Verify:** search `the great gatsby` → results with covers → click a book → **Find Similar Books** → toggle dark mode.

---

## 2. Stack choice

**Chosen:** React (Vite) frontend + Node/Express backend + Open Library.

**Why this works well here**

- **Open Library** is free, public, and fits the brief (search, works, subjects, covers) with no API key.
- **Express** is a thin proxy: validation, timeouts, caching, and stable JSON for the UI without exposing the browser to CORS/rate-limit quirks.
- **React** fits modals, search state, loading/error UI, and a card grid without heavy tooling.

**Worse choices (for this task)**

- **CLI only:** meets “public API” but weaker “useful” UX for browsing covers and similar books.
- **Frontend-only calling Open Library:** works for demos but harder to enforce timeouts, cache, and consistent error shapes for assessment testing.
- **Heavy framework (Next, Nest, Redux):** more boilerplate than needed for a focused search + details flow.

---

## 3. One real edge case

**Edge case:** Browser **cached book cover images** load before React attaches `onLoad`, so `imageLoaded` stays `false` and the placeholder covers the real cover forever.

**Without handling:** Users only see the placeholder even when `coverImage` is valid (common with lazy/cached `<img>`).

**Handling:** On mount / when the cover URL changes, check `img.complete` and `naturalWidth`; reset state when the URL changes; use `onError` to fall back without a broken icon.

**File & lines:** `frontend/src/components/BookCard.jsx` — lines **16–21** (cached-complete check) and **11–14** (reset when `coverUrl` changes).

```jsx
useEffect(() => {
  const img = imgRef.current
  if (img?.complete && img.naturalWidth > 0) {
    setImageLoaded(true)
  }
}, [coverUrl])
```

**Related:** Cover URLs are built from `cover_i` via `frontend/src/utils/coverImage.js` and `backend/utils/coverImage.js` (`https://covers.openlibrary.org/b/id/{cover_i}-M.jpg`).

**Other edge cases (also implemented):** invalid search input — `backend/utils/bookService.js` lines **6–28**; API timeout — `backend/routes/books.js` lines **77–78**.

---

## 4. AI usage

| Tool | What I asked / used it for | What it produced | What I changed and why |
|------|---------------------------|------------------|------------------------|
| **Cursor (Claude / Auto)** | UI polish: spacing, header, cards, dark mode, responsive layout | CSS and layout updates across `App.css`, `BookCard.css`, `SearchBar.css`, etc. | Toned down bright gradients and emoji-heavy header; aligned with a minimal production look per my preference. |
| **Cursor** | Fix covers not showing on cards | `coverImage.js` helpers, `BookCard.jsx` load/error logic, backend `cover_i` handling | Kept modular utils; added cached-image `complete` check because AI’s first fix didn’t address that browser behavior. |
| **Cursor** | README / ANSWERS for assessment | Draft structure for setup and five questions | Rewrote to match exact assessment headings, current file paths, and real line numbers after refactors. |
| **Earlier AI assist** | Initial project scaffold | React components, Express routes, debounce hook | Reworked cover pipeline (`cover_i` not `cover_id`), caching in routes, and validation messages to match Open Library’s actual fields. |

**Not delegated to AI:** choice of Open Library, feature set (search / details / similar), commit strategy, and manual testing (timeout, bad input, backend down).

---

## 5. Honest gap

**Gap:** No automated tests (unit or E2E).

Search supports pagination (`offset` / `limit` on the API and numbered **page controls** with Previous/Next in the UI), but behavior is only verified manually.

**With one more day I would:**

1. Add API tests (e.g. Vitest + supertest) for validation, timeout mapping, and cover URL formatting.
2. Optionally persist dark mode in `localStorage` (currently session-only via React state).
3. Deduplicate by `id` when appending pages if Open Library ever returns overlaps at page boundaries.

---

## Commit history note

This repo has multiple commits (scaffold → features/cache → UI/cover fixes), not a single dump commit. Reviewers can run `git log --oneline` to see progression.
