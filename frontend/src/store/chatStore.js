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
  replyTo: null,
    // 🔹 TYPING INDICATOR STATE
  typingUser: null,

  // -------------------------
  // SET MESSAGES
  // -------------------------

  setMessages: (messages) => set({ messages }),
  // -------------------------
  // SET REPLY TO
  // -------------------------
  setReplyTo: (message) => set({ replyTo: message }),
  clearReply: () => set({ replyTo: null }),



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
  // ADD CHAT
  // -------------------------
   addChat: (chat) =>
  set((state) => ({
    chats: state.chats.some((c) => c._id === chat._id)
      ? state.chats
      : [chat, ...state.chats],
  })),

selectChat: (chat) => set({ selectedChat: chat }),
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

    // 🔥 REMOVE TEMP MESSAGE WHEN REAL MESSAGE ARRIVES
    const messagesWithoutTemp = message.isTemp
      ? state.messages
      : state.messages.filter((m) => !m.isTemp);

    // 🔒 PREVENT DUPLICATES (same _id)
    if (messagesWithoutTemp.some((m) => m._id === message._id)) {
      return state;
    }

    return {
      messages:
        state.selectedChat?._id === chatId
          ? [...messagesWithoutTemp, message]
          : state.messages,

      chats: state.chats.map((chat) =>
        chat._id === chatId
          ? { ...chat, lastMessage: message }
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


  deleteMessageLocal: (messageId, forEveryone, userId) =>
  set((state) => ({
    messages: state.messages.map((m) => {
      if (m._id !== messageId) return m;

      // DELETE FOR EVERYONE
      if (forEveryone) {
        return {
          ...m,
          isDeleted: true,
          content: "",
        };
      }

      // DELETE FOR ME
      return {
        ...m,
        deletedFor: [...(m.deletedFor || []), userId],
      };
    }),
  })),
}));