import express from "express";
import { authRoutes } from "./authRoute";
import { protectedRoute } from "./protectedRoute";
import { userRoutes } from "./userRoute";

const router = express.Router();

// Register all your routes here
router.use("/auth", authRoutes);
router.use("/protected", protectedRoute);
router.use("/", userRoutes);

export default router;
