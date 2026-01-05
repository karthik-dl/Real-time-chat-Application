// import { useChatStore } from "../../store/chatStore";
// import { formatTime } from "../../utils/formatTime";

// const ChatItem = ({ chat, currentUserId, onlineUsers = [], isActive }) => {
//   const { selectChat } = useChatStore();
//   const isGroup = chat.isGroupChat;
//   const otherUser = !isGroup
//     ? chat.members.find((m) => m._id !== currentUserId)
//     : null;
//   const isOnline =
//     !isGroup && onlineUsers.includes(otherUser?._id);

//   const lastMessageText = () => {
//     if (!chat.lastMessage) return "No messages yet";
//     switch (chat.lastMessage.type) {
//       case "image":
//         return "📷 Photo";
//       case "audio":
//         return "🎙️ Voice message";
//       case "file":
//         return "📎 File";
//       default:
//         return chat.lastMessage.content;
//     }
//   };

//   const styles = {
//     container: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '0.75rem',
//       padding: '0.75rem 1rem',
//       cursor: 'pointer',
//       transition: 'background-color 0.2s',
//       backgroundColor: isActive ? '#e5e7eb' : 'transparent'
//     },
//     avatarWrapper: {
//       position: 'relative'
//     },
//     avatar: {
//       width: '3rem',
//       height: '3rem',
//       borderRadius: '50%',
//       objectFit: 'cover'
//     },
//     onlineDot: {
//       position: 'absolute',
//       bottom: 0,
//       right: 0,
//       width: '0.75rem',
//       height: '0.75rem',
//       backgroundColor: '#10b981',
//       border: '2px solid white',
//       borderRadius: '50%'
//     },
//     chatInfo: {
//       flex: 1,
//       minWidth: 0
//     },
//     topRow: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center'
//     },
//     name: {
//       fontWeight: '500',
//       margin: 0,
//       overflow: 'hidden',
//       textOverflow: 'ellipsis',
//       whiteSpace: 'nowrap'
//     },
//     time: {
//       fontSize: '0.75rem',
//       color: '#6b7280'
//     },
//     bottomRow: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center'
//     },
//     message: {
//       fontSize: '0.875rem',
//       color: '#4b5563',
//       margin: 0,
//       overflow: 'hidden',
//       textOverflow: 'ellipsis',
//       whiteSpace: 'nowrap'
//     },
//     unreadBadge: {
//       marginLeft: '0.5rem',
//       backgroundColor: '#10b981',
//       color: 'white',
//       fontSize: '0.75rem',
//       padding: '0.125rem 0.5rem',
//       borderRadius: '9999px',
//       whiteSpace: 'nowrap'
//     }
//   };

//   return (
//     <div
//       onClick={() => selectChat(chat)}   // ✅ IMPORTANT FIX
//       style={styles.container}
//       onMouseEnter={(e) => {
//         if (!isActive) e.currentTarget.style.backgroundColor = '#f3f4f6';
//       }}
//       onMouseLeave={(e) => {
//         if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
//       }}
//     >
//       {/* Avatar */}
//       <div style={styles.avatarWrapper}>
//         <img
//           src={
//             isGroup
//               ? "/group-avatar.png"
//               : otherUser?.avatar || "/user-avatar.png"
//           }
//           alt="avatar"
//           style={styles.avatar}
//         />
//         {/* Online indicator */}
//         {isOnline && (
//           <span style={styles.onlineDot}></span>
//         )}
//       </div>

//       {/* Chat Info */}
//       <div style={styles.chatInfo}>
//         <div style={styles.topRow}>
//           <h4 style={styles.name}>
//             {isGroup ? chat.groupName || "Group Chat" : otherUser?.name}
//           </h4>
//           {chat.lastMessage && (
//             <span style={styles.time}>
//               {formatTime(chat.lastMessage.createdAt)}
//             </span>
//           )}
//         </div>

