// import { useState } from "react";
// import api from "../../services/api";

// const ChatHeader = ({ chat, currentUserId, onlineUsers }) => {
//   const [showGroupInfo, setShowGroupInfo] = useState(false);
//   const [loading, setLoading] = useState(false);

//   if (!chat) return null;

//   const isGroup = chat.isGroupChat;
//   const isAdmin = chat.admins?.includes(currentUserId);

//   const otherUser = !isGroup
//     ? chat.members.find((m) => m._id !== currentUserId)
//     : null;

//   const isOnline = !isGroup && onlineUsers.includes(otherUser?._id);

//   // -----------------------
//   // ACTIONS
//   // -----------------------
//   const leaveGroup = async () => {
//     if (!window.confirm("Are you sure you want to leave this group?")) return;

//     try {
//       setLoading(true);
//       await api.post(`/groups/${chat._id}/leave`);
//       setShowGroupInfo(false);
//       window.location.reload(); // simple & safe
//     } catch (err) {
//       console.error("Leave group failed", err);
//       alert("Failed to leave group");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteGroup = async () => {
//     if (!window.confirm("Delete this group permanently?")) return;

//     try {
//       setLoading(true);
//       await api.delete(`/groups/${chat._id}`);
//       setShowGroupInfo(false);
//       window.location.reload();
//     } catch (err) {
//       console.error("Delete group failed", err);
//       alert("Failed to delete group");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -----------------------
//   // STYLES
//   // -----------------------
//   const styles = {
//     header: {
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       padding: "0.75rem 1rem",
//       backgroundColor: "#3b82f6",
//       color: "white",
//       borderBottom: "1px solid rgba(255,255,255,0.1)",
//     },
//     left: {
//       display: "flex",
//       alignItems: "center",
//       gap: "0.75rem",
//     },
//     avatar: {
//       width: "2.5rem",
//       height: "2.5rem",
//       borderRadius: "50%",
//       objectFit: "cover",
//     },
//     info: {
//       display: "flex",
//       flexDirection: "column",
//     },
//     name: {
//       fontWeight: 500,
//       margin: 0,
//     },
//     status: {
//       fontSize: "0.75rem",
//       opacity: 0.8,
//       margin: 0,
//     },
//     actions: {
//       display: "flex",
//       gap: "1rem",
//       alignItems: "center",
//     },
//     button: {
//       background: "none",
//       border: "none",
//       color: "white",
//       cursor: "pointer",
//       fontSize: "1.1rem",
//     },
//     panel: {
//       position: "absolute",
//       top: "3.5rem",
//       right: "1rem",
//       backgroundColor: "white",
//       color: "#111827",
//       borderRadius: "0.5rem",
//       padding: "1rem",
//       boxShadow: "0 10px 15px rgba(0,0,0,0.15)",
//       width: "16rem",
//       zIndex: 50,
//     },
//     member: {
//       fontSize: "0.875rem",
//       marginBottom: "0.25rem",
//     },
//     divider: {
//       height: "1px",
//       backgroundColor: "#e5e7eb",
//       margin: "0.5rem 0",
//     },
//     leaveBtn: {
//       width: "100%",
//       padding: "0.4rem",
//       borderRadius: "0.25rem",
//       border: "1px solid #d1d5db",
//       backgroundColor: "#f9fafb",
//       cursor: "pointer",
//       fontSize: "0.875rem",
//     },
//     deleteBtn: {
//       width: "100%",
//       padding: "0.4rem",
//       borderRadius: "0.25rem",
//       border: "none",
//       backgroundColor: "#ef4444",
//       color: "white",
//       cursor: "pointer",
//       fontSize: "0.875rem",
//     },
//     closeBtn: {
//       background: "none",
//       border: "none",
//       color: "#2563eb",
//       cursor: "pointer",
//       fontSize: "0.875rem",
//       marginTop: "0.5rem",
//     },
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       {/* HEADER */}
//       <div style={styles.header}>
//         <div style={styles.left}>
//           <img
//             src={isGroup ? "/group-avatar.png" : otherUser?.avatar}
//             alt="avatar"
//             style={styles.avatar}
//           />

//           <div style={styles.info}>
//             <h3 style={styles.name}>
//               {isGroup ? chat.groupName : otherUser?.name}
//             </h3>
//             {!isGroup && (
//               <p style={styles.status}>
//                 {isOnline ? "online" : "offline"}
//               </p>
//             )}
//           </div>
//         </div>

