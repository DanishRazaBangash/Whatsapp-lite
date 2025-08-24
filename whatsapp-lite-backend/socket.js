import jwt from "jsonwebtoken";
import cookie from "cookie";
import User from "./models/User.js";

let onlineUsers = {}; // { userId: socketId }

const initSocket = (io) => {
  // ✅ Middleware: authenticate with JWT
  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const token = cookies.jwt;

      if (!token) return next(new Error("Authentication error: No token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("Authentication error: Invalid user"));

      socket.user = user;
      next();
    } catch (err) {
      console.error("Socket auth failed:", err.message);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    onlineUsers[userId] = socket.id;

    console.log(`✅ User connected: ${socket.user.username} (${userId})`);

    // 👉 Still join a personal room (optional for notifications)
    socket.join(userId);

    // ✅ Join a chat room
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`${socket.user.username} joined chat ${chatId}`);
    });

    // ✅ Leave a chat room
    socket.on("leaveChat", (chatId) => {
      socket.leave(chatId);
      console.log(`${socket.user.username} left chat ${chatId}`);
    });

    // ✅ Send message to a chat (1-1 or group)
    socket.on("sendMessage", (msg) => {
      // msg should include { chat: chatId, content, sender }
      if (!msg.chat) return;

      io.to(msg.chat).emit("newMessage", msg); // broadcast to chat room
    });

    // ✅ On disconnect
    socket.on("disconnect", () => {
      delete onlineUsers[userId];
      console.log(`❌ User disconnected: ${socket.user.username}`);
    });
  });
};

export default initSocket;
