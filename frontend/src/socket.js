import { io } from "socket.io-client";

export const socket = io("https://real-time-chat-application-gamg.onrender.com", {
  withCredentials: true,
  autoConnect: true,
});
