import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import connectDB from "./config/db.js";
import socketHandler from "./config/socket.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ------------------------------
// CREATE SERVER & SOCKET.IO
// ------------------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// 🔥 CRITICAL FIX: attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ------------------------------
// ROUTES (AFTER req.io middleware)
// ------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/users", userRoutes);

// ------------------------------
// SOCKET HANDLER
// ------------------------------
socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
