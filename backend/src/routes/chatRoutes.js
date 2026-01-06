// import express from "express";
// import protect from "../middlewares/authMiddleware.js";
// import authMiddleware from "../middlewares/authMiddleware.js";
// import {
//   createChat,
//   getChats,
//   deleteChat,createGroupChat
// } from "../controllers/chatController.js";

// const router = express.Router();

// router.post("/", protect, createChat);
// router.get("/", protect, getChats);
// router.delete("/:id", protect, deleteChat);
// router.post("/group", authMiddleware, createGroupChat);


// export default router;


import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  createChat,
  getChats,
  deleteChat,
  createGroupChat,
  addToGroup,
  removeFromGroup,
  leaveGroup,
  deleteGroup,
} from "../controllers/chatController.js";

const router = express.Router();

// normal chats
router.post("/", protect, createChat);
router.get("/", protect, getChats);
router.delete("/:id", protect, deleteChat);

// group chats
router.post("/group", protect, createGroupChat);
router.put("/group/add", protect, addToGroup);
router.put("/group/remove", protect, removeFromGroup);
router.put("/group/leave", protect, leaveGroup);
router.delete("/group/delete", protect, deleteGroup);
// router.post("/access", protect, accessChat);
// router.get("/", protect, fetchChats);
router.put("/group/update", async (req, res) => {
  const { chatId, groupName, groupAvatar } = req.body;

  const chat = await Chat.findByIdAndUpdate(
    chatId,
    { groupName, groupAvatar },
    { new: true }
  ).populate("members", "name avatar");

  res.json(chat);
});

export default router;
