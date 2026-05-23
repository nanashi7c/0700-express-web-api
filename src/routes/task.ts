import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as taskController from "../controllers/task.js";

const router = Router();

router.get("/tasks", authMiddleware, asyncHandler(taskController.list));
router.post("/tasks", authMiddleware, asyncHandler(taskController.create));
router.get("/tasks/:id", authMiddleware, asyncHandler(taskController.getById));
router.patch("/tasks/:id", authMiddleware, asyncHandler(taskController.updateById));
router.delete(
  "/tasks/:id",
  authMiddleware,
  asyncHandler(taskController.deleteById),
);

export default router;
