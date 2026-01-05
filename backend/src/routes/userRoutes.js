// import express from "express";
// import protect from "../middlewares/authMiddleware.js";
// import User from "../models/User.js";

// const router = express.Router();

// router.get("/", protect, async (req, res) => {
//   const users = await User.find({ _id: { $ne: req.user._id } })
//     .select("-password");
//   res.json(users);
// });

// export default router;
import express from "express";
import protect from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { uploadAvatar,getMyProfile } from "../controllers/userController.js";
import { getAllUsers } from "../controllers/userController.js";

const router = express.Router();

// GET ALL USERS (except logged-in user)
router.get("/", protect, getAllUsers);
router.post(
  "/upload-avatar",
  protect,
  upload.single("image"),
  uploadAvatar
);
router.get("/me", protect, getMyProfile);

export default router;

