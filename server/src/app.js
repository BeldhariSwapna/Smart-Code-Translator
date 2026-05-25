import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import * as Sentry from "@sentry/node";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";
import {
    errorHandler,
    notFoundHandler,
} from "./middleware/error.middleware.js";
import { apiLimiter } from "./middleware/rateLimit.middleware.js";
import logger from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();
const isProduction = process.env.NODE_ENV === "production";

//Security headers (allow Monaco Editor CDN for code editor)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "unpkg.com", "cdn.jsdelivr.net"],
      workerSrc: ["'self'", "blob:", "unpkg.com", "cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "unpkg.com", "cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "blob:", "*.googleusercontent.com", "*.gstatic.com"],
      connectSrc: ["'self'", "unpkg.com", "cdn.jsdelivr.net"],
      fontSrc: ["'self'", "data:", "unpkg.com"],
    },
  },
}));

// Sentry request handler (only if DSN is configured)
const sentryEnabled = !!process.env.SENTRY_DSN;
if (sentryEnabled) {
  app.use(Sentry.Handlers.requestHandler());
}

//HTTP request logging via morgan + winston
const morganStream = { write: (msg) => logger.http(msg.trim()) };
app.use(morgan(":method :url :status :res[content-length] - :response-time ms", { stream: morganStream }));

//Compress responses
app.use(compression());

//Allow React frontend to talk to this backend
app.use(cors({
    origin:process.env.CLIENT_URL || "http://localhost:5173"
}));

//Convert incoming JSON requests to Javascript objects
app.use(express.json({ limit: "1mb" }));

//Global rate limit
app.use("/api", apiLimiter);

//Health check
app.get("/api/health", (req, res) => {
    res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});

//Mount all API routes under /api
app.use("/api", routes);

// Serve frontend in production
if (isProduction) {
  const clientDist = path.resolve(__dirname, "../../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

if (sentryEnabled) {
  app.use(Sentry.Handlers.errorHandler());
}

// Handle errors
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
