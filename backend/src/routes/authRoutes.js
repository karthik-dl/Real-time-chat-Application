import express from "express";
import { signup, login } from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register new user
 * @access  Public
 */
router.post("/signup", signup);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (handled on frontend by removing token)
 * @access  Private
 */
router.post("/logout", protect, (req, res) => {
  res.json({ message: "Logged out successfully" });
});

export default router;