//         <div style={styles.bottomRow}>
//           <p style={styles.message}>
//             {lastMessageText()}
//           </p>
//           {/* Unread badge */}
//           {chat.unreadCount > 0 && (
//             <span style={styles.unreadBadge}>
//               {chat.unreadCount}
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatItem;
// above code is working fine
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// latest code after fixes
  // import { useChatStore } from "../../store/chatStore";
  // import { formatTime } from "../../utils/formatTime";

  // const ChatItem = ({ chat, currentUserId, onlineUsers = [], isActive }) => {
  //   const { selectChat } = useChatStore();

  //   const isGroup = chat.isGroupChat;

  //   const otherUser = !isGroup
  //     ? chat.members.find((m) => m._id !== currentUserId)
  //     : null;

  //   const isOnline =
  //     !isGroup && onlineUsers.includes(otherUser?._id);

  //   const lastMessageText = () => {
  //     if (!chat.lastMessage) return "No messages yet";

  //     switch (chat.lastMessage.type) {
  //       case "image":
  //         return "📷 Photo";
  //       case "audio":
  //         return "🎙️ Voice message";
  //       case "file":
  //         return "📎 File";
  //       default:
  //         return chat.lastMessage.content;
  //     }
  //   };

  //   const styles = {
  //     container: {
  //       display: "flex",
  //       alignItems: "center",
  //       gap: "0.75rem",
  //       padding: "0.75rem 1rem",
  //       cursor: "pointer",
  //       backgroundColor: isActive ? "#e5e7eb" : "transparent",
  //     },
  //     avatarWrapper: {
  //       position: "relative",
  //     },
  //     avatar: {
  //       width: "3rem",
  //       height: "3rem",
  //       borderRadius: "50%",
  //       objectFit: "cover",
  //     },
  //     onlineDot: {
  //       position: "absolute",
  //       bottom: 0,
  //       right: 0,
  //       width: "0.75rem",
  //       height: "0.75rem",
  //       backgroundColor: "#10b981",
  //       border: "2px solid white",
  //       borderRadius: "50%",
  //     },
  //     chatInfo: {
  //       flex: 1,
  //       minWidth: 0,
  //     },
  //     topRow: {
  //       display: "flex",
  //       justifyContent: "space-between",
  //       alignItems: "center",
  //     },
  //     name: {
  //       fontWeight: 500,
  //       margin: 0,
  //       overflow: "hidden",
  //       textOverflow: "ellipsis",
  //       whiteSpace: "nowrap",
  //     },
  //     time: {
  //       fontSize: "0.75rem",
  //       color: "#6b7280",
  //     },
  //     bottomRow: {
  //       display: "flex",
  //       justifyContent: "space-between",
  //       alignItems: "center",
  //     },
  //     message: {
  //       fontSize: "0.875rem",
  //       color: "#4b5563",
  //       margin: 0,
  //       overflow: "hidden",
  //       textOverflow: "ellipsis",
  //       whiteSpace: "nowrap",
  //     },
  //     unreadBadge: {
  //       backgroundColor: "#10b981",
  //       color: "white",
  //       fontSize: "0.75rem",
  //       padding: "0.125rem 0.5rem",
  //       borderRadius: "9999px",
  //     },
  //   };

  //   return (
  //     <div
  //       style={styles.container}
  //       onClick={() => selectChat(chat)}
  //       onMouseEnter={(e) => {
  //         if (!isActive) e.currentTarget.style.backgroundColor = "#f3f4f6";
  //       }}
  //       onMouseLeave={(e) => {
  //         if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
  //       }}
  //     >
  //       {/* Avatar */}
  //       <div style={styles.avatarWrapper}>
  //         <img
  //           src={
  //             isGroup
  //               ? "/group-avatar.png"
  //               : otherUser?.avatar || "/user-avatar.png"
  //           }
  //           alt="avatar"
  //           style={styles.avatar}
  //         />
  //         {isOnline && <span style={styles.onlineDot} />}
  //       </div>

  //       {/* Chat Info */}
  //       <div style={styles.chatInfo}>
  //         <div style={styles.topRow}>
  //           <h4 style={styles.name}>
  //             {isGroup ? chat.groupName || "Group Chat" : otherUser?.name}
  //           </h4>

  //           {chat.lastMessage && (
  //             <span style={styles.time}>
  //               {formatTime(chat.lastMessage.createdAt)}
  //             </span>
  //           )}
  //         </div>

  //         <div style={styles.bottomRow}>
  //           <p style={styles.message}>{lastMessageText()}</p>

  //           {chat.unreadCount > 0 && (
  //             <span style={styles.unreadBadge}>
  //               {chat.unreadCount}
  //             </span>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // export default ChatItem;
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>below code is fully updated>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

