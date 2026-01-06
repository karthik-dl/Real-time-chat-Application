import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ChatItem from "./ChatItem";
import GroupModal from "../Group/GroupModal";
import SearchBar from "./SearchBar";
import ProfileModal from "../Profile/ProfileModal";

import api from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";

const Sidebar = ({ onlineUsers = [] }) => {
  const { user, logout } = useAuthStore();
  const {
    chats,
    fetchChats,
    selectChat,
    selectedChat,
    addChat,
  } = useChatStore();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // -----------------------------
  // FETCH CHATS
  // -----------------------------
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // -----------------------------
  // SEARCH USERS
  // -----------------------------
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await api.get(`/users?search=${search}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error("Search users failed", err);
      }
    };

    fetchUsers();
  }, [search]);

  // -----------------------------
  // START OR ACCESS CHAT
  // -----------------------------
  const startChat = async (userId) => {
    try {
      const res = await api.post("/chats", { userId });

      addChat(res.data);
      selectChat(res.data);

      setSearch("");
      setSearchResults([]);
    } catch (err) {
      console.error("Start chat failed", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <div
        style={{
          width: "380px",
          height: "100vh",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          position: "relative",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: "1rem",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{ display: "flex", gap: "0.75rem", cursor: "pointer" }}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img
                src={user?.avatar || "/user-avatar.png"}
                alt="avatar"
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
              <span style={{ fontWeight: 600 }}>{user?.name}</span>
            </div>

            <button
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "#fff",
                fontSize: "1.2rem",
                cursor: "pointer",
                padding: "0.5rem",
                borderRadius: "50%",
              }}
              onClick={() => setShowGroupModal(true)}
            >
              👥
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <SearchBar onSearch={setSearch} />

        {/* SEARCH RESULTS */}
        {searchResults.length > 0 ? (
          <div style={{ flex: 1, overflowY: "auto" }}>
            {searchResults.map((u) => (
              <div
                key={u._id}
                onClick={() => startChat(u._id)}
                style={{
                  padding: "0.75rem 1rem",
                  cursor: "pointer",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                {u.name}
              </div>
            ))}
          </div>
        ) : (
          /* CHAT LIST */
          <div style={{ flex: 1, overflowY: "auto" }}>
            {chats.map((chat) => (
              <ChatItem
                key={chat._id}
                chat={chat}
                isActive={selectedChat?._id === chat._id}
                onlineUsers={onlineUsers}
                currentUserId={user?._id}
                onClick={() => selectChat(chat)}
              />
            ))}
          </div>
        )}

        {/* USER MENU */}
        {showUserMenu && (
          <div
            style={{
              position: "absolute",
              top: "70px",
              right: "16px",
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              zIndex: 100,
              width: "180px",
            }}
          >
            <button
              style={{ padding: "0.75rem 1rem", width: "100%" }}
              onClick={() => {
                setShowUserMenu(false);
                setShowProfile(true);
              }}
            >
              👤 Profile
            </button>

            <button
              style={{
                padding: "0.75rem 1rem",
                width: "100%",
                color: "#ef4444",
              }}
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      {showProfile && (
        <ProfileModal isOpen onClose={() => setShowProfile(false)} />
      )}

      {showGroupModal && (
        <GroupModal onClose={() => setShowGroupModal(false)} />
      )}
    </>
  );
};

export default Sidebar;
