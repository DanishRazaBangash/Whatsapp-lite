let users = {};

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 New user connected:", socket.id);

    // Save user online
    socket.on("join", (userId) => {
      users[userId] = socket.id;
      console.log("✅ User joined:", userId);
    });

    // Handle sending message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const receiverSocket = users[receiverId];
      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", { senderId, text });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          break;
        }
      }
    });
  });
};

export default initSocket;