//         <div style={styles.actions}>
//           {isGroup && (
//             <button
//               style={styles.button}
//               title="Group info"
//               onClick={() => setShowGroupInfo((p) => !p)}
//             >
//               ℹ️
//             </button>
//           )}
//         </div>
//       </div>

//       {/* GROUP INFO PANEL */}
//       {isGroup && showGroupInfo && (
//         <div style={styles.panel}>
//           <strong>Group Members</strong>

//           <div style={{ marginTop: "0.5rem" }}>
//             {chat.members.map((m) => (
//               <div key={m._id} style={styles.member}>
//                 {m.name}
//               </div>
//             ))}
//           </div>

//           <div style={styles.divider} />

//           <button
//             style={styles.leaveBtn}
//             onClick={leaveGroup}
//             disabled={loading}
//           >
//             Leave Group
//           </button>

//           {isAdmin && (
//             <button
//               style={{ ...styles.deleteBtn, marginTop: "0.5rem" }}
//               onClick={deleteGroup}
//               disabled={loading}
//             >
//               Delete Group
//             </button>
//           )}

//           <button
//             style={styles.closeBtn}
//             onClick={() => setShowGroupInfo(false)}
//           >
//             Close
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatHeader;

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// import { useState } from "react";
// import api from "../../services/api";
// import { useAuthStore } from "../../store/authStore";
// import { useChatStore } from "../../store/chatStore";

// const ChatHeader = ({ chat, currentUserId, onlineUsers = [] }) => {
//   const { user } = useAuthStore();
//   const { fetchChats, selectChat } = useChatStore();

//   const [showGroupInfo, setShowGroupInfo] = useState(false);
//   const [loading, setLoading] = useState(false);
// const avatar = user?.avatar || "/user-avatar.png";

//   if (!chat) return null;

//   const isGroup = chat.isGroupChat;
//   const isAdmin = isGroup && chat.groupAdmin?._id === user._id;

//   const otherUser = !isGroup
//     ? chat.members.find((m) => m._id !== currentUserId)
//     : null;

//   const isOnline = !isGroup && onlineUsers.includes(otherUser?._id);

//   const leaveGroup = async () => {
//     if (!window.confirm("Are you sure you want to leave this group?")) return;

//     try {
//       setLoading(true);
//       await api.put("/chats/group/leave", { chatId: chat._id });
//       await fetchChats();
//       selectChat(null);
//       setShowGroupInfo(false);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to leave group");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteGroup = async () => {
//     if (!window.confirm("Delete this group permanently?")) return;

