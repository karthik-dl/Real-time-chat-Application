import { create } from "zustand";
import api from "../services/api";

export const useAuthStore = create((set) => ({
  user: null,

  login: async (data) => {
    const res = await api.post("/auth/login", data);
    localStorage.setItem("token", res.data.token);
    set({ user: res.data });
  },

  signup: async (data) => {
    const res = await api.post("/auth/signup", data);
    localStorage.setItem("token", res.data.token);
    set({ user: res.data });
  },

  loadUser: async () => {
    try {
      const res = await api.get("/users/me");
      set({ user: res.data });
    } catch {
      set({ user: null });
    }
  },

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));
