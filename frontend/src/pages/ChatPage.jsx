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
    deleteMessageLocal,
    onlineUsers,
  } = useChatStore();

  // -----------------------------
  // LOAD USER
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

  // -----------------------------
  // SOCKET LISTENERS (ONE PLACE ONLY)
  // -----------------------------
  useEffect(() => {
    if (!socket || !user?._id) return;

    // RECEIVE MESSAGE
    const handleReceiveMessage = (message) => {
      addMessage(message);

      socket.emit("message-seen", {
        chatId:
          typeof message.chat === "object"
            ? message.chat._id
            : message.chat,
        messageId: message._id,
      });
    };

    // DELIVERED
    const handleDelivered = (payload) => {
      markDelivered?.(payload);
    };

    // SEEN
    const handleSeen = (payload) => {
      markSeen?.(payload);
    };

    // DELETE (ME / EVERYONE)
    const handleMessageDeleted = ({ messageId, forEveryone }) => {
      deleteMessageLocal(messageId, forEveryone, user._id);
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("message-delivered", handleDelivered);
    socket.on("message-seen", handleSeen);
    socket.on("message-deleted", handleMessageDeleted);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("message-delivered", handleDelivered);
      socket.off("message-seen", handleSeen);
      socket.off("message-deleted", handleMessageDeleted);
    };
  }, [
    socket,
    user?._id,
    addMessage,
    markDelivered,
    markSeen,
    deleteMessageLocal,
  ]);

  // -----------------------------
  // WAIT FOR USER (LOADING STATE)
  // -----------------------------
  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          {/* SPINNER */}
          <div
            style={{
              width: "4rem",
              height: "4rem",
              border: "4px solid rgba(255, 255, 255, 0.3)",
              borderTop: "4px solid #ffffff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          
          <div
            style={{
              color: "#ffffff",
              fontSize: "1.25rem",
              fontWeight: 600,
              letterSpacing: "0.025em",
            }}
          >
            Loading...
          </div>
        </div>

        {/* SPINNER ANIMATION */}
        <style>
          {`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    );
  }

  // -----------------------------
  // NO CHAT SELECTED
  // -----------------------------
  if (!selectedChat) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Sidebar onlineUsers={onlineUsers} />
        
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%)",
            padding: "2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* BACKGROUND DECORATION */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              right: "10%",
              width: "300px",
              height: "300px",
              background: "radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
          
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "10%",
              width: "200px",
              height: "200px",
              background: "radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          {/* CONTENT */}
          <div
            style={{
              textAlign: "center",
              zIndex: 1,
              animation: "fadeIn 0.5s ease-out",
            }}
          >
            <div
              style={{
                fontSize: "5rem",
                marginBottom: "1.5rem",
                opacity: 0.7,
                filter: "grayscale(0.2)",
              }}
            >
              💬
            </div>
            
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "#111827",
                marginBottom: "0.75rem",
                letterSpacing: "-0.025em",
              }}
            >
              Welcome to Your Chat
            </h2>
            
            <p
              style={{
                fontSize: "1.125rem",
                color: "#6b7280",
                maxWidth: "400px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Select a conversation from the sidebar to start messaging
            </p>

            {/* DECORATIVE ARROW */}
            <div
              style={{
                marginTop: "2rem",
                fontSize: "2rem",
                opacity: 0.4,
                animation: "bounce 2s ease-in-out infinite",
              }}
            >
              ←
            </div>
          </div>

          {/* ANIMATIONS */}
          <style>
            {`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              
              @keyframes bounce {
                0%, 100% {
                  transform: translateX(0);
                }
                50% {
                  transform: translateX(-10px);
                }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  // -----------------------------
  // CHAT VIEW
  // -----------------------------
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#f9fafb",
      }}
    >
      <Sidebar onlineUsers={onlineUsers} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          boxShadow: window.innerWidth > 768 ? "-2px 0 8px rgba(0, 0, 0, 0.05)" : "none",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <ChatHeader chat={selectedChat} currentUserId={user._id} />

        <div
          style={{
            flex: 1,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <MessageList
            messages={messages}
            currentUserId={user._id}
            chat={selectedChat}
          />
        </div>

        <ChatInput chatId={selectedChat._id} socket={socket} />
      </div>
    </div>
  );
};

export default ChatPage;