import { useState } from "react";
import api from "../../services/api";
import { formatTime } from "../../utils/formatTime";
import { useChatStore } from "../../store/chatStore";

const ChatItem = ({
  chat,
  isActive,
  onlineUsers = [],
  currentUserId,
  onClick,
}) => {
  const { fetchChats, selectChat } = useChatStore();
  const [isHovered, setIsHovered] = useState(false);

  // ----------------------------
  // CHAT TYPE
  // ----------------------------
  const isGroup = chat.isGroupChat;

  // ----------------------------
  // FIND OTHER USER (1–1 CHAT)
  // ----------------------------
  const otherUser = !isGroup
    ? chat.members?.find(
        (m) => m._id?.toString() !== currentUserId?.toString()
      )
    : null;

  // ----------------------------
  // NAME & AVATAR
  // ----------------------------
  const chatName = isGroup
    ? chat.groupName
    : otherUser?.name || "Unknown";

  const avatar = isGroup
    ? chat.groupAvatar || "/group-avatar.png"
    : otherUser?.avatar || "/user-avatar.png";

  // ----------------------------
  // ONLINE STATUS
  // ----------------------------
  const isOnline =
    !isGroup && otherUser
      ? onlineUsers.includes(otherUser._id)
      : false;

  // ----------------------------
  // LAST MESSAGE
  // ----------------------------
  const lastMessageText = chat.lastMessage
    ? chat.lastMessage.content || chat.lastMessage.text || "📎 Attachment"
    : "No messages yet";

  // ----------------------------
  // DELETE CHAT (FOR ME)
  // ----------------------------
  const handleDeleteChat = async (e) => {
    e.stopPropagation();

    if (!window.confirm("Remove this chat from your list?")) return;

    try {
      await api.delete(`/chats/${chat._id}`);

      await fetchChats();
      selectChat(null);
    } catch (err) {
      console.error("Delete chat failed", err);
      alert("Failed to delete chat");
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "0.875rem 1rem",
        cursor: "pointer",
        background: isActive
          ? "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)"
          : isHovered
          ? "#f9fafb"
          : "transparent",
        display: "flex",
        gap: "0.875rem",
        alignItems: "center",
        borderLeft: isActive ? "4px solid #667eea" : "4px solid transparent",
        transition: "all 0.2s ease",
        position: "relative",
      }}
    >
      {/* AVATAR */}
      <div
        style={{
          position: "relative",
          flexShrink: 0,
        }}
      >
        <img
          src={avatar}
          alt={chatName}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            objectFit: "cover",
            border: isActive ? "2px solid #667eea" : "2px solid #e5e7eb",
            transition: "all 0.2s ease",
            boxShadow: isActive
              ? "0 2px 8px rgba(102, 126, 234, 0.3)"
              : "0 1px 2px rgba(0, 0, 0, 0.05)",
          }}
        />
        {isOnline && (
          <span
            style={{
              position: "absolute",
              bottom: "2px",
              right: "2px",
              width: "12px",
              height: "12px",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              borderRadius: "50%",
              border: "2px solid white",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        )}
      </div>

      {/* INFO */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        {/* TOP ROW - NAME & TIME */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.25rem",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              fontWeight: 600,
              fontSize: "0.9375rem",
              color: isActive ? "#667eea" : "#111827",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              transition: "color 0.2s ease",
            }}
          >
            {chatName}
          </span>

          {chat.lastMessage && (
            <span
              style={{
                fontSize: "0.6875rem",
                color: isActive ? "#667eea" : "#9ca3af",
                whiteSpace: "nowrap",
                fontWeight: 500,
              }}
            >
              {formatTime(chat.lastMessage.createdAt)}
            </span>
          )}
        </div>

        {/* BOTTOM ROW - MESSAGE & DELETE */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              fontSize: "0.8125rem",
              color: chat.lastMessage ? "#6b7280" : "#9ca3af",
              fontStyle: chat.lastMessage ? "normal" : "italic",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
            }}
          >
            {lastMessageText}
          </span>

          {/* DELETE BUTTON - VISIBLE ON HOVER */}
          <button
            onClick={handleDeleteChat}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
              color: "#ef4444",
              padding: "0.25rem",
              borderRadius: "0.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: isHovered ? 1 : 0,
              transition: "all 0.2s ease",
              flexShrink: 0,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "scale(1)";
            }}
            title="Delete chat"
            aria-label="Delete chat"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* UNREAD BADGE (OPTIONAL - ADD IF YOU HAVE UNREAD COUNT) */}
      {chat.unreadCount > 0 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "1rem",
            transform: "translateY(-50%)",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            fontSize: "0.6875rem",
            fontWeight: 600,
            padding: "0.125rem 0.5rem",
            borderRadius: "12px",
            minWidth: "20px",
            textAlign: "center",
            boxShadow: "0 2px 4px rgba(102, 126, 234, 0.3)",
          }}
        >
          {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
        </div>
      )}

      {/* INLINE ANIMATION STYLES */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(0.95);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ChatItem;