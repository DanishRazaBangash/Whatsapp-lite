import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
// import chatRoutes from "./routes/chatRoutes.js";
// import messageRoutes from "./routes/messageRoutes.js";
import initSocket from "./socket.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // e.g. http://localhost:3000
    credentials: true, 
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/chats", chatRoutes);
// app.use("/api/messages", messageRoutes);

// Server + Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL, 
    credentials: true, 
    methods: ["GET", "POST"],
  },
});
app.set("io", io); // <-- Make io available in controllers


initSocket(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
