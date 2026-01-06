import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import cloudinary from "../config/cloudinary.js";

/* ----------------------------------------------------
   🔒 BLOCK CHECK (Reusable)
---------------------------------------------------- */
const checkBlocked = async (chatId, senderId) => {
  const chat = await Chat.findById(chatId).populate("members");

  if (!chat) {
    return { error: "Chat not found" };
  }

  // Only for 1-to-1 chats
  if (!chat.isGroupChat) {
    const receiver = chat.members.find(
      (m) => m._id.toString() !== senderId.toString()
    );

    if (receiver?.blockedUsers?.includes(senderId.toString())) {
      return { error: "You are blocked" };
    }
  }

  return { chat };
};

/* ----------------------------------------------------
   ✉️ SEND TEXT MESSAGE
---------------------------------------------------- */
export const sendMessage = async (req, res) => {
  try {
    const { chatId, content, replyTo } = req.body;

    const { error } = await checkBlocked(chatId, req.user._id);
    if (error) return res.status(403).json({ message: error });

    let message = await Message.create({
      sender: req.user._id,
      chat: chatId,
      content,
      replyTo: replyTo || null,
      readBy: [req.user._id],
    });

    message = await message.populate([
      { path: "sender", select: "name avatar" },
      { path: "replyTo", populate: { path: "sender", select: "name" } },
    ]);

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
    });

    req.io.to(chatId).emit("receive-message", message);

    res.status(201).json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};

/* ----------------------------------------------------
   📥 GET MESSAGES
---------------------------------------------------- */
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

/* ----------------------------------------------------
   🖼️ SEND IMAGE MESSAGE
---------------------------------------------------- */
export const sendImageMessage = async (req, res) => {
  try {
    const { chatId } = req.body;

    const { error } = await checkBlocked(chatId, req.user._id);
    if (error) return res.status(403).json({ message: error });

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "chat-images" },
      async (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Image upload failed" });
        }

        const message = await Message.create({
          sender: req.user._id,
          chat: chatId,
          type: "image",
          content: result.secure_url,
          readBy: [req.user._id],
        });

        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: message._id,
        });

        const fullMessage = await message.populate(
          "sender",
          "name avatar"
        );

        req.io.to(chatId).emit("receive-message", fullMessage);
        res.status(201).json(fullMessage);
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error("Send image error:", err);
    res.status(500).json({ message: "Image upload failed" });
  }
};

/* ----------------------------------------------------
   📎 SEND FILE MESSAGE
---------------------------------------------------- */
export const sendFileMessage = async (req, res) => {
  try {
    const { chatId, type } = req.body;

    const { error } = await checkBlocked(chatId, req.user._id);
    if (error) return res.status(403).json({ message: error });

    if (!req.file || !type) {
      return res
        .status(400)
        .json({ message: "File and type required" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "chat-files" },
      async (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "File upload failed" });
        }

        const message = await Message.create({
          sender: req.user._id,
          chat: chatId,
          type,
          content: result.secure_url,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          readBy: [req.user._id],
        });

        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: message._id,
        });

        const fullMessage = await message.populate(
          "sender",
          "name avatar"
        );

        req.io.to(chatId).emit("receive-message", fullMessage);
        res.status(201).json(fullMessage);
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error("Send file error:", err);
    res.status(500).json({ message: "Failed to send file" });
  }
};

/* ----------------------------------------------------
   ✏️ EDIT MESSAGE
---------------------------------------------------- */
export const editMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const message = await Message.findById(id);

    if (!message)
      return res.status(404).json({ message: "Message not found" });

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    message.content = content;
    await message.save();

    res.json(message);
  } catch (err) {
    console.error("Edit message error:", err);
    res.status(500).json({ message: "Failed to edit message" });
  }
};

/* ----------------------------------------------------
   🗑️ DELETE MESSAGE (ME / EVERYONE)
---------------------------------------------------- */
export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const { forEveryone } = req.body;

  const message = await Message.findById(messageId);
  if (!message) return res.status(404).json({ message: "Not found" });

  if (forEveryone) {
    if (!message.sender.equals(req.user._id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    message.isDeleted = true;
    message.content = "";
    await message.save();

    req.io.to(message.chat.toString()).emit("message-deleted", {
      messageId,
      forEveryone: true,
    });
  } else {
    if (!message.deletedFor.includes(req.user._id)) {
      message.deletedFor.push(req.user._id);
      await message.save();
    }
  }

  res.json({ success: true });
};

/* ----------------------------------------------------
   🧹 CLEAR CHAT (FOR ME)
---------------------------------------------------- */
export const clearChatForMe = async (req, res) => {
  const { chatId } = req.body;

  await Message.updateMany(
    { chat: chatId },
    { $addToSet: { deletedFor: req.user._id } }
  );

  res.json({ message: "Chat cleared" });
};

/* ----------------------------------------------------
   👀 MARK MESSAGES AS SEEN
---------------------------------------------------- */
export const markMessagesSeen = async (req, res) => {
  try {
    const { chatId } = req.params;

    await Message.updateMany(
      {
        chat: chatId,
        readBy: { $ne: req.user._id },
      },
      {
        $addToSet: { readBy: req.user._id },
      }
    );

    res.json({ message: "Messages marked as seen" });
  } catch (err) {
    console.error("Seen update error:", err);
    res.status(500).json({ message: "Failed to mark seen" });
  }
};
