import dotenv from "dotenv";
import dns from "node:dns";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import * as Sentry from "@sentry/node";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

import logger from "./src/utils/logger.js";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,
  });
  logger.info("Sentry initialized for server");
}

// Use Google DNS as fallback for MongoDB Atlas SRV resolution
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const { default: app } = await import("./src/app.js");
const { default: connectDB } = await import("./src/config/db.config.js");
const PORT= process.env.PORT || 5000;
let server;

const startServer=async()=>{
    try{
        await connectDB();
        server = app.listen(PORT,()=>{
            logger.info(`Server started on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
        });
    }
    catch(error){
        logger.error("Failed to start server", { error: error.message });
        process.exit(1);
    }
};

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      logger.info("HTTP server closed.");
    });
  }
  await mongoose.connection.close(false);
  logger.info("MongoDB connection closed.");
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

startServer();