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

import { formatTime } from "../../utils/formatTime";

const ChatItem = ({
  chat,
  isActive,
  onlineUsers = [],
  currentUserId,
  onClick,
}) => {
  // ----------------------------
  // CHAT TYPE
  // ----------------------------
  const isGroup = chat.isGroupChat;

  // ----------------------------
  // FIND OTHER USER (1–1 CHAT)
  // ----------------------------
  const otherUser = !isGroup
    ? chat.members?.find(
        (user) => user._id.toString() !== currentUserId.toString()
      )
    : null;

  // ----------------------------
  // NAME & AVATAR
  // ----------------------------
  const chatName = isGroup
    ? chat.groupName
    : otherUser?.name;

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
    ? chat.lastMessage.content || "📎 Attachment"
    : "No messages yet";

  return (
    <div
      onClick={onClick}
      style={{
        padding: "0.75rem 1rem",
        cursor: "pointer",
        background: isActive ? "#eef2ff" : "transparent",
        display: "flex",
        gap: "0.75rem",
        alignItems: "center",
      }}
    >
      {/* AVATAR */}
      <div style={{ position: "relative" }}>
        <img
          src={avatar}
          alt={chatName}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        {/* ONLINE DOT */}
        {isOnline && (
          <span
            style={{
              position: "absolute",
              bottom: 2,
              right: 2,
              width: 10,
              height: 10,
              background: "#22c55e",
              borderRadius: "50%",
              border: "2px solid white",
            }}
          />
        )}
      </div>

      {/* INFO */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* TOP ROW */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "#111827",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {chatName}
          </span>

          {chat.lastMessage && (
            <span
              style={{
                fontSize: "0.7rem",
                color: "#6b7280",
                marginLeft: "0.5rem",
              }}
            >
              {formatTime(chat.lastMessage.createdAt)}
            </span>
          )}
        </div>

        {/* BOTTOM ROW */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "2px",
          }}
        >
          <span
            style={{
              fontSize: "0.8rem",
              color: "#6b7280",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {lastMessageText}
          </span>

          {chat.unreadCount > 0 && (
            <span
              style={{
                background: "#6366f1",
                color: "white",
                borderRadius: "999px",
                padding: "0 7px",
                fontSize: "0.7rem",
                fontWeight: 600,
                marginLeft: "6px",
              }}
            >
              {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
