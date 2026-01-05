// import React from "react";
// const MessageItem = ({ message, currentUserId, isGroup }) => {
//   // -------- SAFE senderId extraction --------
//   const senderId =
//     typeof message.sender === "string"
//       ? message.sender
//       : message.sender?._id || message.sender?.id;

    
//   const isOwn = senderId === currentUserId;

//   // -------- DEBUG (remove later) --------
//   console.log("senderId:", senderId, "currentUserId:", currentUserId);

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: isOwn ? "flex-end" : "flex-start",
//         padding: "4px 12px",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: "65%",
//           padding: "8px 12px",
//           borderRadius: "8px",
//           backgroundColor: isOwn ? "#dcf8c6" : "#ffffff",
//           alignSelf: isOwn ? "flex-end" : "flex-start",
//           boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
//         }}
//       >
//         {/* Group sender name */}
//         {isGroup && !isOwn && message.sender?.name && (
//           <div style={{ fontSize: "12px", fontWeight: 600, color: "#2563eb" }}>
//             {message.sender.name}
//           </div>
//         )}

//         <div>{message.content}</div>

//         <div
//           style={{
//             fontSize: "11px",
//             textAlign: "right",
//             marginTop: "4px",
//             color: "#6b7280",
//           }}
//         >
//           {new Date(message.createdAt || Date.now()).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MessageItem;


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


// import { formatTime } from "../../utils/formatTime";

// const MessageItem = ({ message, currentUserId, isGroup }) => {
//   const senderId =
//     typeof message.sender === "string"
//       ? message.sender
//       : message.sender?._id;

//   const isOwn = senderId === currentUserId;
//   const imageUrl = message.fileUrl || message.content;

//   // ----------------------------
//   // WHATSAPP TICK LOGIC
//   // ----------------------------
//   const getMessageStatus = () => {
//     if (!isOwn) return null;

//     if (message.seen || message.isRead) {
//       return { icon: "✓✓", color: "#53bdeb", label: "Read" };
//     }
//     if (message.delivered || message.isDelivered) {
//       return { icon: "✓✓", color: "#9ca3af", label: "Delivered" };
//     }
//     return { icon: "✓", color: "#9ca3af", label: "Sent" };
//   };

//   const messageStatus = getMessageStatus();

//   // ----------------------------
//   // CONTENT RENDERER
//   // ----------------------------
//   const renderContent = () => {
//     if (message.isDeleted) {
//       return (
//         <em style={{ fontStyle: "italic", opacity: 0.7 }}>
//           🚫 This message was deleted
//         </em>
//       );
//     }

//     switch (message.type) {
//       case "image":
//         return (
//           <img
//             src={message.fileUrl || message.content}
//             alt="uploaded"
//             style={{
//               maxWidth: "240px",
//               borderRadius: "12px",
//               cursor: "pointer",
//             }}
//             onClick={() =>
//               window.open(message.fileUrl || message.content, "_blank")
//             }
//           />
//         );

//       case "file":
//         return (
//           <a
//             href={message.fileUrl || message.content}
//             target="_blank"
//             rel="noopener noreferrer"
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "0.5rem",
//               padding: "0.5rem",
//               borderRadius: "8px",
//               backgroundColor: isOwn
//                 ? "rgba(255,255,255,0.15)"
//                 : "#f3f4f6",
//               color: isOwn ? "#dbeafe" : "#2563eb",
//               textDecoration: "none",
//             }}
//           >
//             <span style={{ fontSize: "1.25rem" }}>📎</span>
//             <span>{message.fileName || "Download file"}</span>
//           </a>
//         );

//       default:
//         return (
//           <p style={{ margin: 0, lineHeight: 1.5 }}>
//             {message.content}
//           </p>
//         );
//     }
//   };

//   // ----------------------------
//   // STYLES
//   // ----------------------------
//   const styles = {
//     container: {
//       display: "flex",
//       justifyContent: isOwn ? "flex-end" : "flex-start",
//       padding: "0.25rem 1rem",
//       animation: "fadeIn 0.25s ease",
//     },
//     wrapper: {
//       maxWidth: "75%",
//       display: "flex",
//       flexDirection: "column",
//       gap: "0.25rem",
//     },
//     sender: {
//       fontSize: "0.75rem",
//       fontWeight: 600,
//       color: "#667eea",
//       paddingLeft: "0.5rem",
//     },
//     bubble: {
//       background: isOwn
//         ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//         : "#ffffff",
//       color: isOwn ? "#ffffff" : "#1f2937",
//       padding: "0.75rem 1rem",
//       borderRadius: isOwn
//         ? "18px 18px 4px 18px"
//         : "18px 18px 18px 4px",
//       boxShadow: isOwn
//         ? "0 4px 12px rgba(102,126,234,0.3)"
//         : "0 2px 8px rgba(0,0,0,0.1)",
//     },
//     meta: {
//       display: "flex",
//       justifyContent: "flex-end",
//       alignItems: "center",
//       gap: "0.35rem",
//       marginTop: "0.25rem",
//       fontSize: "0.7rem",
//       opacity: 0.85,
//     },
//   };

//   return (
//     <>
//       <style>
//         {`
//           @keyframes fadeIn {
//             from {
//               opacity: 0;
//               transform: translateY(6px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
//         `}
//       </style>

//       <div style={styles.container}>
//         <div style={styles.wrapper}>
//           {/* GROUP SENDER NAME */}
//           {isGroup && !isOwn && (
//             <div style={styles.sender}>
//               {message.sender?.name}
//             </div>
//           )}

