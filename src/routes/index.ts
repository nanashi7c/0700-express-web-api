import { Router } from "express";
import authRoutes from "./auth.js";
import userRoutes from "./user.js";
import projectRoutes from "./project.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/users", projectRoutes);

export default router;
