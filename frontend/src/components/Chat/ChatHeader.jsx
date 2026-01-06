import { useState } from "react";
import api from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";

const ChatHeader = ({ chat, currentUserId }) => {
  const { user } = useAuthStore();
  const { fetchChats, selectChat, onlineUsers, typingUser } = useChatStore();

  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editGroup, setEditGroup] = useState(false);
  const [groupName, setGroupName] = useState(chat?.groupName || "");

  if (!chat) return null;

  // ✅ CORRECT FLAGS
  const isGroup = chat.isGroupChat;
  const isAdmin = isGroup && chat.groupAdmin?._id === user?._id;

  // ✅ CORRECT OTHER USER LOGIC
  const otherUser = !isGroup
    ? chat.members?.find(
        (m) => m._id?.toString() !== currentUserId?.toString()
      )
    : null;

  const isOnline =
    !isGroup && otherUser && onlineUsers.includes(otherUser._id);

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

  // -------------------------
  // UI
  // -------------------------
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          background: "linear-gradient(135deg,#667eea,#764ba2)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <img
            src={
              isGroup
                ? chat.groupAvatar || "/group-avatar.png"
                : otherUser?.avatar || "/user-avatar.png"
            }
            alt="avatar"
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />

          <div>
            <div style={{ fontWeight: 600 }}>
              {isGroup ? chat.groupName : otherUser?.name}
            </div>

            {!isGroup && (
              <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>
                {typingUser === otherUser?._id
                  ? "typing…"
                  : isOnline
                  ? "Active now"
                  : "Offline"}
              </div>
            )}

            {isGroup && (
              <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>
                {chat.members?.length || 0} members
              </div>
            )}
          </div>
        </div>

        {isGroup && (
          <button
            onClick={() => setShowGroupInfo((p) => !p)}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "50%",
              color: "white",
              width: 36,
              height: 36,
              cursor: "pointer",
            }}
          >
            ℹ️
          </button>
        )}
      </div>

      {/* GROUP INFO */}
      {isGroup && showGroupInfo && (
        <div
          style={{
            position: "absolute",
            right: 16,
            top: "100%",
            marginTop: 8,
            background: "white",
            padding: "1rem",
            width: 260,
            borderRadius: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            zIndex: 50,
          }}
        >
          <strong>Members</strong>

          {chat.members?.map((m) => (
            <div
              key={m._id}
              style={{
                padding: "0.4rem",
                background: "#f3f4f6",
                borderRadius: 6,
                marginTop: 4,
              }}
            >
              {m.name}
              {chat.groupAdmin?._id === m._id && " 👑"}
            </div>
          ))}

          {isAdmin && (
            <>
              {!editGroup ? (
                <button
                  style={{ marginTop: 8 }}
                  onClick={() => setEditGroup(true)}
                >
                  ✏️ Edit Group Name
                </button>
              ) : (
                <>
                  <input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    style={{ width: "100%", marginTop: 6 }}
                  />
                  <button onClick={saveGroupName}>Save</button>
                </>
              )}
            </>
          )}

          <button onClick={leaveGroup}>🚪 Leave Group</button>
          {isAdmin && <button onClick={deleteGroup}>🗑️ Delete Group</button>}
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