//           {/* MESSAGE BUBBLE */}
//           <div style={styles.bubble}>
//             {renderContent()}

//             {/* TIME + TICKS */}
//             <div style={styles.meta}>
//               <span>{formatTime(message.createdAt)}</span>

//               {messageStatus && (
//                 <span
//                   title={messageStatus.label}
//                   style={{
//                     color: messageStatus.color,
//                     fontWeight: "bold",
//                     fontSize: "0.9rem",
//                   }}
//                 >
//                   {messageStatus.icon}
//                 </span>
//               )}
//             </div>
//           </div>
//           <img src={imageUrl} />

//         </div>
//       </div>
//     </>
//   );
// };

// export default MessageItem;
// import { formatTime } from "../../utils/formatTime";

// const MessageItem = ({ message, currentUserId, isGroup }) => {
//   // ----------------------------
//   // DETERMINE SENDER
//   // ----------------------------
//   const senderId =
//     typeof message.sender === "string"
//       ? message.sender
//       : message.sender?._id;

//   const isOwn = senderId === currentUserId;

//   // ----------------------------
//   // WHATSAPP TICKS
//   // ----------------------------
//   let ticks = "";
//   let tickColor = "#9ca3af";

//   if (isOwn) {
//     if (message.seen) {
//       ticks = "✓✓";
//       tickColor = "#53bdeb";
//     } else if (message.delivered) {
//       ticks = "✓✓";
//     } else {
//       ticks = "✓";
//     }
//   }

//   // ----------------------------
//   // MESSAGE CONTENT
//   // ----------------------------
//   const renderContent = () => {
//     switch (message.type) {
//       case "image":
//         return (
//           <img
//             src={message.fileUrl}
//             alt="image"
//             style={{
//               maxWidth: "220px",
//               borderRadius: "10px",
//               marginTop: "4px",
//             }}
//           />
//         );

//       case "file":
//         return (
//           <a
//             href={message.fileUrl}
//             target="_blank"
//             rel="noreferrer"
//             style={{ color: "#2563eb" }}
//           >
//             📎 Download file
//           </a>
//         );

//       default:
//         return <span>{message.content}</span>;
//     }
//   };

//   // ----------------------------
//   // UI
//   // ----------------------------
//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: isOwn ? "flex-end" : "flex-start",
//         padding: "0.25rem 1rem",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: "70%",
//           backgroundColor: isOwn ? "#dcf8c6" : "#ffffff",
//           padding: "0.5rem 0.75rem",
//           borderRadius: "10px",
//           boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//         }}
//       >
//         {/* GROUP SENDER NAME */}
//         {isGroup && !isOwn && (
//           <div
//             style={{
//               fontSize: "0.7rem",
//               fontWeight: 600,
//               marginBottom: "2px",
//             }}
//           >
//             {message.sender?.name}
//           </div>
//         )}

//         {/* CONTENT */}
//         {renderContent()}

//         {/* TIME + TICKS */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "flex-end",
//             gap: "4px",
//             fontSize: "0.65rem",
//             marginTop: "2px",
//             color: "#6b7280",
//           }}
//         >
//           <span>{formatTime(message.createdAt)}</span>
//           {isOwn && <span style={{ color: tickColor }}>{ticks}</span>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MessageItem;


import { formatTime } from "../../utils/formatTime";

const MessageItem = ({ message, currentUserId, isGroup }) => {
  // ----------------------------
  // DETERMINE SENDER
  // ----------------------------
  const senderId =
    typeof message.sender === "string"
      ? message.sender
      : message.sender?._id;

  const isOwn = senderId === currentUserId;

  // ----------------------------
  // WHATSAPP-STYLE TICKS
  // ----------------------------
  let ticks = "";
  let tickColor = "#9ca3af";

  if (isOwn) {
    if (message.seen) {
      ticks = "✓✓";
      tickColor = "#53bdeb"; // blue = seen
    } else if (message.delivered) {
      ticks = "✓✓"; // delivered
    } else {
      ticks = "✓"; // sent
    }
  }

  // ----------------------------
  // MESSAGE CONTENT
  // ----------------------------
  const renderContent = () => {
    switch (message.type) {
      case "image":
        return (
          <img
            src={message.fileUrl}
            alt="image"
            style={{
              maxWidth: "220px",
              borderRadius: "10px",
              marginTop: "4px",
            }}
          />
        );

      case "file":
        return (
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#2563eb",
              textDecoration: "underline",
            }}
          >
            📎 Download file
          </a>
        );

      default:
        return <span>{message.content}</span>;
    }
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isOwn ? "flex-end" : "flex-start",
        padding: "0.25rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          backgroundColor: isOwn ? "#dcf8c6" : "#ffffff",
          padding: "0.5rem 0.75rem",
          borderRadius: "10px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {/* GROUP CHAT – SENDER NAME */}
        {isGroup && !isOwn && (
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              marginBottom: "2px",
              color: "#4f46e5",
            }}
          >
            {message.sender?.name}
          </div>
        )}

        {/* MESSAGE CONTENT */}
        {renderContent()}

        {/* TIME + STATUS */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "4px",
            fontSize: "0.65rem",
            marginTop: "2px",
            color: "#6b7280",
          }}
        >
          <span>{formatTime(message.createdAt)}</span>
          {isOwn && <span style={{ color: tickColor }}>{ticks}</span>}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
