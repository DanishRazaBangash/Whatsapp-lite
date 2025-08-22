import jwt from "jsonwebtoken";
import cookie from "cookie";
import User from "./models/User.js";

let onlineUsers = {}; // { userId: socketId }

const initSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      // Parse cookies from handshake
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const token = cookies.jwt;

      if (!token) {
        return next(new Error("Authentication error: No token"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return next(new Error("Authentication error: Invalid user"));
      }

      // Attach user to socket object
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

    // Join a personal room with userId equals room name
    socket.join(userId);

    // Listen for messages
    socket.on("sendMessage", ({ receiverId, text }) => {
      const receiverSocketId = onlineUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", {
          sender: {
            _id: userId,
            username: socket.user.username,
            profilePic: socket.user.profilePic,
          },
          text,
          timestamp: new Date(),
        });
      }
    });

    // On disconnect
    socket.on("disconnect", () => {
      delete onlineUsers[userId];
      console.log(`❌ User disconnected: ${socket.user.username}`);
    });
  });
};

export default initSocket;
