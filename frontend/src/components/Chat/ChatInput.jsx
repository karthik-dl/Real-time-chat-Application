import { useState, useRef } from "react";
import api from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";

const ChatInput = ({ chatId, socket }) => {
  const { user } = useAuthStore();

  // SAFE ZUSTAND SELECTORS
  const addMessage = useChatStore((s) => s.addMessage);
  const replyTo = useChatStore((s) => s.replyTo);
  const clearReply = useChatStore((s) => s.clearReply);

  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const typingTimeoutRef = useRef(null);

  // ----------------------------
  // TYPING INDICATOR
  // ----------------------------
  const handleTyping = () => {
    socket.emit("typing", {
      chatId,
      userId: user._id,
    });

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", {
        chatId,
        userId: user._id,
      });
    }, 1000);
  };

  // ----------------------------
  // SEND TEXT (OPTIMISTIC + REPLY)
  // ----------------------------
  const sendText = async () => {
    if (!text.trim()) return;

    const tempMessage = {
      _id: Date.now().toString(),
      chat: chatId,
      sender: user,
      content: text,
      replyTo: replyTo || null,
      isTemp: true,
      createdAt: new Date(),
    };

    // Optimistic UI
    addMessage(tempMessage);

    setText("");
    clearReply();

    try {
      await api.post("/messages", {
        chatId,
        content: tempMessage.content,
        replyTo: replyTo?._id || null,
      });
    } catch (err) {
      console.error("Send text failed", err);
      alert("Message send failed");
    }
  };

  // ----------------------------
  // SEND IMAGE
  // ----------------------------
  const sendImage = async (file) => {
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("chatId", chatId);

      await api.post("/messages/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ----------------------------
  // SEND FILE
  // ----------------------------
  const sendFile = async (file) => {
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("chatId", chatId);
      formData.append("type", "file");

      await api.post("/messages/file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      console.error("File upload failed", err);
      alert("File upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        borderTop: "1px solid #e5e7eb",
        background: "#ffffff",
        boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.04)",
        position: "relative",
      }}
    >
      {/* REPLY PREVIEW */}
      {replyTo && (
        <div
          style={{
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
            borderLeft: "4px solid #22c55e",
            padding: "0.75rem 1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            fontSize: "0.875rem",
            animation: "slideDown 0.2s ease-out",
            gap: "1rem",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                color: "#16a34a",
                fontWeight: 600,
                marginBottom: "0.25rem",
                textTransform: "uppercase",
                letterSpacing: "0.025em",
              }}
            >
              Replying to {replyTo.sender?.name}
            </div>
            <div
              style={{
                color: replyTo.isDeleted ? "#6b7280" : "#111827",
                fontStyle: replyTo.isDeleted ? "italic" : "normal",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {replyTo.isDeleted
                ? "Original message deleted"
                : replyTo.content}
            </div>
          </div>

          <button
            type="button"
            onClick={() => clearReply()}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "1.25rem",
              color: "#6b7280",
              padding: "0.25rem",
              borderRadius: "0.375rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "2rem",
              height: "2rem",
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.color = "#374151";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#6b7280";
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.9)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            aria-label="Clear reply"
          >
            ✕
          </button>
        </div>
      )}

      {/* INPUT ROW */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          padding: "1rem 1rem 1.25rem",
          alignItems: "center",
        }}
      >
        {/* IMAGE UPLOAD */}
        <label
          style={{
            cursor: uploading ? "not-allowed" : "pointer",
            fontSize: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "50%",
            transition: "all 0.2s ease",
            opacity: uploading ? 0.5 : 1,
          }}
          onMouseOver={(e) => {
            if (!uploading) {
              e.currentTarget.style.background = "rgba(79, 70, 229, 0.1)";
              e.currentTarget.style.transform = "scale(1.1)";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <input
            type="file"
            hidden
            accept="image/*"
            disabled={uploading}
            onChange={(e) => sendImage(e.target.files[0])}
          />
          <span style={{ filter: uploading ? "grayscale(1)" : "none" }}>
            🖼️
          </span>
        </label>

        {/* FILE UPLOAD */}
        <label
          style={{
            cursor: uploading ? "not-allowed" : "pointer",
            fontSize: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "50%",
            transition: "all 0.2s ease",
            opacity: uploading ? 0.5 : 1,
          }}
          onMouseOver={(e) => {
            if (!uploading) {
              e.currentTarget.style.background = "rgba(79, 70, 229, 0.1)";
              e.currentTarget.style.transform = "scale(1.1)";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <input
            type="file"
            hidden
            disabled={uploading}
            onChange={(e) => sendFile(e.target.files[0])}
          />
          <span style={{ filter: uploading ? "grayscale(1)" : "none" }}>
            📎
          </span>
        </label>

        {/* TEXT INPUT */}
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          disabled={uploading}
          style={{
            flex: 1,
            padding: "0.875rem 1.25rem",
            borderRadius: "24px",
            border: isFocused ? "2px solid #667eea" : "2px solid #e5e7eb",
            outline: "none",
            fontSize: "0.9375rem",
            background: "#f9fafb",
            transition: "all 0.2s ease",
            boxShadow: isFocused
              ? "0 0 0 3px rgba(102, 126, 234, 0.1)"
              : "none",
            opacity: uploading ? 0.6 : 1,
            cursor: uploading ? "not-allowed" : "text",
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendText();
            }
          }}
        />

        {/* SEND BUTTON */}
        <button
          onClick={sendText}
          disabled={!text.trim() || uploading}
          style={{
            border: "none",
            background:
              text.trim() && !uploading
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "#e5e7eb",
            cursor: text.trim() && !uploading ? "pointer" : "not-allowed",
            fontSize: "1.25rem",
            width: "3rem",
            height: "3rem",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            boxShadow:
              text.trim() && !uploading
                ? "0 4px 12px rgba(102, 126, 234, 0.3)"
                : "none",
            opacity: !text.trim() || uploading ? 0.5 : 1,
          }}
          onMouseOver={(e) => {
            if (text.trim() && !uploading) {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(102, 126, 234, 0.4)";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = text.trim()
              ? "0 4px 12px rgba(102, 126, 234, 0.3)"
              : "none";
          }}
          onMouseDown={(e) => {
            if (text.trim() && !uploading) {
              e.currentTarget.style.transform = "scale(0.95)";
            }
          }}
          onMouseUp={(e) => {
            if (text.trim() && !uploading) {
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          aria-label="Send message"
        >
          <span style={{ transform: "rotate(-45deg)", display: "block" }}>
            ✈️
          </span>
        </button>
      </div>

      {/* UPLOADING INDICATOR */}
      {uploading && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0, 0, 0, 0.8)",
            color: "#ffffff",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            marginBottom: "0.5rem",
            animation: "fadeIn 0.2s ease-out",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              width: "1rem",
              height: "1rem",
              border: "2px solid #ffffff",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.6s linear infinite",
            }}
          />
          Uploading...
        </div>
      )}

      {/* INLINE ANIMATION STYLES */}
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
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ChatInput;