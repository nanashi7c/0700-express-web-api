import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getProjectBySlug, listProjects } from "../controllers/project.js";


const router = Router();

router.get("/projects", authMiddleware, asyncHandler(listProjects));
router.get("/projects/:slug", authMiddleware, asyncHandler(getProjectBySlug));

export default router;
