export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);
    const onlineUsers = new Map();
    // -------------------------
    // USER ONLINE
    // -------------------------
     socket.on("user-online", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });

    // -------------------------
    // JOIN CHAT ROOM
    // -------------------------
    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
    });

    // -------------------------
    // SEND MESSAGE
    // -------------------------
    socket.on("send-message", (message) => {
      const chatId =
        typeof message.chat === "object"
          ? message.chat._id
          : message.chat;

      // 📩 send message to OTHER users in chat
      socket.to(chatId).emit("receive-message", message);

      // ✓✓ delivered → sender only
      socket.emit("message-delivered", {
        messageId: message._id,
        deliveredAt: Date.now(),
      });
    });

    // -------------------------
    // MESSAGE SEEN
    // -------------------------
    socket.on("message-seen", ({ chatId, messageId }) => {
      socket.to(chatId).emit("message-seen", {
        messageId,
        seenAt: Date.now(),
      });
    });

    socket.on("typing", ({ chatId, userId }) => {
  socket.to(chatId).emit("typing", { chatId, userId });
});

socket.on("stop-typing", ({ chatId, userId }) => {
  socket.to(chatId).emit("stop-typing", { chatId, userId });
});

    // -------------------------
    // DISCONNECT
    // -------------------------
      socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit("online-users", Array.from(onlineUsers.keys()));
      });
  });
}