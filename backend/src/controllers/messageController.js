import fs from "fs";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import cloudinary from "../config/cloudinary.js";

/* ----------------------------------------------------
   SEND TEXT MESSAGE
---------------------------------------------------- */
export const sendMessage = async (req, res) => {
  const { chatId, content, replyTo } = req.body;

  let message = await Message.create({
    sender: req.user._id,
    chat: chatId,
    content,
    replyTo: replyTo || null,
    readBy: [req.user._id],
  });

  message = await message.populate([
    { path: "sender", select: "name avatar" },
    {
      path: "replyTo",
      populate: { path: "sender", select: "name" },
    },
  ]);

  req.io.to(chatId).emit("receive-message", message);

  res.status(201).json(message);
};

/* ----------------------------------------------------
   GET MESSAGES BY CHAT
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
   MARK MESSAGES AS SEEN
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
    res.status(500).json({ message: "Failed to update seen" });
  }
};

/* ----------------------------------------------------
   SEND IMAGE MESSAGE
---------------------------------------------------- */
export const sendImageMessage = async (req, res) => {
  try {
    const { chatId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "chat-images" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return res.status(500).json({ message: "Cloudinary upload failed" });
        }

        const message = await Message.create({
          sender: req.user._id,
          chat: chatId,
          type: "image",
          fileUrl: result.secure_url,
        });

        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: message._id,
        });

        res.status(201).json(message);
      }
    );

    // 🚨 THIS LINE IS MANDATORY
    uploadStream.end(req.file.buffer);

  } catch (err) {
    console.error("Send image failed:", err);
    res.status(500).json({ message: "Image upload failed" });
  }
};


/* ----------------------------------------------------
   SEND FILE / AUDIO MESSAGE
---------------------------------------------------- */
export const sendFileMessage = async (req, res) => {
  try {
    const { chatId, type } = req.body;

    if (!req.file || !chatId || !type) {
      return res
        .status(400)
        .json({ message: "File, chatId & type required" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
  { folder: "chat-images" },
  async (error, result) => {
    if (error) throw error;

    const message = await Message.create({
      sender: req.user._id,
      chat: chatId,
      type: "image",
      fileUrl: result.secure_url,
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
    });

    res.status(201).json(message);
  }
);

uploadStream.end(req.file.buffer); // ✅ THIS IS CRITICAL


    fs.unlinkSync(req.file.path); // ✅ prevent temp file leak

    const message = await Message.create({
      sender: req.user._id,
      chat: chatId,
      content: uploadRes.secure_url,
      type, // "audio" | "file"
      fileName: req.file.originalname,
      fileSize: req.file.size,
      readBy: [req.user._id],
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
    });

    const fullMessage = await Message.findById(message._id)
      .populate("sender", "name avatar");

    res.status(201).json(fullMessage);
  } catch (err) {
    console.error("File upload error:", err);
    res.status(500).json({ message: "Failed to send file" });
  }
};

/* ----------------------------------------------------
   EDIT MESSAGE (TEXT ONLY)
---------------------------------------------------- */
export const editMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (message.type !== "text") {
      return res
        .status(400)
        .json({ message: "Only text messages can be edited" });
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
   DELETE MESSAGE (SOFT DELETE)
---------------------------------------------------- */
export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const { forEveryone } = req.body;

  const message = await Message.findById(messageId);
  if (!message) return res.status(404).json({ message: "Not found" });

  // DELETE FOR EVERYONE
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
  }

  // DELETE FOR ME
  else {
    if (!message.deletedFor.includes(req.user._id)) {
      message.deletedFor.push(req.user._id);
      await message.save();
    }
  }

  res.json({ success: true });
};
