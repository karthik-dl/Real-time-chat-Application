// import { useEffect } from "react";

// import Sidebar from "../components/Sidebar/Sidebar";
// import ChatHeader from "../components/Chat/ChatHeader";
// import MessageList from "../components/Chat/MessageList";
// import ChatInput from "../components/Chat/ChatInput";

// import { useAuthStore } from "../store/authStore";
// import { useChatStore } from "../store/chatStore";
// import useSocket from "../hooks/useSocket";

// const ChatPage = () => {
//   const { user } = useAuthStore();

//   const {
//     selectedChat,
//     messages,
//     fetchChats,
//     addMessage,
//     onlineUsers,
//   } = useChatStore();

//   const socket = useSocket(user?._id);

//   // -----------------------------
//   // STOP RENDER UNTIL USER EXISTS
//   // -----------------------------
//   if (!user) {
//     return (
//       <div
//         style={{
//           height: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           color: "#6b7280",
//         }}
//       >
//         Loading user...
//       </div>
//     );
//   }

//   // -----------------------------
//   // FETCH CHATS ON LOAD
//   // -----------------------------
//   useEffect(() => {
//     fetchChats();
//   }, [fetchChats]);

//   // -----------------------------
//   // JOIN CHAT ROOM
//   // -----------------------------
//   useEffect(() => {
//     if (!socket || !selectedChat?._id) return;
//     socket.emit("join-chat", selectedChat._id);
//   }, [socket, selectedChat]);

//   // -----------------------------
//   // RECEIVE MESSAGE
//   // -----------------------------
//   useEffect(() => {
//     if (!socket) return;

//     const handleReceiveMessage = (message) => {
//       const chatId =
//         typeof message.chat === "object"
//           ? message.chat._id
//           : message.chat;

//       if (chatId === selectedChat?._id) {
//         addMessage(message);
//       }
//     };

//     socket.on("receive-message", handleReceiveMessage);
//     return () => socket.off("receive-message", handleReceiveMessage);
//   }, [socket, selectedChat, addMessage]);

//   // -----------------------------
//   // NO CHAT SELECTED
//   // -----------------------------
//   if (!selectedChat) {
//     return (
//       <div style={{ display: "flex", height: "100vh" }}>
//         <Sidebar onlineUsers={onlineUsers} />
//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: "#6b7280",
//           }}
//         >
//           Select a chat to start messaging
//         </div>
//       </div>
//     );
//   }

//   // -----------------------------
//   // CHAT VIEW
//   // -----------------------------
//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       {/* SIDEBAR */}
//       <Sidebar onlineUsers={onlineUsers} />

//       {/* CHAT COLUMN */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           height: "100vh",
//         }}
//       >
//         {/* HEADER */}
//         <ChatHeader
//           chat={selectedChat}
//           currentUserId={user._id}
//           onlineUsers={onlineUsers}
//         />

//         {/* MESSAGE LIST (SCROLLABLE) */}
//         <div style={{ flex: 1, overflow: "hidden" }}>
//           <MessageList
//             messages={messages}
//             currentUserId={user._id}
//             chat={selectedChat}
//           />
//         </div>

//         {/* INPUT (FIXED BOTTOM) */}
//         <ChatInput
//           chatId={selectedChat._id}
//           socket={socket}
//         />
//       </div>
//     </div>
//   );
// };

// export default ChatPage;




// ..............................................................

// import { useEffect } from "react";
// import Sidebar from "../components/Sidebar/Sidebar";
// import ChatHeader from "../components/Chat/ChatHeader";
// import MessageList from "../components/Chat/MessageList";
// import ChatInput from "../components/Chat/ChatInput";

// import { useAuthStore } from "../store/authStore";
// import { useChatStore } from "../store/chatStore";
// import useSocket from "../hooks/useSocket";

// const ChatPage = () => {
//   const { user } = useAuthStore();
//   const {
//     selectedChat,
//     messages,
//     fetchChats,
//     addMessage,
//     markDelivered,
//     markSeen,
//     onlineUsers,
//   } = useChatStore();

//   const socket = useSocket(user?._id);

//   if (!user) return <div>Loading...</div>;

//   useEffect(() => {
//     fetchChats();
//   }, [fetchChats]);

//   useEffect(() => {
//     if (!socket || !selectedChat) return;

