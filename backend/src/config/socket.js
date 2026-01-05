// import User from "../models/User.js";

// // userId -> socketId
// const onlineUsers = new Map();

// const socketHandler = (io) => {
//   io.on("connection", (socket) => {
//     console.log("Socket connected:", socket.id);

//     // ---------------------------
//     // USER ONLINE
//     // ---------------------------
//     socket.on("user-online", async (userId) => {
//       if (!userId) return;

//       socket.userId = userId;
//       onlineUsers.set(userId, socket.id);

//       try {
//         await User.findByIdAndUpdate(userId, { isOnline: true });
//         io.emit("online-users", Array.from(onlineUsers.keys()));
//       } catch (err) {
//         console.error("User online update failed:", err);
//       }
//     });

//     // ---------------------------
//     // JOIN CHAT ROOM
//     // ---------------------------
//     socket.on("join-chat", (chatId) => {
//       if (!chatId) return;
//       socket.join(chatId.toString());
//     });

//     // ---------------------------
//     // SEND MESSAGE
//     // ---------------------------
//     socket.on("send-message", (message) => {
//       if (!message?.chat) return;

//       const roomId =
//         typeof message.chat === "object"
//           ? message.chat._id
//           : message.chat;

//       socket.to(roomId.toString()).emit("receive-message", message);
//     });

//     // ---------------------------
//     // TYPING INDICATORS
//     // ---------------------------
//     socket.on("typing", (chatId) => {
//       if (chatId) socket.to(chatId.toString()).emit("typing", chatId);
//     });

//     socket.on("stop-typing", (chatId) => {
//       if (chatId) socket.to(chatId.toString()).emit("stop-typing", chatId);
//     });

//     // ---------------------------
//     // MESSAGE UPDATED
//     // ---------------------------
//     socket.on("message-updated", (message) => {
//       if (!message?.chat) return;

//       const roomId =
//         typeof message.chat === "object"
//           ? message.chat._id
//           : message.chat;

//       socket.to(roomId.toString()).emit("message-updated", message);
//     });

//     // ---------------------------
//     // DISCONNECT
//     // ---------------------------
//     socket.on("disconnect", async () => {
//       const userId = socket.userId;

//       if (!userId) return;

//       onlineUsers.delete(userId);

//       try {
//         await User.findByIdAndUpdate(userId, {
//           isOnline: false,
//           lastSeen: new Date(),
//         });

//         io.emit("online-users", Array.from(onlineUsers.keys()));
//       } catch (err) {
//         console.error("Disconnect update failed:", err);
//       }

//       console.log("Socket disconnected:", socket.id);
//     });
//   });
// };

// export default socketHandler;



// import User from "../models/User.js";

// const onlineUsers = new Map(); // userId -> socketId

// const socketHandler = (io) => {
//   io.on("connection", (socket) => {
//     console.log("Socket connected:", socket.id);

//     // USER ONLINE
//     socket.on("user-online", async (userId) => {
//       if (!userId) return;
//       socket.userId = userId;
//       onlineUsers.set(userId, socket.id);

//       await User.findByIdAndUpdate(userId, { isOnline: true });
//       io.emit("online-users", Array.from(onlineUsers.keys()));
//     });

//     // JOIN CHAT
//     socket.on("join-chat", (chatId) => {
//       if (!chatId) return;
//       socket.join(chatId.toString());
//     });

//     // SEND MESSAGE
//     socket.on("send-message", (message) => {
//       if (!message?.chat) return;

//       const roomId =
//         typeof message.chat === "object"
//           ? message.chat._id
//           : message.chat;

//       // send to others
//       socket.to(roomId.toString()).emit("receive-message", message);

//       // notify sender (delivered)
//       socket.emit("message-delivered", { messageId: message._id });
//     });

//     // MARK SEEN
//     socket.on("mark-seen", ({ chatId, userId }) => {
//       if (!chatId || !userId) return;
//       socket.to(chatId.toString()).emit("message-seen", { userId });
//     });

//     // DISCONNECT
//     socket.on("disconnect", async () => {
//       const userId = socket.userId;
//       if (userId) {
//         onlineUsers.delete(userId);
//         await User.findByIdAndUpdate(userId, {
//           isOnline: false,
//           lastSeen: new Date(),
//         });
//         io.emit("online-users", Array.from(onlineUsers.keys()));
//       }
//     });
//   });
// };

// export default socketHandler;

// config/socket.js

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
