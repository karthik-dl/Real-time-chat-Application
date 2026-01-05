
// import { useEffect, useState } from "react";
// import ChatItem from "./ChatItem";
// import SearchBar from "./SearchBar";
// import { useAuthStore } from "../../store/authStore";
// import { useChatStore } from "../../store/chatStore";
// import GroupModal from "../Group/GroupModal";

// const Sidebar = ({ onlineUsers = [] }) => {
//   const { user } = useAuthStore();
//   const {
//     chats,
//     users,
//     fetchChats,
//     fetchUsers,
//     createChat,
//   } = useChatStore();

//   const [search, setSearch] = useState("");
//   const [showGroup, setShowGroup] = useState(false);

//   // -----------------------
//   // FETCH CHATS & USERS
//   // -----------------------
//   useEffect(() => {
//     if (!user) return;
//     fetchChats();
//     fetchUsers();
//   }, [user]);

//   if (!user) {
//     return (
//       <div style={{ width: "33.33%", textAlign: "center", paddingTop: 50 }}>
//         Loading...
//       </div>
//     );
//   }

//   const lowerSearch = search.toLowerCase();

//   // -----------------------
//   // FILTER CHATS
//   // -----------------------
//   const filteredChats = chats.filter((chat) => {
//     if (chat.isGroupChat) {
//       return chat.groupName?.toLowerCase().includes(lowerSearch);
//     }

//     const otherUser = chat.members.find(
//       (m) => m._id !== user._id
//     );
//     return otherUser?.name?.toLowerCase().includes(lowerSearch);
//   });

//   // -----------------------
//   // FILTER USERS
//   // -----------------------
//   const filteredUsers = users.filter(
//     (u) =>
//       u._id !== user._id &&
//       u.name?.toLowerCase().includes(lowerSearch)
//   );

//   return (
//     <div
//       style={{
//         width: "33.33%",
//         borderRight: "1px solid #e5e7eb",
//         height: "100vh",
//         backgroundColor: "#ffffff",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* HEADER */}
//       <div
//         style={{
//           padding: "16px",
//           backgroundColor: "#3b82f6",
//           color: "#ffffff",
//           fontWeight: 600,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <span>{user.name}</span>
//         <button
//           title="Create Group"
//           onClick={() => setShowGroup(true)}
//           style={{
//             fontSize: "20px",
//             background: "none",
//             border: "none",
//             color: "#ffffff",
//             cursor: "pointer",
//           }}
//         >
//           👥
//         </button>
//       </div>

//       {/* SEARCH */}
//       <SearchBar onSearch={setSearch} />

//       {/* CHATS LIST */}
//       {filteredChats.length > 0 && (
//         <>
//           <p
//             style={{
//               padding: "8px 16px",
//               fontSize: "12px",
//               color: "#6b7280",
//               margin: 0,
//             }}
//           >
//             Chats
//           </p>

//           {filteredChats.map((chat) => (
//             <ChatItem
//               key={`chat-${chat._id}`}
//               chat={chat}
//               currentUserId={user._id}
//               onlineUsers={onlineUsers}
//             />
//           ))}
//         </>
//       )}

//       {/* USERS LIST (START NEW CHAT) */}
//       {filteredUsers.length > 0 && (
//         <>
//           <p
//             style={{
//               padding: "8px 16px",
//               fontSize: "12px",
//               color: "#6b7280",
//               margin: 0,
//             }}
//           >
//             Users
//           </p>

//           {filteredUsers.map((u) => (
//             <div
//               key={`user-${u._id}`}
//               onClick={() => createChat(u._id)}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "12px",
//                 padding: "8px 16px",
//                 cursor: "pointer",
//               }}
//               onMouseEnter={(e) =>
//                 (e.currentTarget.style.backgroundColor = "#f3f4f6")
//               }
//               onMouseLeave={(e) =>
//                 (e.currentTarget.style.backgroundColor = "transparent")
//               }
//             >
//               <img
//                 src={u.avatar || "/user-avatar.png"}
//                 alt={u.name}
//                 style={{
//                   width: "40px",
//                   height: "40px",
//                   borderRadius: "50%",
//                   objectFit: "cover",
//                 }}
//               />
//               <span>{u.name}</span>
//             </div>
//           ))}
//         </>
//       )}