//     try {
//       setLoading(true);
//       await api.delete("/chats/group/delete", {
//         data: { chatId: chat._id },
//       });
//       await fetchChats();
//       selectChat(null);
//       setShowGroupInfo(false);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete group");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const styles = {
//     header: {
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       padding: window.innerWidth < 480 ? "0.75rem" : "1rem 1.5rem",
//       background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//       color: "white",
//       boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//       position: "relative",
//       zIndex: 10
//     },
//     left: {
//       display: "flex",
//       alignItems: "center",
//       gap: window.innerWidth < 480 ? "0.5rem" : "0.75rem",
//       flex: 1,
//       minWidth: 0
//     },
//     avatarWrapper: {
//       position: "relative",
//       flexShrink: 0
//     },
//     avatar: {
//       width: window.innerWidth < 480 ? "2.25rem" : "2.75rem",
//       height: window.innerWidth < 480 ? "2.25rem" : "2.75rem",
//       borderRadius: "50%",
//       objectFit: "cover",
//       border: "2px solid rgba(255,255,255,0.3)",
//       transition: "transform 0.3s ease"
//     },
//     onlineBadge: {
//       position: "absolute",
//       bottom: 0,
//       right: 0,
//       width: "0.75rem",
//       height: "0.75rem",
//       backgroundColor: "#10b981",
//       border: "2px solid white",
//       borderRadius: "50%",
//       boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.3)"
//     },
//     info: {
//       display: "flex",
//       flexDirection: "column",
//       minWidth: 0,
//       flex: 1
//     },
//     name: {
//       fontWeight: 600,
//       margin: 0,
//       fontSize: window.innerWidth < 480 ? "0.95rem" : "1.1rem",
//       overflow: "hidden",
//       textOverflow: "ellipsis",
//       whiteSpace: "nowrap"
//     },
//     status: {
//       fontSize: window.innerWidth < 480 ? "0.7rem" : "0.75rem",
//       opacity: 0.9,
//       marginTop: "0.15rem",
//       display: "flex",
//       alignItems: "center",
//       gap: "0.25rem"
//     },
//     infoButton: {
//       background: "rgba(255,255,255,0.2)",
//       border: "none",
//       color: "white",
//       padding: "0.5rem",
//       borderRadius: "50%",
//       cursor: "pointer",
//       fontSize: "1.1rem",
//       width: "2.25rem",
//       height: "2.25rem",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       transition: "all 0.3s ease",
//       flexShrink: 0
//     },
//     panel: {
//       position: "absolute",
//       top: "100%",
//       right: window.innerWidth < 480 ? "0.5rem" : "1rem",
//       marginTop: "0.5rem",
//       backgroundColor: "white",
//       color: "#111827",
//       borderRadius: "12px",
//       padding: "1.25rem",
//       boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
//       width: window.innerWidth < 480 ? "calc(100vw - 2rem)" : "18rem",
//       maxWidth: "320px",
//       zIndex: 1000,
//       animation: "slideDown 0.3s ease"
//     },
//     panelHeader: {
//       fontSize: "1rem",
//       fontWeight: 700,
//       marginBottom: "1rem",
//       color: "#1f2937",
//       display: "flex",
//       alignItems: "center",
//       gap: "0.5rem"
//     },
//     membersList: {
//       maxHeight: "200px",
//       overflowY: "auto",
//       marginTop: "0.75rem",
//       marginBottom: "1rem"
//     },
//     member: {
//       fontSize: "0.875rem",
//       padding: "0.5rem",
//       marginBottom: "0.25rem",
//       backgroundColor: "#f9fafb",
//       borderRadius: "6px",
//       display: "flex",
//       alignItems: "center",
//       gap: "0.5rem"
//     },
//     divider: {
//       height: "1px",
//       backgroundColor: "#e5e7eb",
//       margin: "1rem 0"
//     },
//     actionBtn: {
//       width: "100%",
//       padding: "0.625rem",
//       borderRadius: "8px",
//       cursor: "pointer",
//       fontSize: "0.875rem",
//       fontWeight: 600,
//       marginTop: "0.5rem",
//       border: "none",
//       transition: "all 0.3s ease",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       gap: "0.5rem"
//     },
//     leaveBtn: {
//       backgroundColor: "#f3f4f6",
//       color: "#374151",
//       border: "1px solid #d1d5db"
//     },
//     deleteBtn: {
//       backgroundColor: "#ef4444",
//       color: "white"
//     },
//     closeBtn: {
//       backgroundColor: "transparent",
//       color: "#667eea",
//       border: "none"
//     }
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       <style>
//         {`
//           @keyframes slideDown {
//             from {
//               opacity: 0;
//               transform: translateY(-10px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
//         `}
//       </style>

//       <div style={styles.header}>
//         <div style={styles.left}>
//           <div style={styles.avatarWrapper}>
//             <img
//               src={
//                 isGroup
//                   ? chat.groupAvatar || "/group-avatar.png"
//                   : otherUser?.avatar || "/user-avatar.png"
//               }
//               alt="avatar"
//               style={styles.avatar}
//               onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
//               onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
//             />
//             {isOnline && <div style={styles.onlineBadge} />}
//           </div>

//           <div style={styles.info}>
//             <h3 style={styles.name}>
//               {isGroup ? chat.groupName : otherUser?.name}
//             </h3>

//             {!isGroup && (
//               <span style={styles.status}>
//                 <span style={{
//                   width: "6px",
//                   height: "6px",
//                   backgroundColor: isOnline ? "#10b981" : "#9ca3af",
//                   borderRadius: "50%",
//                   display: "inline-block"
//                 }} />
//                 {isOnline ? "Active now" : "Offline"}
//               </span>
//             )}

//             {isGroup && (
//               <span style={styles.status}>
//                 {chat.members?.length || 0} members
//               </span>
//             )}
//           </div>
//         </div>

//         {isGroup && (
//           <button
//             onClick={() => setShowGroupInfo((p) => !p)}
//             style={styles.infoButton}
//             onMouseEnter={(e) => {
//               e.target.style.backgroundColor = "rgba(255,255,255,0.3)";
//               e.target.style.transform = "scale(1.05)";
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.backgroundColor = "rgba(255,255,255,0.2)";
//               e.target.style.transform = "scale(1)";
//             }}
//           >
//             ℹ️
//           </button>
//         )}
//       </div>

