# Smart Code Translater

AI-powered code translation, analysis, optimization, explanation, and AI mentor chatbot built with the **MERN stack** + **Gemini API** + **Tailwind CSS**.

## Architecture

```
client/   → React + Vite + Tailwind CSS (Vercel)
server/   → Node.js + Express + MongoDB (Render)
```

## Features

- **Translate** code between 18+ programming languages
- **Analyze** time/space complexity
- **Optimize** code for performance
- **Explain** code in simple terms
- **AI Mentor** chatbot — floating assistant that knows your editor code
- **History** with search, filter (by type/language), and favorites
- **Authentication** — email/password + Google OAuth
- **Diff view** to see translation changes
- **Download** translated code files

## Tech Stack

| Layer       | Tech                                                       |
| ----------- | ---------------------------------------------------------- |
| Frontend    | React 19, Vite, Tailwind CSS 3, Monaco Editor, React Router |
| Backend     | Node.js, Express 5                                         |
| Database    | MongoDB Atlas (Mongoose)                                   |
| AI          | Google Gemini API (gemini-3.5-flash)                       |
| Auth        | JWT + Google OAuth 2.0                                     |
| Monitoring  | Sentry (optional), Winston + Morgan logging                |
| CI/CD       | GitHub Actions                                             |

## Prerequisites

- Node.js 20+
- MongoDB Atlas cluster (or local MongoDB)
- Google Gemini API key
- Google OAuth 2.0 Client ID

## Environment Variables

### Server (`server/.env`)

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>
JWT_SECRET=<64-char-random-string>
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=<your-google-client-id>
GEMINI_API_KEY=<your-gemini-api-key>
SENTRY_DSN=<your-sentry-dsn>  # optional
```

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
VITE_SENTRY_DSN=<your-sentry-dsn>  # optional
```

## Local Development

```bash
# Terminal 1 — Server
cd server
npm install
npm run dev

# Terminal 2 — Client
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Running Tests

```bash
npm test
```

## Deployment

### Frontend — Vercel

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Set root directory to `client/`
3. Add environment variables (`VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`)
4. Deploy

### Backend — Render

1. Create a [Render Web Service](https://render.com) from your GitHub repo
2. Set root directory to `server/`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all environment variables from `server/.env`
6. Set `NODE_ENV=production` and `CLIENT_URL` to your Vercel domain

## API Endpoints

| Method | Endpoint             | Auth | Description              |
| ------ | -------------------- | ---- | ------------------------ |
| POST   | /api/auth/register   | No   | Register with email      |
| POST   | /api/auth/login      | No   | Login with email         |
| POST   | /api/auth/google     | No   | Google OAuth login       |
| GET    | /api/auth/me         | Yes  | Get current user profile |
| POST   | /api/code/translate  | Yes  | Translate code           |
| POST   | /api/code/analyze    | Yes  | Analyze complexity       |
| POST   | /api/code/optimize   | Yes  | Optimize code            |
| POST   | /api/code/explain    | Yes  | Explain code             |
| POST   | /api/code/chat       | Yes  | AI mentor chat           |
| GET    | /api/history         | Yes  | List history (paginated) |
| POST   | /api/history         | Yes  | Save history             |
| DELETE | /api/history/:id     | Yes  | Delete history entry     |
| PATCH  | /api/history/:id     | Yes  | Update (favorite, etc.)  |
| GET    | /api/health          | No   | Health check             |

## License

MIT
