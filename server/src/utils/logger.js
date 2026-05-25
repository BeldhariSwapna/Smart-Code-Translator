import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === "production"
      ? winston.format.json()
      : winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
          return `${timestamp} [${level.toUpperCase()}] ${message}${metaStr}${stack ? `\n${stack}` : ""}`;
        })
  ),
  transports: [
    new winston.transports.Console(),
    ...(process.env.NODE_ENV === "production"
      ? [
          new winston.transports.File({ filename: path.join(__dirname, "../../logs/error.log"), level: "error", maxSize: "10m", maxFiles: 5 }),
          new winston.transports.File({ filename: path.join(__dirname, "../../logs/combined.log"), maxSize: "10m", maxFiles: 5 }),
        ]
      : []),
  ],
});

export default logger;
