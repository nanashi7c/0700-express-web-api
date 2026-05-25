import { Router } from "express";
import authRoutes from "./auth.js";
import userRoutes from "./user.js";
import projectRoutes from "./project.js";
import taskRoutes from "./task.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/users", projectRoutes);
router.use("/users", taskRoutes);

export default router;
