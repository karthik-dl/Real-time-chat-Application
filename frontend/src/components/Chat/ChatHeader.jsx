import { useState, useRef, useEffect } from "react";
import api from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";

const ChatHeader = ({ chat, currentUserId }) => {
  const { user, fetchUser } = useAuthStore(); // Add fetchUser to refresh user data
  const { fetchChats, selectChat, onlineUsers, typingUser } = useChatStore();
  const dropdownRef = useRef(null);

  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editGroup, setEditGroup] = useState(false);
  const [groupName, setGroupName] = useState(chat?.groupName || "");
  const [localBlockedState, setLocalBlockedState] = useState(null);

  if (!chat) return null;

  // FLAGS
  const isGroup = chat.isGroupChat;
  const isAdmin = isGroup && chat.groupAdmin?._id === user?._id;

  // OTHER USER LOGIC
  const otherUser = !isGroup
    ? chat.members?.find(
        (m) => m._id?.toString() !== currentUserId?.toString()
      )
    : null;

  const isOnline =
    !isGroup && otherUser && onlineUsers.includes(otherUser._id);

  // Use local state if available, otherwise fall back to user data
  const isBlocked = localBlockedState !== null 
    ? localBlockedState 
    : user?.blockedUsers?.includes(otherUser?._id);

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowGroupInfo(false);
      }
    };

    if (showGroupInfo) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showGroupInfo]);

  // -------------------------
  // GROUP ACTIONS
  // -------------------------
  const leaveGroup = async () => {
    if (!window.confirm("Leave this group?")) return;
    try {
      setLoading(true);
      await api.put("/chats/group/leave", { chatId: chat._id });
      await fetchChats();
      selectChat(null);
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async () => {
    if (!window.confirm("Delete group permanently?")) return;
    try {
      setLoading(true);
      await api.delete("/chats/group/delete", {
        data: { chatId: chat._id },
      });
      await fetchChats();
      selectChat(null);
    } finally {
      setLoading(false);
    }
  };

  const saveGroupName = async () => {
    try {
      setLoading(true);
      await api.put("/chats/group/update", {
        chatId: chat._id,
        groupName,
      });
      await fetchChats();
      setEditGroup(false);
    } finally {
      setLoading(false);
    }
  };

  const blockUser = async () => {
    if (!window.confirm("Block this user?")) return;

    try {
      setLoading(true);
      await api.put("/users/block", {
        userId: otherUser._id,
      });

      // Update local state immediately
      setLocalBlockedState(true);
      
      // Refresh user data in background
      if (fetchUser) {
        await fetchUser();
      }
      
      alert("User blocked");
    } finally {
      setLoading(false);
    }
  };

  const unblockUser = async () => {
    if (!window.confirm("Unblock this user?")) return;

    try {
      setLoading(true);
      await api.put("/users/unblock", {
        userId: otherUser._id,
      });

      // Update local state immediately
      setLocalBlockedState(false);
      
      // Refresh user data in background
      if (fetchUser) {
        await fetchUser();
      }
      
      alert("User unblocked");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    if (!window.confirm("Clear all messages?")) return;

    await api.put("/messages/clear", {
      chatId: chat._id,
    });

    selectChat(chat);
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <div style={{ position: "relative" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1.25rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#ffffff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* LEFT - AVATAR & INFO */}
        <div
          style={{
            display: "flex",
            gap: "0.875rem",
            alignItems: "center",
            flex: 1,
            minWidth: 0,
          }}
        >
          <div style={{ position: "relative" }}>
            <img
              src={
                isGroup
                  ? chat.groupAvatar || "/group-avatar.png"
                  : otherUser?.avatar || "/user-avatar.png"
              }
              alt="avatar"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              }}
            />
            {!isGroup && isOnline && (
              <span
                style={{
                  position: "absolute",
                  bottom: "2px",
                  right: "2px",
                  width: "12px",
                  height: "12px",
                  background:
                    "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  borderRadius: "50%",
                  border: "2px solid white",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              />
            )}
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: "1.0625rem",
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {isGroup ? chat.groupName : otherUser?.name}
            </div>

            {!isGroup && (
              <div
                style={{
                  fontSize: "0.8125rem",
                  opacity: 0.9,
                  marginTop: "0.125rem",
                }}
              >
                {typingUser === otherUser?._id ? (
                  <span
                    style={{
                      fontStyle: "italic",
                      animation: "pulse 1.5s ease-in-out infinite",
                    }}
                  >
                    typing...
                  </span>
                ) : isOnline ? (
                  "Active now"
                ) : (
                  "Offline"
                )}
              </div>
            )}

            {isGroup && (
              <div
                style={{
                  fontSize: "0.8125rem",
                  opacity: 0.9,
                  marginTop: "0.125rem",
                }}
              >
                {chat.members?.length || 0} members
              </div>
            )}
          </div>
        </div>

        {/* RIGHT - INFO BUTTON */}
        <button
          onClick={() => setShowGroupInfo((p) => !p)}
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            border: "none",
            borderRadius: "50%",
            color: "#ffffff",
            width: "2.5rem",
            height: "2.5rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.25rem",
            transition: "all 0.2s ease",
            flexShrink: 0,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.transform = "scale(1)";
          }}
          aria-label={isGroup ? "Group info" : "Chat options"}
        >
          ℹ️
        </button>
      </div>

      {/* DROPDOWN INFO PANEL */}
      {showGroupInfo && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            right: "1rem",
            top: "100%",
            marginTop: "0.5rem",
            background: "#ffffff",
            padding: "1.25rem",
            minWidth: "280px",
            maxWidth: "320px",
            borderRadius: "0.75rem",
            boxShadow:
              "0 10px 30px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)",
            zIndex: 1000,
            animation: "dropdownSlide 0.2s ease-out",
          }}
        >
          {/* GROUP MEMBERS */}
          {isGroup && (
            <>
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Members ({chat.members?.length || 0})
              </div>

              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  marginBottom: "1rem",
                }}
              >
                {chat.members?.map((m) => (
                  <div
                    key={m._id}
                    style={{
                      padding: "0.625rem 0.75rem",
                      background: "#f9fafb",
                      borderRadius: "0.5rem",
                      marginBottom: "0.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.875rem",
                      color: "#374151",
                      fontWeight: 500,
                    }}
                  >
                    <span>{m.name}</span>
                    {chat.groupAdmin?._id === m._id && (
                      <span
                        style={{
                          fontSize: "1rem",
                          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                        }}
                      >
                        👑
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* EDIT GROUP NAME */}
              {isAdmin && (
                <div style={{ marginBottom: "1rem" }}>
                  {!editGroup ? (
                    <ActionButton
                      onClick={() => setEditGroup(true)}
                      icon="✏️"
                      label="Edit Group Name"
                    />
                  ) : (
                    <div>
                      <input
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter group name"
                        style={{
                          width: "100%",
                          padding: "0.625rem 0.875rem",
                          border: "2px solid #e5e7eb",
                          borderRadius: "0.5rem",
                          fontSize: "0.875rem",
                          marginBottom: "0.5rem",
                          outline: "none",
                          transition: "border 0.2s ease",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#667eea";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                        }}
                      />
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={saveGroupName}
                          disabled={loading}
                          style={{
                            flex: 1,
                            padding: "0.5rem",
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.6 : 1,
                          }}
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditGroup(false)}
                          style={{
                            flex: 1,
                            padding: "0.5rem",
                            background: "#f3f4f6",
                            color: "#374151",
                            border: "none",
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* DIVIDER */}
          {isGroup && (
            <div
              style={{
                height: "1px",
                background: "#e5e7eb",
                margin: "1rem 0",
              }}
            />
          )}

          {/* ACTIONS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {/* BLOCK/UNBLOCK USER (1-ON-1 ONLY) */}
            {!isGroup && (
              <>
                {!isBlocked ? (
                  <ActionButton
                    onClick={blockUser}
                    icon="🚫"
                    label="Block User"
                    danger
                    disabled={loading}
                  />
                ) : (
                  <ActionButton
                    onClick={unblockUser}
                    icon="🔓"
                    label="Unblock User"
                    success
                    disabled={loading}
                  />
                )}
              </>
            )}

            {/* CLEAR CHAT */}
            <ActionButton
              onClick={clearChat}
              icon="🧹"
              label="Clear Chat"
            />

            {/* GROUP ACTIONS */}
            {isGroup && (
              <>
                <ActionButton
                  onClick={leaveGroup}
                  icon="🚪"
                  label="Leave Group"
                  danger
                  disabled={loading}
                />
                {isAdmin && (
                  <ActionButton
                    onClick={deleteGroup}
                    icon="🗑️"
                    label="Delete Group"
                    danger
                    disabled={loading}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ANIMATIONS */}
      <style>
        {`
          @keyframes dropdownSlide {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 0.9;
            }
            50% {
              opacity: 0.6;
            }
          }
        `}
      </style>
    </div>
  );
};

// ACTION BUTTON COMPONENT
const ActionButton = ({ onClick, icon, label, danger, success, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      width: "100%",
      padding: "0.75rem 1rem",
      background: "transparent",
      border: "none",
      borderRadius: "0.5rem",
      fontSize: "0.875rem",
      fontWeight: 600,
      color: danger ? "#ef4444" : success ? "#22c55e" : "#374151",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.15s ease",
      textAlign: "left",
      opacity: disabled ? 0.5 : 1,
    }}
    onMouseOver={(e) => {
      if (!disabled) {
        e.currentTarget.style.background = danger
          ? "#fef2f2"
          : success
          ? "#f0fdf4"
          : "#f3f4f6";
      }
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.background = "transparent";
    }}
  >
    <span style={{ fontSize: "1.125rem" }}>{icon}</span>
    <span>{label}</span>
  </button>
);

export default ChatHeader;