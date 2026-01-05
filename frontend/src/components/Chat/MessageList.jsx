import { useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";

const MessageList = ({ messages = [], currentUserId, chat }) => {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Show/hide scroll-to-bottom button
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom && messages.length > 0);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages.length]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach((message) => {
      const date = new Date(message.createdAt);
      const dateKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  // Format date label
  const formatDateLabel = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateKey = date.toLocaleDateString();
    const todayKey = today.toLocaleDateString();
    const yesterdayKey = yesterday.toLocaleDateString();

    if (dateKey === todayKey) return "Today";
    if (dateKey === yesterdayKey) return "Yesterday";
    
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <>
      {/* CUSTOM SCROLLBAR STYLES */}
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
            transition: background 0.2s ease;
          }
          .message-list-container::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* MESSAGE LIST CONTAINER */}
      <div
        ref={containerRef}
        className="message-list-container"
        style={{
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          padding: window.innerWidth < 480 ? "1rem 0.5rem" : "1.5rem 0.75rem",
          background: "linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%)",
          position: "relative",
          scrollBehavior: "smooth",
        }}
      >
        {/* EMPTY STATE */}
        {messages.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#9ca3af",
              textAlign: "center",
              padding: "2rem",
              animation: "fadeIn 0.5s ease-out",
            }}
          >
            <div
              style={{
                fontSize: window.innerWidth < 480 ? "3rem" : "4rem",
                marginBottom: "1rem",
                opacity: 0.5,
                filter: "grayscale(0.3)",
              }}
            >
              💬
            </div>
            <div
              style={{
                fontSize: window.innerWidth < 480 ? "0.95rem" : "1.05rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
                color: "#6b7280",
              }}
            >
              No messages yet
            </div>
            <div
              style={{
                fontSize: window.innerWidth < 480 ? "0.8rem" : "0.875rem",
                opacity: 0.7,
                maxWidth: "300px",
              }}
            >
              Start the conversation by sending a message below
            </div>
          </div>
        ) : (
          <>
            {/* MESSAGES GROUPED BY DATE */}
            {Object.entries(messageGroups).map(([dateKey, groupMessages]) => (
              <div key={dateKey}>
                {/* DATE HEADER */}
                <div
                  style={{
                    textAlign: "center",
                    margin: "1.5rem 0 1rem",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.375rem 1rem",
                      background: "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)",
                      color: "#667eea",
                      borderRadius: "16px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                      letterSpacing: "0.025em",
                      textTransform: "uppercase",
                    }}
                  >
                    {formatDateLabel(dateKey)}
                  </span>
                </div>

                {/* MESSAGES */}
                {groupMessages.map((message) => (
                  <MessageItem
                    key={message._id}
                    message={message}
                    currentUserId={currentUserId}
                    isGroup={chat.isGroupChat}
                  />
                ))}
              </div>
            ))}
          </>
        )}

        {/* SCROLL ANCHOR */}
        <div ref={bottomRef} style={{ height: "1px" }} />
      </div>

      {/* SCROLL TO BOTTOM BUTTON */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          style={{
            position: "fixed",
            bottom: "5.5rem",
            right: "1.5rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "3rem",
            height: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
            transition: "all 0.3s ease",
            zIndex: 100,
            fontSize: "1.5rem",
            animation: "slideUp 0.3s ease-out",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.5)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          aria-label="Scroll to bottom"
        >
          <span style={{ transform: "rotate(90deg)", display: "block" }}>
            ➤
          </span>
        </button>
      )}
    </>
  );
};

export default MessageList;