import { useChatStore } from "../../store/chatStore";
import { formatTime } from "../../utils/formatTime";

const ChatItem = ({ chat, currentUserId, onlineUsers = [], isActive }) => {
  const { selectChat } = useChatStore();

  const isGroup = chat.isGroupChat;

  const otherUser = !isGroup
    ? chat.members?.find((m) => m._id !== currentUserId)
    : null;

  const isOnline = !isGroup && otherUser && onlineUsers.includes(otherUser._id);

  // ----------------------------
  // LAST MESSAGE DATA
  // ----------------------------
  const getLastMessageData = () => {
    if (!chat.lastMessage) {
      return {
        text: "No messages yet",
        isOwn: false,
        status: "",
        isSeen: false,
      };
    }

    const senderId =
      typeof chat.lastMessage.sender === "string"
        ? chat.lastMessage.sender
        : chat.lastMessage.sender?._id;

    const isOwn = senderId === currentUserId;

    // ✓ ✓✓ logic
    let status = "";
    if (isOwn) {
      if (chat.lastMessage.seen || chat.lastMessage.isRead) {
        status = "✓✓"; // seen
      } else if (chat.lastMessage.delivered || chat.lastMessage.isDelivered) {
        status = "✓✓"; // delivered
      } else {
        status = "✓"; // sent
      }
    }

    let content = "";
    switch (chat.lastMessage.type) {
      case "image":
        content = "📷 Photo";
        break;
      case "file":
        content = "📎 File";
        break;
      case "audio":
        content = "🎙️ Voice message";
        break;
      default:
        content = chat.lastMessage.content;
    }

    return {
      text: isOwn ? `You: ${content}` : content,
      isOwn,
      status,
      isSeen: chat.lastMessage.seen || chat.lastMessage.isRead,
    };
  };

  const message = getLastMessageData();

  // ----------------------------
  // STYLES
  // ----------------------------
  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      gap: "0.875rem",
      padding: "1rem 1.25rem",
      cursor: "pointer",
      backgroundColor: isActive ? "#f0f4ff" : "transparent",
      borderLeft: isActive ? "4px solid #667eea" : "4px solid transparent",
    },
    avatarWrapper: { position: "relative" },
    avatar: {
      width: "3.25rem",
      height: "3.25rem",
      borderRadius: "50%",
      objectFit: "cover",
    },
    onlineDot: {
      position: "absolute",
      bottom: 2,
      right: 2,
      width: "0.8rem",
      height: "0.8rem",
      backgroundColor: "#10b981",
      border: "2px solid white",
      borderRadius: "50%",
    },
    chatInfo: { flex: 1, minWidth: 0 },
    topRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "0.25rem",
    },
    name: { fontWeight: 600 },
    time: { fontSize: "0.75rem", color: "#9ca3af" },
    bottomRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    messageContainer: {
      display: "flex",
      alignItems: "center",
      gap: "0.35rem",
      overflow: "hidden",
    },
    status: {
      fontSize: "0.75rem",
      color: message.isSeen ? "#53bdeb" : "#9ca3af",
      fontWeight: "bold",
    },
    message: {
      fontSize: "0.875rem",
      color: chat.unreadCount > 0 ? "#1f2937" : "#6b7280",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
    badge: {
      background: "#667eea",
      color: "white",
      fontSize: "0.7rem",
      padding: "0.2rem 0.5rem",
      borderRadius: "12px",
    },
  };

  return (
    <div style={styles.container} onClick={() => selectChat(chat)}>
      {/* AVATAR */}
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

      {/* INFO */}
      <div style={styles.chatInfo}>
        <div style={styles.topRow}>
          <span style={styles.name}>
            {isGroup ? chat.groupName : otherUser?.name}
          </span>
          {chat.lastMessage && (
            <span style={styles.time}>
              {formatTime(chat.lastMessage.createdAt)}
            </span>
          )}
        </div>

        <div style={styles.bottomRow}>
          <div style={styles.messageContainer}>
            {message.isOwn && message.status && (
              <span style={styles.status}>{message.status}</span>
            )}
            <span style={styles.message}>{message.text}</span>
          </div>

          {chat.unreadCount > 0 && (
            <span style={styles.badge}>
              {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