//       {isGroup && showGroupInfo && (
//         <div style={styles.panel}>
//           <div style={styles.panelHeader}>
//             👥 Group Members
//           </div>

//           <div style={styles.membersList}>
//             {chat.members.map((m) => (
//               <div key={m._id} style={styles.member}>
//                 <span>{m.name}</span>
//                 {chat.groupAdmin?._id === m._id && (
//                   <span style={{ marginLeft: "auto", fontSize: "1rem" }}>👑</span>
//                 )}
//               </div>
//             ))}
//           </div>

//           <div style={styles.divider} />

//           <button
//             style={{...styles.actionBtn, ...styles.leaveBtn}}
//             onClick={leaveGroup}
//             disabled={loading}
//             onMouseEnter={(e) => e.target.style.backgroundColor = "#e5e7eb"}
//             onMouseLeave={(e) => e.target.style.backgroundColor = "#f3f4f6"}
//           >
//             🚪 Leave Group
//           </button>

//           {isAdmin && (
//             <button
//               style={{...styles.actionBtn, ...styles.deleteBtn}}
//               onClick={deleteGroup}
//               disabled={loading}
//               onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
//               onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
//             >
//               🗑️ Delete Group
//             </button>
//           )}

//           <button
//             style={{...styles.actionBtn, ...styles.closeBtn}}
//             onClick={() => setShowGroupInfo(false)}
//             onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
//             onMouseLeave={(e) => e.target.style.textDecoration = "none"}
//           >
//             Close
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatHeader;

// import { useState } from "react";
// import api from "../../services/api";
// import { useAuthStore } from "../../store/authStore";
// import { useChatStore } from "../../store/chatStore";

// const ChatHeader = ({ chat, currentUserId }) => {
//   const { user } = useAuthStore();
//   const { fetchChats, selectChat, onlineUsers } = useChatStore();

//   const [showGroupInfo, setShowGroupInfo] = useState(false);
//   const [loading, setLoading] = useState(false);

//   if (!chat) return null;

//   const isGroup = chat.isGroupChat;
//   const isAdmin = isGroup && chat.groupAdmin?._id === user?._id;

//   const otherUser = !isGroup
//     ? chat.members?.find((m) => m._id !== currentUserId)
//     : null;

//   const isOnline =
//     !isGroup && otherUser && onlineUsers.includes(otherUser._id);

//   // -------------------------
//   // GROUP ACTIONS
//   // -------------------------
//   const leaveGroup = async () => {
//     if (!window.confirm("Are you sure you want to leave this group?")) return;

//     try {
//       setLoading(true);
//       await api.put("/chats/group/leave", { chatId: chat._id });
//       await fetchChats();
//       selectChat(null);
//       setShowGroupInfo(false);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to leave group");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteGroup = async () => {
//     if (!window.confirm("Delete this group permanently?")) return;

//     try {
//       setLoading(true);
//       await api.delete("/chats/group/delete", {
//         data: { chatId: chat._id },
//       });
//       await fetchChats();
//       selectChat(null);
//       setShowGroupInfo(false);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete group");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------------
//   // STYLES
//   // -------------------------
//   const styles = {
//     header: {
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       padding: "1rem 1.25rem",
//       background: "linear-gradient(135deg,#667eea,#764ba2)",
//       color: "white",
//     },
//     left: {
//       display: "flex",
//       alignItems: "center",
//       gap: "0.75rem",
//       minWidth: 0,
//     },
//     avatarWrapper: { position: "relative" },
//     avatar: {
//       width: "42px",
//       height: "42px",
//       borderRadius: "50%",
//       objectFit: "cover",
//       border: "2px solid rgba(255,255,255,0.4)",
//     },
//     onlineDot: {
//       position: "absolute",
//       bottom: 0,
//       right: 0,
//       width: "10px",
//       height: "10px",
//       borderRadius: "50%",
//       backgroundColor: "#10b981",
//       border: "2px solid white",
//     },
//     name: {
//       fontWeight: 600,
//       fontSize: "1rem",
//       whiteSpace: "nowrap",
//       overflow: "hidden",
//       textOverflow: "ellipsis",
//     },
//     status: {
//       fontSize: "0.75rem",
//       opacity: 0.9,
//     },
//     infoBtn: {
//       background: "rgba(255,255,255,0.2)",
//       border: "none",
//       borderRadius: "50%",
//       color: "white",
//       width: "36px",
//       height: "36px",
//       cursor: "pointer",
//       fontSize: "1.1rem",
//     },
//     panel: {
//       position: "absolute",
//       right: "1rem",
//       top: "100%",
//       marginTop: "0.5rem",
//       background: "white",
//       color: "#111",
//       borderRadius: "10px",
//       width: "260px",
//       padding: "1rem",
//       boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
//       zIndex: 50,
//     },
//     member: {
//       padding: "0.4rem",
//       background: "#f3f4f6",
//       borderRadius: "6px",
//       marginBottom: "0.25rem",
//       display: "flex",
//       alignItems: "center",
//     },
//     actionBtn: {
//       width: "100%",
//       padding: "0.6rem",
//       marginTop: "0.5rem",
//       borderRadius: "6px",
//       border: "none",
//       cursor: "pointer",
//       fontWeight: 600,
//     },
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       <div style={styles.header}>
//         <div style={styles.left}>
//           <div style={styles.avatarWrapper}>
//             <img
//               src={
//                 isGroup
//                   ? chat.groupAvatar || "/group-avatar.png"
//                   : otherUser?.avatar || "/user-avatar.png"
//               }
//               alt="avatar"
//               style={styles.avatar}
//             />
//             {isOnline && <span style={styles.onlineDot} />}
//           </div>

