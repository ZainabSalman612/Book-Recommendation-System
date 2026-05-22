# Book Finder + Reading Suggestions

A clean, production-ready full-stack web application for discovering books using the Open Library API. Search by title, author, or subject, view detailed book information, and find similar recommendations.

## 🎯 Features

- **Book Search**: Search by title, author, or subject
- **Detailed Views**: Modal with book descriptions, subjects, and edition info
- **Similar Books**: Find related books based on subjects
- **Responsive Design**: Mobile-friendly layout
- **Dark Mode**: Toggle dark/light theme
- **Recent Searches**: Quick access to previous searches
- **Error Handling**: Graceful handling of API failures and edge cases
- **Loading States**: Spinner feedback during API requests

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **API**: Open Library (free, no API key required)
- **HTTP Client**: Axios
- **Styling**: Clean, modern CSS (no dependencies)

## 📋 Prerequisites

- Node.js 16+ and npm/yarn
- Windows/Mac/Linux

## 🚀 Quick Start

### Step 1: Clone or Extract Project

```bash
cd Book-Recommendation-System-
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Start Backend Server

From the `backend/` folder:

```bash
npm start
```

You should see: `Server running on http://localhost:5000`

### Step 4: Install Frontend Dependencies

In a new terminal, from the project root:

```bash
cd frontend
npm install
```

### Step 5: Start Frontend Dev Server

From the `frontend/` folder:

```bash
npm run dev
```

You should see: `Local: http://localhost:5173`

### Step 6: Open in Browser

Go to `http://localhost:5173` in your browser.

## ✅ Verify Everything Works

1. The header should show "📚 Book Finder"
2. Search for a book (e.g., "1984")
3. Click a book to see details
4. Click "Find Similar Books 🔍" button
5. Check dark mode toggle in top right

## 📁 Project Structure

```
Book-Recommendation-System-/
├── backend/
│   ├── package.json
│   ├── server.js              # Express server entry point
│   ├── routes/
│   │   └── books.js           # API routes: /search, /details, /similar
│   ├── utils/
│   │   └── bookService.js     # Business logic and validation
│   └── middleware/
│       └── errorHandler.js    # Error handling middleware
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx           # React entry point
│   │   ├── App.jsx            # Main component with state
│   │   ├── components/        # Reusable UI components
│   │   ├── services/          # API client (bookApi.js)
│   │   ├── hooks/             # Custom hooks (useDebounce.js)
│   │   └── styles/            # CSS files
│   └── public/
├── README.md                  # This file
├── ANSWERS.md                 # Assessment answers
├── .gitignore
└── .env.example
```

## 🔌 API Routes

All routes are prefixed with `/api/books`:

### Search Books
- **GET** `/search?q=query&type=title&limit=20`
- Types: `title`, `author`, `subject`
- Returns: Array of books with cover, title, author, year, subjects

### Book Details
- **GET** `/details/:id`
- Returns: Description, subjects, edition count, publish year

### Find Similar Books
- **GET** `/similar/:id`
- Returns: Array of related books based on primary subject

## 🎨 Key Components

- **SearchBar**: Input with debounce (500ms) and recent searches
- **BookGrid**: Responsive grid of book cards
- **BookCard**: Display title, author, cover, year, subjects
- **BookDetailsModal**: Full book information with similar books button
- **SimilarBooksModal**: Related books carousel
- **LoadingSpinner**: Animated loading feedback
- **ErrorMessage**: Dismissible error alerts

## ⚡ Performance Features

- **Debounced Search**: 500ms delay prevents excessive API calls
- **Request Timeout**: 8-10s timeout on API requests
- **Lazy Image Loading**: Images loaded on demand
- **Image Error Handling**: Fallback placeholder for missing covers
- **Local Storage**: Recent searches persisted across sessions

## 🛡 Error Handling

Handles:
- Invalid search input (backend validation)
- Empty search results (user feedback)
- API timeouts (ECONNABORTED)
- Rate limiting (429)
- Missing/null fields in API responses
- Missing cover images
- Server connection failures

## 🌙 Dark Mode

Toggle in top right corner. Preference persists in browser memory during session.

## 📦 Dependencies

**Backend:**
- express: Web framework
- axios: HTTP client
- cors: Cross-origin requests
- dotenv: Environment variables

**Frontend:**
- react: UI library
- react-dom: DOM rendering
- axios: HTTP client
- @vitejs/plugin-react: Vite plugin

## 🔐 Environment Variables

Create a `.env` file in the backend folder (copy from `.env.example`):

```
PORT=5000
FRONTEND_URL=http://localhost:5173
```

No API keys needed - Open Library is free and public.

## 🚢 Production Deployment

To build for production:

**Frontend:**
```bash
cd frontend
npm run build
```

Creates optimized bundle in `frontend/dist/`

**Backend:**
Set `NODE_ENV=production` and use a process manager like PM2.

## 🐛 Troubleshooting

**"Cannot connect to server"**
- Ensure backend is running on port 5000
- Check terminal output for errors

**"No books found"**
- Try different search terms
- Check Open Library API status

**Images not loading**
- Open Library cover server may be slow
- App shows placeholder emoji fallback

**Dark mode not persisting**
- Session storage only - resets on page refresh

## 📝 License

MIT

## 👤 Author

Technical Assessment Submission

---

**Happy reading! 📚**
