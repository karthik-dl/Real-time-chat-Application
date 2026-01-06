import Chat from "../models/Chat.js";
import User from "../models/User.js";     

/* -------------------------------------------------
   CREATE OR GET ONE-TO-ONE CHAT
------------------------------------------------- */
export const createChat = async (req, res) => {
  const { userId } = req.body;

  let chat = await Chat.findOne({
    isGroupChat: false,
    members: { $all: [req.user._id, userId] },
  }).populate("members", "name avatar");

  if (chat) return res.json(chat);

  chat = await Chat.create({
    isGroupChat: false,
    members: [req.user._id, userId],
  });

  const fullChat = await Chat.findById(chat._id).populate(
    "members",
    "name avatar"
  );

  res.status(201).json(fullChat);
};

/* -------------------------------------------------
   GET ALL CHATS
------------------------------------------------- */
export const getChats = async (req, res) => {
  const chats = await Chat.find({
    members: req.user._id,
    deletedBy: { $ne: req.user._id }, // ✅ IMPORTANT
  })
    .populate("members", "name avatar")
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: "name avatar" },
    })
    .sort({ updatedAt: -1 });

  res.json(chats);
};


/* -------------------------------------------------
   DELETE CHAT
------------------------------------------------- */
export const deleteChat = async (req, res) => {
  await Chat.findByIdAndDelete(req.params.id);
  res.json({ message: "Chat deleted" });
};

/* -------------------------------------------------
   CREATE GROUP CHAT
------------------------------------------------- */
export const createGroupChat = async (req, res) => {
  try {
    let { name, users } = req.body;

    if (!name || !users) {
      return res
        .status(400)
        .json({ message: "Group name and users required" });
    }

    if (typeof users === "string") {
      users = JSON.parse(users);
    }

    if (users.length < 1) {
      return res.status(400).json({ message: "Add at least one user" });
    }

    const members = [
      ...new Set([...users, req.user._id.toString()]),
    ];

    const chat = await Chat.create({
      groupName: name,
      isGroupChat: true,
      members,
      groupAdmin: req.user._id,
    });

    const populatedChat = await Chat.findById(chat._id)
      .populate("members", "name avatar")
      .populate("groupAdmin", "name");

    res.status(201).json(populatedChat);
  } catch (err) {
    console.error("Create group error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* -------------------------------------------------
   ADD USER TO GROUP (ADMIN)
------------------------------------------------- */
export const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(404).json({ message: "Chat not found" });

  if (!chat.groupAdmin.equals(req.user._id)) {
    return res.status(403).json({ message: "Admin only" });
  }

  if (chat.members.includes(userId)) {
    return res.status(400).json({ message: "User already in group" });
  }

  chat.members.push(userId);
  await chat.save();

  const updatedChat = await Chat.findById(chatId)
    .populate("members", "name avatar")
    .populate("groupAdmin", "name");

  res.json(updatedChat);
};

/* -------------------------------------------------
   REMOVE USER (ADMIN)
------------------------------------------------- */
export const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(404).json({ message: "Chat not found" });

  if (!chat.groupAdmin.equals(req.user._id)) {
    return res.status(403).json({ message: "Admin only" });
  }

  chat.members = chat.members.filter(
    (m) => m.toString() !== userId
  );

  await chat.save();
  res.json(chat);
};

/* -------------------------------------------------
   LEAVE GROUP
------------------------------------------------- */
export const leaveGroup = async (req, res) => {
  const { chatId } = req.body;

  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(404).json({ message: "Chat not found" });

  chat.members = chat.members.filter(
    (m) => m.toString() !== req.user._id.toString()
  );

  await chat.save();
  res.json({ message: "Left group" });
};

/* -------------------------------------------------
   DELETE GROUP (ADMIN)
------------------------------------------------- */
export const deleteGroup = async (req, res) => {
  const { chatId } = req.body;

  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(404).json({ message: "Chat not found" });

  if (!chat.groupAdmin.equals(req.user._id)) {
    return res.status(403).json({ message: "Admin only" });
  }

  await Chat.findByIdAndDelete(chatId);
  res.json({ message: "Group deleted" });
};

/* -------------------------------------------------
   ACCESS CHAT (ONE-TO-ONE)
------------------------------------------------- */


/* -------------------------------------------------
   DELETE CHAT FOR ME (1-to-1 or group)
------------------------------------------------- */
export const deleteChatForMe = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  // Already deleted
  if (chat.deletedBy.includes(userId)) {
    return res.json({ message: "Chat already removed" });
  }

  chat.deletedBy.push(userId);
  await chat.save();

  res.json({ message: "Chat removed from your list" });
};