//           <div>
//             <div style={styles.name}>
//               {isGroup ? chat.groupName : otherUser?.name}
//             </div>
//             {!isGroup && (
//               <div style={styles.status}>
//                 {isOnline ? "Active now" : "Offline"}
//               </div>
//             )}
//             {isGroup && (
//               <div style={styles.status}>
//                 {chat.members?.length || 0} members
//               </div>
//             )}
//           </div>
//         </div>

//         {isGroup && (
//           <button
//             style={styles.infoBtn}
//             onClick={() => setShowGroupInfo((p) => !p)}
//           >
//             ℹ️
//           </button>
//         )}
//       </div>

//       {isGroup && showGroupInfo && (
//         <div style={styles.panel}>
//           <strong>Group Members</strong>

//           <div style={{ marginTop: "0.5rem" }}>
//             {chat.members?.map((m) => (
//               <div key={m._id} style={styles.member}>
//                 {m.name}
//                 {chat.groupAdmin?._id === m._id && (
//                   <span style={{ marginLeft: "auto" }}>👑</span>
//                 )}
//               </div>
//             ))}
//           </div>

//           <button
//             style={{ ...styles.actionBtn, background: "#e5e7eb" }}
//             onClick={leaveGroup}
//             disabled={loading}
//           >
//             🚪 Leave Group
//           </button>

//           {isAdmin && (
//             <button
//               style={{
//                 ...styles.actionBtn,
//                 background: "#ef4444",
//                 color: "white",
//               }}
//               onClick={deleteGroup}
//               disabled={loading}
//             >
//               🗑️ Delete Group
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatHeader;

import { useState } from "react";
import api from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";

