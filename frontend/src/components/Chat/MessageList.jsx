import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

const MessageList = ({ messages = [], currentUserId, chat }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const styles = {
    container: {
      height: "100%",
      overflowY: "auto",
      overflowX: "hidden",
      padding: window.innerWidth < 480 ? "1rem 0.5rem" : "1.5rem 0.75rem",
      background: "linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%)",
      position: "relative"
    },
    dateHeader: {
      textAlign: "center",
      margin: "1.5rem 0",
      position: "relative"
    },
    dateText: {
      display: "inline-block",
      padding: "0.375rem 1rem",
      backgroundColor: "rgba(102, 126, 234, 0.1)",
      color: "#667eea",
      borderRadius: "16px",
      fontSize: "0.75rem",
      fontWeight: 600,
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
    },
    emptyState: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      color: "#9ca3af",
      textAlign: "center",
      padding: "2rem"
    },
    emptyIcon: {
      fontSize: window.innerWidth < 480 ? "3rem" : "4rem",
      marginBottom: "1rem",
      opacity: 0.5
    },
    emptyText: {
      fontSize: window.innerWidth < 480 ? "0.95rem" : "1.05rem",
      fontWeight: 500,
      marginBottom: "0.5rem"
    },
    emptySubtext: {
      fontSize: window.innerWidth < 480 ? "0.8rem" : "0.875rem",
      opacity: 0.7
    },
    scrollButton: {
      position: "fixed",
      bottom: "5rem",
      right: "1.5rem",
      backgroundColor: "#667eea",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "2.5rem",
      height: "2.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
      transition: "all 0.3s ease",
      zIndex: 100
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", { 
      weekday: "long", 
      month: "long", 
      day: "numeric" 
    });
  };

  return (
    <>
      <style>
        {`
          .message-list-container::-webkit-scrollbar {
            width: 6px;
          }
          .message-list-container::-webkit-scrollbar-track {
            background: transparent;
          }
          .message-list-container::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 10px;
          }
          .message-list-container::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
        `}
      </style>

      <div style={styles.container} className="message-list-container">
        {messages.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💬</div>
            <div style={styles.emptyText}>
              No messages yet
            </div>
            <div style={styles.emptySubtext}>
              Start the conversation by sending a message
            </div>
          </div>
        ) : (
          <>
            <div style={styles.dateHeader}>
              <span style={styles.dateText}>
                {getTodayDate()}
              </span>
            </div>

            {messages.map((msg, index) => (
              <MessageItem
                key={msg._id || `${msg.sender}-${index}`}
                message={msg}
                currentUserId={currentUserId}
                isGroup={chat?.isGroupChat}
              />
            ))}
          </>
        )}

        <div ref={bottomRef} style={{ height: "1px" }} />
      </div>
    </>
  );
};

export default MessageList;