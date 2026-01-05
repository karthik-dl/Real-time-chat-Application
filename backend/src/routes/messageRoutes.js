import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  sendMessage,
  getMessages,
  markMessagesSeen,
  sendImageMessage,
  sendFileMessage,
  editMessage,
  deleteMessage,
} from "../controllers/messageController.js";
import upload from "../middlewares/uploadMiddleware.js";
const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, getMessages);

// ✅ Seen
router.put("/seen/:chatId", protect, markMessagesSeen);

// Uploads
router.post("/image", protect, upload.single("file"), sendImageMessage);
router.post("/file", protect, upload.single("file"), sendFileMessage);

// Edit / Delete
router.put("/:id", protect, editMessage);
// router.delete("/:id", protect, deleteMessage);
router.delete("/:messageId", protect, deleteMessage);

export default router;