const ChatHeader = ({ chat, currentUserId }) => {
  const { user } = useAuthStore();
  const {
    fetchChats,
    selectChat,
    onlineUsers,
    typingUser,
  } = useChatStore();

  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editGroup, setEditGroup] = useState(false);
  const [groupName, setGroupName] = useState(chat?.groupName || "");

  if (!chat) return null;

  const isGroup = chat.isGroupChat;
  const isAdmin = isGroup && chat.groupAdmin?._id === user?._id;

  const otherUser = !isGroup
    ? chat.members?.find((m) => m._id !== currentUserId)
    : null;

  const isOnline =
    !isGroup && otherUser && onlineUsers.includes(otherUser._id);

  // -------------------------
  // GROUP ACTIONS
  // -------------------------
  const leaveGroup = async () => {
    if (!window.confirm("Are you sure you want to leave this group?")) return;

    try {
      setLoading(true);
      await api.put("/chats/group/leave", { chatId: chat._id });
      await fetchChats();
      selectChat(null);
      setShowGroupInfo(false);
    } catch (err) {
      console.error(err);
      alert("Failed to leave group");
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async () => {
    if (!window.confirm("Delete this group permanently?")) return;

    try {
      setLoading(true);
      await api.delete("/chats/group/delete", {
        data: { chatId: chat._id },
      });
      await fetchChats();
      selectChat(null);
      setShowGroupInfo(false);
    } catch (err) {
      console.error(err);
      alert("Failed to delete group");
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
    } catch (err) {
      console.error(err);
      alert("Failed to update group");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // STYLES
  // -------------------------
  const styles = {
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 1.25rem",
      background: "linear-gradient(135deg,#667eea,#764ba2)",
      color: "white",
    },
    left: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      minWidth: 0,
    },
    avatarWrapper: { position: "relative" },
    avatar: {
      width: "42px",
      height: "42px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid rgba(255,255,255,0.4)",
    },
    onlineDot: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      backgroundColor: "#10b981",
      border: "2px solid white",
    },
    name: {
      fontWeight: 600,
      fontSize: "1rem",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    status: {
      fontSize: "0.75rem",
      opacity: 0.9,
    },
    infoBtn: {
      background: "rgba(255,255,255,0.2)",
      border: "none",
      borderRadius: "50%",
      color: "white",
      width: "36px",
      height: "36px",
      cursor: "pointer",
      fontSize: "1.1rem",
    },
    panel: {
      position: "absolute",
      right: "1rem",
      top: "100%",
      marginTop: "0.5rem",
      background: "white",
      color: "#111",
      borderRadius: "10px",
      width: "260px",
      padding: "1rem",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      zIndex: 50,
    },
    member: {
      padding: "0.4rem",
      background: "#f3f4f6",
      borderRadius: "6px",
      marginBottom: "0.25rem",
      display: "flex",
      alignItems: "center",
    },
    actionBtn: {
      width: "100%",
      padding: "0.6rem",
      marginTop: "0.5rem",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
    },
    editInput: {
      width: "100%",
      padding: "0.4rem",
      marginTop: "0.4rem",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
    },
  };

  return (
    <div style={{ position: "relative" }}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.left}>
          <div style={styles.avatarWrapper}>
            <img
              src={
                isGroup
                  ? chat.groupAvatar || "/group-avatar.png"
                  : otherUser?.avatar || "/user-avatar.png"
              }
              alt="avatar"
              style={styles.avatar}
            />
            {isOnline && <span style={styles.onlineDot} />}
          </div>

          <div>
            <div style={styles.name}>
              {isGroup ? chat.groupName : otherUser?.name}
            </div>

            {!isGroup && (
              <>
                {typingUser === otherUser?._id ? (
                  <div style={styles.status}>typing...</div>
                ) : (
                  <div style={styles.status}>
                    {isOnline
                      ? "Active now"
                      : otherUser?.lastSeen
                      ? `Last seen ${new Date(
                          otherUser.lastSeen
                        ).toLocaleTimeString()}`
                      : "Offline"}
                  </div>
                )}
              </>
            )}

            {isGroup && (
              <div style={styles.status}>
                {chat.members?.length || 0} members
              </div>
            )}
          </div>
        </div>

        {isGroup && (
          <button
            style={styles.infoBtn}
            onClick={() => setShowGroupInfo((p) => !p)}
          >
            ℹ️
          </button>
        )}
      </div>

      {/* GROUP INFO PANEL */}
      {isGroup && showGroupInfo && (
        <div style={styles.panel}>
          <strong>Group Members</strong>

          <div style={{ marginTop: "0.5rem" }}>
            {chat.members?.map((m) => (
              <div key={m._id} style={styles.member}>
                {m.name}
                {chat.groupAdmin?._id === m._id && (
                  <span style={{ marginLeft: "auto" }}>👑</span>
                )}
              </div>
            ))}
          </div>

          {isAdmin && (
            <>
              {!editGroup ? (
                <button
                  style={{ ...styles.actionBtn, background: "#e0e7ff" }}
                  onClick={() => setEditGroup(true)}
                >
                  ✏️ Edit Group Name
                </button>
              ) : (
                <>
                  <input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    style={styles.editInput}
                  />
                  <button
                    style={{
                      ...styles.actionBtn,
                      background: "#4f46e5",
                      color: "white",
                    }}
                    onClick={saveGroupName}
                    disabled={loading}
                  >
                    Save
                  </button>
                </>
              )}
            </>
          )}

          <button
            style={{ ...styles.actionBtn, background: "#e5e7eb" }}
            onClick={leaveGroup}
            disabled={loading}
          >
            🚪 Leave Group
          </button>

          {isAdmin && (
            <button
              style={{
                ...styles.actionBtn,
                background: "#ef4444",
                color: "white",
              }}
              onClick={deleteGroup}
              disabled={loading}
            >
              🗑️ Delete Group
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
