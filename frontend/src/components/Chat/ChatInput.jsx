
// import { useState } from "react";
// import { useAuthStore } from "../../store/authStore";
// import { useChatStore } from "../../store/chatStore";

// const ChatInput = ({ chatId, socket }) => {
//   const { user } = useAuthStore();
//   const { addMessage } = useChatStore();

//   const [text, setText] = useState("");

//   const handleSend = () => {
//     if (!text.trim()) return;

//     const message = {
//       _id: Date.now().toString(), // temp ID
//       chat: chatId,
//       sender: user._id,
//       content: text,
//       createdAt: new Date().toISOString(),
//     };
      
//   console.log("📤 Sending message:", message);
//     // ✅ Show immediately (optimistic UI)
//     addMessage(message);

//     // ✅ Send to server
//     socket.emit("send-message", message);

//     setText("");
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div
//       style={{
//         padding: "0.75rem",
//         borderTop: "1px solid #e5e7eb",
//         backgroundColor: "#ffffff",
//         display: "flex",
//         gap: "0.5rem",
//         alignItems: "center",
//       }}
//     >
//       <textarea
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder="Type a message"
//         rows={1}
//         style={{
//           flex: 1,
//           resize: "none",
//           borderRadius: "0.5rem",
//           border: "1px solid #d1d5db",
//           padding: "0.5rem 0.75rem",
//           outline: "none",
//         }}
//       />

//       <button
//         onClick={handleSend}
//         style={{
//           backgroundColor: "#3b82f6",
//           color: "#ffffff",
//           border: "none",
//           borderRadius: "0.5rem",
//           padding: "0.5rem 1rem",
//           cursor: "pointer",
//         }}
//       >
//         Send
//       </button>
//     </div>
//   );
// };

// export default ChatInput;


// ..................................................................................................

import { useState } from "react";
import api from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";

const ChatInput = ({ chatId, socket }) => {
  const { user } = useAuthStore();
  const { addMessage } = useChatStore();

  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // ----------------------------
  // SEND TEXT (OPTIMISTIC)
  // ----------------------------
  const sendText = async () => {
    if (!text.trim()) return;

    // ✅ 1. OPTIMISTIC MESSAGE (INSTANT UI)
    const tempMessage = {
      _id: Date.now().toString(),
      chat: chatId,
      sender: user,
      content: text,
      createdAt: new Date(),
      delivered: false,
      seen: false,
    };

    addMessage(tempMessage);
    setText("");

    try {
      // ✅ 2. SAVE TO DB
      const res = await api.post("/messages", {
        chatId,
        content: tempMessage.content,
      });

      // ✅ 3. EMIT REAL MESSAGE
      socket.emit("send-message", res.data);
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

      const res = await api.post("/messages/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      socket.emit("send-message", res.data);
    } catch (err) {
      console.error("Image upload failed", err.response?.data || err);
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

      const res = await api.post("/messages/file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      socket.emit("send-message", res.data);
    } catch (err) {
      console.error("File upload failed", err.response?.data || err);
      alert("File upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.75rem", padding: "1rem", borderTop: "1px solid #e5e7eb" }}>
      {/* IMAGE */}
      <label>
        <input
          type="file"
          hidden
          accept="image/*"
          disabled={uploading}
          onChange={(e) => sendImage(e.target.files[0])}
        />
        🖼️
      </label>

      {/* FILE */}
      <label>
        <input
          type="file"
          hidden
          disabled={uploading}
          onChange={(e) => sendFile(e.target.files[0])}
        />
        📎
      </label>

      {/* TEXT INPUT */}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: "0.75rem 1rem",
          borderRadius: "20px",
          border: isFocused ? "2px solid #667eea" : "2px solid #e5e7eb",
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

      {/* SEND */}
      <button onClick={sendText} disabled={!text.trim()}>
        ✈️
      </button>
    </div>
  );
};

export default ChatInput;
