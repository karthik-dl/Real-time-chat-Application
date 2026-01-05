import { useState, useRef, useEffect } from "react";
import { formatTime } from "../../utils/formatTime";
import api from "../../services/api";
import { useChatStore } from "../../store/chatStore";

const MessageItem = ({ message, currentUserId, isGroup }) => {
  const setReplyTo = useChatStore((s) => s.setReplyTo);
  const deleteMessageLocal = useChatStore((s) => s.deleteMessageLocal);
  
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);

  const senderId =
    typeof message.sender === "string"
      ? message.sender
      : message.sender?._id;

  const isOwn = senderId === currentUserId;

  // DELETE FOR ME - DON'T RENDER
  if (message.deletedFor?.includes(currentUserId)) return null;

  // ----------------------------
  // CLOSE DROPDOWN ON OUTSIDE CLICK
  // ----------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  // ----------------------------
  // WHATSAPP TICKS
  // ----------------------------
  const getTickStatus = () => {
    if (!isOwn) return null;

    if (message.seen) {
      return { ticks: "✓✓", color: "#53bdeb" };
    } else if (message.delivered) {
      return { ticks: "✓✓", color: "#9ca3af" };
    }
    return { ticks: "✓", color: "#9ca3af" };
  };

  const tickStatus = getTickStatus();

  // ----------------------------
  // DELETE HANDLER
  // ----------------------------
  const handleDelete = async (forEveryone) => {
    try {
      await api.delete(`/messages/${message._id}`, {
        data: { forEveryone },
      });

      // IMMEDIATE LOCAL UPDATE
      deleteMessageLocal(message._id, forEveryone, currentUserId);

      setShowMenu(false);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // ----------------------------
  // HANDLE REPLY
  // ----------------------------
  const handleReply = () => {
    setReplyTo(message);
    setShowMenu(false);
  };

  // ----------------------------
  // RENDER CONTENT
  // ----------------------------
  const renderContent = () => {
    switch (message.type) {
      case "image":
        return (
          <img
            src={message.content}
            alt="Shared image"
            style={{
              maxWidth: "100%",
              width: "220px",
              height: "auto",
              borderRadius: "0.625rem",
              marginTop: "0.25rem",
              display: "block",
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        );

      case "file":
        return (
          <a
            href={message.content}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              transition: "color 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#1d4ed8";
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "#2563eb";
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            📎 Download file
          </a>
        );

      default:
        return (
          <span
            style={{
              display: "inline-block",
              wordBreak: "break-word",
              lineHeight: 1.5,
            }}
          >
            {message.content}
          </span>
        );
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
        position: "relative",
        animation: "slideIn 0.2s ease-out",
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          background: isOwn
            ? "linear-gradient(135deg, #dcf8c6 0%, #d4f4c1 100%)"
            : "#ffffff",
          padding: "0.5rem 0.75rem",
          borderRadius: "0.625rem",
          borderBottomRightRadius: isOwn ? "0.25rem" : "0.625rem",
          borderBottomLeftRadius: isOwn ? "0.625rem" : "0.25rem",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
          border: isOwn ? "none" : "1px solid #e5e7eb",
          position: "relative",
          wordWrap: "break-word",
          transition: "box-shadow 0.2s ease",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.12)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.08)")
        }
      >
        {/* GROUP CHAT NAME */}
        {isGroup && !isOwn && (
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              marginBottom: "0.25rem",
              color: "#4f46e5",
              letterSpacing: "0.01em",
            }}
          >
            {message.sender?.name}
          </div>
        )}

        {/* REPLY PREVIEW */}
        {message.replyTo && (
          <div
            style={{
              fontSize: "0.8125rem",
              color: "#374151",
              padding: "0.5rem",
              marginBottom: "0.5rem",
              borderLeft: "3px solid #22c55e",
              background: "#f0fdf4",
              borderRadius: "0.375rem",
            }}
          >
            <div
              style={{
                fontSize: "0.6875rem",
                color: "#16a34a",
                fontWeight: 600,
                marginBottom: "0.125rem",
                textTransform: "uppercase",
                letterSpacing: "0.025em",
              }}
            >
              {message.replyTo.sender?.name}
            </div>
            <div
              style={{
                color: message.replyTo.isDeleted ? "#6b7280" : "#374151",
                fontStyle: message.replyTo.isDeleted ? "italic" : "normal",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {message.replyTo.isDeleted
                ? "Original message deleted"
                : message.replyTo.content}
            </div>
          </div>
        )}

        {/* MESSAGE BODY */}
        {message.isDeleted ? (
          <div
            style={{
              fontStyle: "italic",
              color: "#6b7280",
              fontSize: "0.875rem",
            }}
          >
            This message was deleted
          </div>
        ) : (
          <div style={{ color: "#111827" }}>{renderContent()}</div>
        )}

        {/* FOOTER - TIME + TICKS + MENU */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.6875rem",
            marginTop: "0.375rem",
          }}
        >
          {/* LEFT SIDE - TIME + TICKS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              color: "#9ca3af",
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>
              {formatTime(message.createdAt)}
            </span>

            {tickStatus && (
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: tickStatus.color,
                  whiteSpace: "nowrap",
                }}
              >
                {tickStatus.ticks}
              </span>
            )}
          </div>

          {/* RIGHT SIDE - MENU BUTTON */}
          {!message.isDeleted && (
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.125rem",
                  color: "#6b7280",
                  padding: "0.125rem 0.25rem",
                  borderRadius: "0.25rem",
                  transition: "all 0.2s ease",
                  transform: "rotate(90deg)",
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)";
                  e.currentTarget.style.color = "#374151";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#6b7280";
                }}
                aria-label="Message options"
              >
                ⋯
              </button>

              {/* DROPDOWN MENU */}
              {showMenu && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    right: isOwn ? "0" : "auto",
                    left: isOwn ? "auto" : "0",
                    marginBottom: "0.25rem",
                    background: "#ffffff",
                    borderRadius: "0.5rem",
                    boxShadow:
                      "0 10px 25px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                    zIndex: 1000,
                    overflow: "hidden",
                    minWidth: "180px",
                    animation: "dropdownSlideUp 0.15s ease-out",
                  }}
                >
                  {/* REPLY */}
                  <MenuItem onClick={handleReply}>
                    <span style={{ fontSize: "1.125rem" }}>↩️</span>
                    <span>Reply</span>
                  </MenuItem>

                  {/* DIVIDER */}
                  <div
                    style={{
                      height: "1px",
                      background: "#e5e7eb",
                      margin: "0 0.5rem",
                    }}
                  />

                  {/* DELETE FOR ME */}
                  <MenuItem onClick={() => handleDelete(false)}>
                    <span style={{ fontSize: "1.125rem" }}>🗑️</span>
                    <span>Delete for me</span>
                  </MenuItem>

                  {/* DELETE FOR EVERYONE (ONLY FOR OWN MESSAGES) */}
                  {isOwn && (
                    <>
                      <div
                        style={{
                          height: "1px",
                          background: "#e5e7eb",
                          margin: "0 0.5rem",
                        }}
                      />
                      <MenuItem danger onClick={() => handleDelete(true)}>
                        <span style={{ fontSize: "1.125rem" }}>🗑️</span>
                        <span>Delete for everyone</span>
                      </MenuItem>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* INLINE ANIMATION STYLES */}
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes dropdownSlideUp {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

// ----------------------------
// MENU ITEM COMPONENT
// ----------------------------
const MenuItem = ({ children, onClick, danger }) => {
  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div
      onClick={onClick}
      style={{
        padding: "0.75rem 1rem",
        cursor: "pointer",
        fontSize: "0.875rem",
        color: danger ? "#ef4444" : "#374151",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        transition: "background 0.15s ease",
        fontWeight: 500,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = danger ? "#fef2f2" : "#f3f4f6")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "transparent")
      }
    >
      {childArray}
    </div>
  );
};

export default MessageItem;