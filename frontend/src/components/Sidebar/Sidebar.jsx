import { useEffect, useState, useRef } from "react";
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
  const menuRef = useRef(null);

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
  // CLOSE MENU ON OUTSIDE CLICK
  // -----------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

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
          width: window.innerWidth < 768 ? "100%" : "380px",
          height: "100vh",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          position: "relative",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: "1.25rem 1rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#ffffff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* USER INFO */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                cursor: "pointer",
                alignItems: "center",
                padding: "0.25rem",
                borderRadius: "0.5rem",
                transition: "background 0.2s ease",
              }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <img
                src={user?.avatar || "/user-avatar.png"}
                alt="avatar"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    letterSpacing: "0.01em",
                  }}
                >
                  {user?.name}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    opacity: 0.8,
                  }}
                >
                  View Profile
                </span>
              </div>
            </div>

            {/* CREATE GROUP BUTTON */}
            <button
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "#ffffff",
                fontSize: "1.5rem",
                cursor: "pointer",
                padding: "0.625rem",
                borderRadius: "50%",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "3rem",
                height: "3rem",
              }}
              onClick={() => setShowGroupModal(true)}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "scale(1)";
              }}
              title="Create Group"
              aria-label="Create Group"
            >
              👥
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <SearchBar onSearch={setSearch} />

        {/* SEARCH RESULTS */}
        {searchResults.length > 0 ? (
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              background: "#f9fafb",
            }}
          >
            <div
              style={{
                padding: "0.75rem 1rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                background: "#ffffff",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Search Results
            </div>
            {searchResults.map((u) => (
              <div
                key={u._id}
                onClick={() => startChat(u._id)}
                style={{
                  padding: "1rem 1rem",
                  cursor: "pointer",
                  borderBottom: "1px solid #f1f5f9",
                  background: "#ffffff",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#f9fafb";
                  e.currentTarget.style.paddingLeft = "1.25rem";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.paddingLeft = "1rem";
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: "1.125rem",
                  }}
                >
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      color: "#111827",
                    }}
                  >
                    {u.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      color: "#6b7280",
                    }}
                  >
                    {u.email}
                  </div>
                </div>
                <span style={{ fontSize: "1.25rem", opacity: 0.5 }}>→</span>
              </div>
            ))}
          </div>
        ) : (
          /* CHAT LIST */
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              background: "#ffffff",
            }}
          >
            {chats.length === 0 ? (
              <div
                style={{
                  padding: "3rem 2rem",
                  textAlign: "center",
                  color: "#9ca3af",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💬</div>
                <div style={{ fontSize: "0.9375rem", fontWeight: 600 }}>
                  No chats yet
                </div>
                <div style={{ fontSize: "0.8125rem", marginTop: "0.5rem" }}>
                  Search for users to start chatting
                </div>
              </div>
            ) : (
              chats.map((chat) => (
                <ChatItem
                  key={chat._id}
                  chat={chat}
                  isActive={selectedChat?._id === chat._id}
                  onlineUsers={onlineUsers}
                  currentUserId={user?._id}
                  onClick={() => selectChat(chat)}
                />
              ))
            )}
          </div>
        )}

        {/* USER MENU */}
        {showUserMenu && (
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: "80px",
              left: "1rem",
              background: "#ffffff",
              borderRadius: "0.75rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
              zIndex: 100,
              minWidth: "200px",
              overflow: "hidden",
              animation: "slideDown 0.2s ease-out",
            }}
          >
            <button
              style={{
                padding: "0.875rem 1.25rem",
                width: "100%",
                border: "none",
                background: "transparent",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "#374151",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                transition: "background 0.15s ease",
              }}
              onClick={() => {
                setShowUserMenu(false);
                setShowProfile(true);
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: "1.25rem" }}>👤</span>
              <span>Profile</span>
            </button>

            <div
              style={{
                height: "1px",
                background: "#e5e7eb",
                margin: "0 0.5rem",
              }}
            />

            <button
              style={{
                padding: "0.875rem 1.25rem",
                width: "100%",
                border: "none",
                background: "transparent",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                transition: "background 0.15s ease",
              }}
              onClick={handleLogout}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#fef2f2";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: "1.25rem" }}>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showProfile && (
        <ProfileModal isOpen onClose={() => setShowProfile(false)} />
      )}

      {showGroupModal && (
        <GroupModal onClose={() => setShowGroupModal(false)} />
      )}

      {/* ANIMATIONS */}
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  );
};

export default Sidebar;