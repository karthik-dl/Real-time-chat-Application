// import { io } from "socket.io-client";
// import { useEffect } from "react";

// const socket = io("http://localhost:5000");

// export const useSocket = (userId) => {
//   useEffect(() => {
//     if (userId) {
//       socket.emit("user-online", userId);
//     }
//   }, [userId]);

//   return socket;
// };

import { useEffect } from "react";
import { useSocketStore } from "../store/socketStore";
import { useChatStore } from "../store/chatStore";

const useSocket = (userId) => {
  const { socket } = useSocketStore();
  const { addMessage, setOnlineUsers, } = useChatStore();
 
  useEffect(() => {
    if (!socket || !userId) return;

    // user presence
    socket.emit("user-online", userId);
  // socket.emit("join-chat", chatId);
    // receive messages
    socket.on("receive-message", (message) => {
      addMessage(message);
    });

    // online users
    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });
    socket.on("typing", ({ userId }) => {
  setTypingUser(userId);
});

socket.on("stop-typing", () => {
  setTypingUser(null);
});
socket.on("message-seen", (id) =>
      updateMessageStatus(id, "seen")
    );
    return () => {
      socket.off("receive-message");
      socket.off("online-users");
    };
  }, [socket, userId]);

  return socket;
};

export default useSocket;
