import { Router } from "express";
import {
  translate,
  analyze,
  optimize,
  explain,
  chat,
} from "../controllers/code.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import { aiLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/translate", aiLimiter, translate);
router.post("/analyze", aiLimiter, analyze);
router.post("/optimize", aiLimiter, optimize);
router.post("/explain", aiLimiter, explain);
router.post("/chat", aiLimiter, chat);

export default router;
