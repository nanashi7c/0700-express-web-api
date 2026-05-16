import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getMe } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
router.get("/me", authMiddleware, asyncHandler(getMe));
export default router;
