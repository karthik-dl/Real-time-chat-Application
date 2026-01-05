import { create } from "zustand";
import { io } from "socket.io-client";

export const useSocketStore = create(() => {
  const socket = io("http://localhost:5000");
  return { socket };
});
