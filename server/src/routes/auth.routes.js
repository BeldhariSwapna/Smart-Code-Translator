import {Router} from "express";
import {
    registerUser,
    loginUser,
    googleAuth,
    getMe,
    logout,
} from "../controllers/auth.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";

const router=Router();

//Public routes (no auth needed, but rate-limited against brute force)
router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/google", authLimiter, googleAuth);

//protected routes (auth required)
router.get("/me",authenticate,getMe);
router.post("/logout",authenticate,logout);

export default router;