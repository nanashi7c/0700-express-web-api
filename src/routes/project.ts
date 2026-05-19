import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as projectController from "../controllers/project.js";


const router = Router();

router.get("/projects", authMiddleware, asyncHandler(projectController.list));
router.get(
  "/projects/:slug",
  authMiddleware,
  asyncHandler(projectController.getBySlug),
);

export default router;
