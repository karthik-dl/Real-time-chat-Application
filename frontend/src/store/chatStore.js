// import { create } from "zustand";
// import api from "../services/api";

// export const useChatStore = create((set, get) => ({
//   // -----------------------------
//   // STATE
//   // -----------------------------
//   chats: [],
//   selectedChat: null,
//   messages: [],
//   users: [],
//   onlineUsers: [],

//   // -----------------------------
//   // BASIC SETTERS
//   // -----------------------------
//   setUsers: (users) => set({ users }),
//   setOnlineUsers: (users) => set({ onlineUsers: users }),

//   // -----------------------------
//   // FETCH USERS
//   // -----------------------------
//   fetchUsers: async () => {
//     const res = await api.get("/users");
//     set({ users: res.data });
//   },

//   // -----------------------------
//   // FETCH CHATS
//   // -----------------------------
//   fetchChats: async () => {
//     const res = await api.get("/chats");
//     set({ chats: res.data });
//   },

//   // -----------------------------
//   // CREATE CHAT
//   // -----------------------------
//   createChat: async (userId) => {
//     const res = await api.post("/chats", { userId });

//     set((state) => ({
//       chats: [res.data, ...state.chats],
//       selectedChat: res.data,
//       messages: [], // fresh chat
//     }));
//   },

//   // -----------------------------
//   // SELECT CHAT (SAFE)
//   // -----------------------------
//   selectChat: async (chat) => {
//     if (!chat?._id) return;

//     const { selectedChat } = get();

//     // If switching to a DIFFERENT chat, fetch messages
//     if (selectedChat?._id !== chat._id) {
//       const res = await api.get(`/messages/${chat._id}`);

//       set({
//         selectedChat: chat,
//         messages: res.data,
//       });

//       await api.put(`/messages/read/${chat._id}`);
//     } else {
//       // Same chat → just update selectedChat reference
//       set({ selectedChat: chat });
//     }
//   },

//   // -----------------------------
//   // ADD MESSAGE (OPTIMISTIC + SOCKET)
//   // -----------------------------
//   addMessage: (message) =>
//     set((state) => {
//       // Prevent duplicates
//       if (state.messages.some((m) => m._id === message._id)) {
//         return state;
//       }

//       return {
//         messages: [...state.messages, message],
//       };
//     }),
// }));
// ............................................................................................../////




import { create } from "zustand";
import api from "../services/api";

export const useChatStore = create((set, get) => ({
  // -------------------------
  // STATE
  // -------------------------
  chats: [],
  selectedChat: null,
  messages: [],
  users: [],
  onlineUsers: [],

  // 🔹 TYPING INDICATOR STATE
  typingUser: null,

  // -------------------------
  // FETCH USERS
  // -------------------------
  fetchUsers: async () => {
    const res = await api.get("/users");
    set({ users: res.data });
  },

  // -------------------------
  // FETCH CHATS
  // -------------------------
  fetchChats: async () => {
    const res = await api.get("/chats");
    set({ chats: res.data });
  },

  // -------------------------
  // SELECT CHAT
  // -------------------------
  selectChat: async (chat) => {
    if (!chat?._id) return;

    const res = await api.get(`/messages/${chat._id}`);

    set({
      selectedChat: chat,
      messages: res.data,

      // reset unread count
      chats: get().chats.map((c) =>
        c._id === chat._id
          ? { ...c, unreadCount: 0 }
          : c
      ),
    });
  },

  // -------------------------
  // ADD MESSAGE (REAL-TIME)
  // -------------------------
  addMessage: (message) =>
    set((state) => {
      const chatId =
        typeof message.chat === "object"
          ? message.chat._id
          : message.chat;

      return {
        // add message only if chat is open
        messages:
          state.selectedChat?._id === chatId
            ? [...state.messages, message]
            : state.messages,

        // update unread count + last message
        chats: state.chats.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                lastMessage: message,
                unreadCount:
                  state.selectedChat?._id === chatId
                    ? 0
                    : (chat.unreadCount || 0) + 1,
              }
            : chat
        ),
      };
    }),

  // -------------------------
  // MESSAGE DELIVERY ✓
  // -------------------------
  markDelivered: ({ messageId, deliveredAt }) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m._id === messageId
          ? { ...m, delivered: true, deliveredAt }
          : m
      ),
    })),

  // -------------------------
  // MESSAGE SEEN ✓✓
  // -------------------------
  markSeen: ({ messageId, seenAt }) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m._id === messageId
          ? { ...m, seen: true, seenAt }
          : m
      ),
    })),

  // -------------------------
  // ONLINE USERS
  // -------------------------
  setOnlineUsers: (users) => set({ onlineUsers: users }),

  // -------------------------
  // TYPING INDICATOR ACTIONS
  // -------------------------
  setTypingUser: (userId) => set({ typingUser: userId }),
  clearTypingUser: () => set({ typingUser: null }),
}));
