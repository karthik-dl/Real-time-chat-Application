import express from "express";
// import multer from "multer";
import protect from "../middlewares/authMiddleware.js";
import {
  createGroup,
  updateGroup,
  addMember,
  removeMember,
  getGroupDetails,leaveGroup,uploadGroupAvatar,deleteGroup,makeAdmin
} from "../controllers/groupController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();



/**
 * Group APIs
 */
router.post("/", protect, createGroup);
router.put("/:id", protect, updateGroup);
router.get("/:id", protect, getGroupDetails);

router.post("/:id/members", protect, addMember);
router.delete("/:id/members/:userId", protect, removeMember);
router.post(
  "/:id/avatar",
  protect,
  upload.single("avatar"),
  uploadGroupAvatar
);
router.post("/:id/leave", protect, leaveGroup);
router.delete("/:id", protect, deleteGroup);
router.post("/:id/admin", protect, makeAdmin);

export default router;



