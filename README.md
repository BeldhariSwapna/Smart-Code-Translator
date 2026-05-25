<div align="center">
  <h1>Smart Code Translater</h1>
  <p>AI-powered code translation, analysis, optimization, and mentorship — powered by <strong>Google Gemini</strong>.</p>
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#deployment">Deployment</a> •
    <a href="#api-reference">API</a>
  </p>
</div>

---

## Overview

Smart Code Translater is a full-stack web application that leverages Google's Gemini AI to help developers translate code between 18+ programming languages, analyze complexity, optimize performance, explain code logic, and get real-time mentorship through an AI chatbot.

---

## Features

| Feature | Description |
|---|---|
| **Translate** | Convert code between 18+ languages with syntax-perfect output |
| **Analyze** | Get time & space complexity analysis with improvement suggestions |
| **Optimize** | Receive performance-optimized code alternatives |
| **Explain** | Understand complex code in simple natural language |
| **AI Mentor** | Floating chatbot that's aware of your current editor code — ask questions conversationally |
| **History** | Search, filter by type/language, bookmark favorites, paginated |
| **Auth** | Email/password registration + Google OAuth |
| **Diff View** | Side-by-side comparison of original vs translated code |
| **Download** | Export translated/optimized code as files |

---

## Tech Stack

```
Frontend         React 19 · Vite · Tailwind CSS 3 · Monaco Editor
Backend          Node.js · Express 5 · Mongoose
Database         MongoDB Atlas
AI               Google Gemini (gemini-3.5-flash)
Auth             JWT · Google OAuth 2.0
Logging          Winston · Morgan
Monitoring       Sentry (optional)
Testing          Vitest · Supertest
CI/CD            GitHub Actions
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB Atlas cluster (or local instance)
- Google Gemini API key ([get one free](https://aistudio.google.com/apikey))
- Google OAuth 2.0 Client ID ([create in GCP Console](https://console.cloud.google.com/apis/credentials))

### Installation

```bash
# Clone the repository
git clone https://github.com/BeldhariSwapna/Smart-Code-Translator.git
cd smart-code-translater

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Configuration

**Server** — `server/.env`

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/smartCodeTranslator
JWT_SECRET=<64-char-random-string>
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=<your-google-client-id>
GEMINI_API_KEY=<your-gemini-api-key>
```

**Client** — `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
```

### Run Locally

```bash
# Terminal 1 — Server
cd server
npm run dev

# Terminal 2 — Client
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Run Tests

```bash
# All tests
npm test

# Server only
cd server && npm test

# Client only
cd client && npm test
```

---

## Deployment

### Frontend — Vercel

| Step | Action |
|---|---|
| 1 | Push repo to GitHub |
| 2 | Import repo in [Vercel](https://vercel.com/new) |
| 3 | Set **Root Directory** to `client/` |
| 4 | Add env vars: `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID` |
| 5 | Deploy |

### Backend — Render

| Step | Action |
|---|---|
| 1 | Create [Render Web Service](https://render.com) from same repo |
| 2 | Set **Root Directory** to `server/` |
| 3 | **Build Command:** `npm install` |
| 4 | **Start Command:** `npm start` |
| 5 | Add all env vars from `server/.env` |
| 6 | Set `NODE_ENV=production` and `CLIENT_URL` to your Vercel domain |
| 7 | Deploy |

---

## API Reference

All endpoints except `/api/auth/*` and `/api/health` require a `Bearer <token>` in the `Authorization` header.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Register with name, email, password |
| `POST` | `/api/auth/login` | — | Login with email, password |
| `POST` | `/api/auth/google` | — | Google OAuth sign-in |
| `GET` | `/api/auth/me` | ✓ | Get authenticated user profile |
| `POST` | `/api/code/translate` | ✓ | Translate code between languages |
| `POST` | `/api/code/analyze` | ✓ | Analyze time/space complexity |
| `POST` | `/api/code/optimize` | ✓ | Suggest optimized code |
| `POST` | `/api/code/explain` | ✓ | Explain code in plain language |
| `POST` | `/api/code/chat` | ✓ | AI mentor conversation |
| `GET` | `/api/history` | ✓ | List history (paginated) |
| `POST` | `/api/history` | ✓ | Save history entry |
| `DELETE` | `/api/history/:id` | ✓ | Delete history entry |
| `PATCH` | `/api/history/:id` | ✓ | Update entry (favorite toggle, etc.) |
| `GET` | `/api/health` | — | Health check |

---

## Project Structure

```
smart-code-translater/
├── client/                   # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── constants/        # Language definitions
│   │   ├── context/          # React context providers
│   │   ├── pages/            # Route pages
│   │   └── services/         # API client functions
│   ├── vercel.json           # Vercel deployment config
│   └── vite.config.js
├── server/                   # Express backend
│   ├── src/
│   │   ├── config/           # DB, Gemini, Google Auth config
│   │   ├── constants/        # Prompts, language mappings
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/        # Auth, rate limiting, error handling
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Route definitions
│   │   ├── services/         # Business logic
│   │   └── utils/            # Logger, JWT, prompt parser
│   └── tests/
├── .github/workflows/        # CI/CD pipelines
├── .env.example              # Environment variable reference
├── .gitignore
└── README.md
```

---

## License

[MIT](LICENSE)