//     socket.emit("join-chat", selectedChat._id);
//     socket.emit("mark-seen", {
//       chatId: selectedChat._id,
//       userId: user._id,
//     });
//   }, [socket, selectedChat]);

//   useEffect(() => {
//     if (!socket) return;

//     socket.on("receive-message", addMessage);
//     socket.on("message-delivered", ({ messageId }) =>
//       markDelivered(messageId)
//     );
//     socket.on("message-seen", ({ userId }) =>
//       markSeen(userId)
//     );

//     return () => {
//       socket.off("receive-message");
//       socket.off("message-delivered");
//       socket.off("message-seen");
//     };
//   }, [socket]);

//   if (!selectedChat) {
//     return (
//       <div style={{ display: "flex", height: "100vh" }}>
//         <Sidebar onlineUsers={onlineUsers} />
//         <div style={{ flex: 1 }}>Select a chat</div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       <Sidebar onlineUsers={onlineUsers} />

//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <ChatHeader
//           chat={selectedChat}
//           currentUserId={user._id}
//           onlineUsers={onlineUsers}
//         />

//         <div style={{ flex: 1 }}>
//           <MessageList
//             messages={messages}
//             currentUserId={user._id}
//             chat={selectedChat}
//           />
//         </div>

//         <ChatInput chatId={selectedChat._id} socket={socket} />
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

import { useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatHeader from "../components/Chat/ChatHeader";
import MessageList from "../components/Chat/MessageList";
import ChatInput from "../components/Chat/ChatInput";

import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import useSocket from "../hooks/useSocket";

const ChatPage = () => {
  // -----------------------------
  // AUTH
  // -----------------------------
  const { user, loadUser } = useAuthStore();

  // -----------------------------
  // CHAT STORE
  // -----------------------------
  const {
    selectedChat,
    messages,
    fetchChats,
    addMessage,
    markDelivered,
    markSeen,
    onlineUsers,
  } = useChatStore();

  // -----------------------------
  // LOAD USER ON PAGE LOAD ✅
  // -----------------------------
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // -----------------------------
  // SOCKET
  // -----------------------------
  const socket = useSocket(user?._id);

  // -----------------------------
  // FETCH CHATS
  // -----------------------------
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // -----------------------------
  // JOIN CHAT ROOM
  // -----------------------------
  useEffect(() => {
    if (socket && selectedChat?._id) {
      socket.emit("join-chat", selectedChat._id);
    }
  }, [socket, selectedChat]);

  useEffect(() => {
  if (user) {
    socket.emit("user-online", user._id);
  }
}, [user]);

  // -----------------------------
  // SOCKET LISTENERS
  // -----------------------------
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      addMessage(message);

      // mark seen
      socket.emit("message-seen", {
        chatId:
          typeof message.chat === "object"
            ? message.chat._id
            : message.chat,
        messageId: message._id,
      });
    };

    const handleDelivered = (payload) => {
      if (typeof markDelivered === "function") {
        markDelivered(payload);
      }
    };

    const handleSeen = (payload) => {
      if (typeof markSeen === "function") {
        markSeen(payload);
      }
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("message-delivered", handleDelivered);
    socket.on("message-seen", handleSeen);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("message-delivered", handleDelivered);
      socket.off("message-seen", handleSeen);
    };
  }, [socket, addMessage, markDelivered, markSeen]);

  // -----------------------------
  // WAIT FOR USER TO LOAD
  // -----------------------------
  if (!user) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  // -----------------------------
  // NO CHAT SELECTED
  // -----------------------------
  if (!selectedChat) {
    return (
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar onlineUsers={onlineUsers} />
        <div
          style={{
            flex: 1,
            display: "grid",
            placeItems: "center",
            color: "#6b7280",
            fontSize: "1.1rem",
          }}
        >
          Select a chat to start messaging
        </div>
      </div>
    );
  }

  // -----------------------------
  // CHAT VIEW
  // -----------------------------
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar onlineUsers={onlineUsers} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ChatHeader chat={selectedChat} currentUserId={user._id} />

        <MessageList
          messages={messages}
          currentUserId={user._id}
          chat={selectedChat}
        />

        <ChatInput chatId={selectedChat._id} socket={socket} />
      </div>
    </div>
  );
};

export default ChatPage;