//       {/* EMPTY STATE */}
//       {filteredChats.length === 0 && filteredUsers.length === 0 && (
//         <p
//           style={{
//             textAlign: "center",
//             color: "#6b7280",
//             marginTop: "24px",
//           }}
//         >
//           No users or chats found
//         </p>
//       )}

//       {/* CREATE GROUP MODAL */}
//       <GroupModal
//         isOpen={showGroup}
//         onClose={() => setShowGroup(false)}
//         users={users}
//       />
//     </div>
//   );
// };

// export default Sidebar;
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ChatItem from "./ChatItem";
import GroupModal from "../Group/GroupModal";
import SearchBar from "./SearchBar";
import ProfileModal from "../Profile/ProfileModal";

import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";

const Sidebar = ({ onlineUsers = [] }) => {
  const { user, logout } = useAuthStore();
  const { chats, fetchChats, selectChat, selectedChat } = useChatStore();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const avatar = user?.avatar || "/user-avatar.png";

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // const filteredChats = chats.filter((chat) => {
  //   if (!search.trim()) return true;

  //   if (chat.isGroupChat) {
  //     return chat.groupName?.toLowerCase().includes(search.toLowerCase());
  //   }

  //   const otherUser = chat.members?.find((m) => m._id !== user?._id);
  //   return otherUser?.name?.toLowerCase().includes(search.toLowerCase());
  // });
  const filteredChats = chats.filter((chat) =>
  chat.members.some((m) => m._id !== user._id)
);


  const styles = {
    container: {
      width: "380px",
      height: "100vh",
      borderRight: "1px solid #e5e7eb",
      display: "flex",
      flexDirection: "column",
      background: "#fff",
      position: "relative",
    },
    header: {
      padding: "1rem",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      color: "#fff",
    },
    headerContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      cursor: "pointer",
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid rgba(255,255,255,0.4)",
    },
    userName: {
      fontWeight: 600,
      fontSize: "1rem",
    },
    iconButton: {
      background: "rgba(255,255,255,0.2)",
      border: "none",
      color: "#fff",
      fontSize: "1.2rem",
      cursor: "pointer",
      padding: "0.5rem",
      borderRadius: "50%",
    },
    chatList: {
      flex: 1,
      overflowY: "auto",
    },
    userMenu: {
      position: "absolute",
      top: "70px",
      right: "16px",
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      zIndex: 100,
      width: "180px",
      overflow: "hidden",
    },
    menuItem: {
      padding: "0.75rem 1rem",
      cursor: "pointer",
      border: "none",
      background: "transparent",
      width: "100%",
      textAlign: "left",
      fontSize: "0.95rem",
    },
  };

  return (
    <>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div
              style={styles.userInfo}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img
                src={user?.avatar || "/user-avatar.png"}
                alt="avatar"
                style={styles.avatar}
              />
              <span style={styles.userName}>
                {user?.name || "Loading..."}
              </span>
            </div>

            <button
              style={styles.iconButton}
              onClick={() => setShowGroupModal(true)}
              title="Create Group"
            >
              👥
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <SearchBar onSearch={setSearch} />

        {/* CHAT LIST */}
        <div style={styles.chatList}>
          {filteredChats.map((chat) => (
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

        {/* USER MENU */}
        {showUserMenu && (
          <div style={styles.userMenu}>
            <button
              style={styles.menuItem}
              onClick={() => {
                setShowUserMenu(false);
                setShowProfile(true);
              }}
            >
              👤 Profile
            </button>

            <button
              style={{ ...styles.menuItem, color: "#ef4444" }}
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      {/* PROFILE MODAL */}
      {showProfile && (
        <ProfileModal
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* GROUP MODAL */}
      {showGroupModal && (
        <GroupModal onClose={() => setShowGroupModal(false)} />
      )}
    </>
  );
};

export default Sidebar;
