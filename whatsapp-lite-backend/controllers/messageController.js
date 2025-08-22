import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

// Get all messages in a chat
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Ensure user is a member of this chat
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    if (!chat.members.some((m) => m.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: 1 })
      .populate("sender", "_id username profilePic")
      .lean();

    return res.json({ messages });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Send message (persist + notify)
export const sendMessage = async (req, res) => {
  try {
    const { chatId, content, type = "text" } = req.body;
    const senderId = req.user._id;

    if (!chatId || !content)
      return res.status(400).json({ message: "chatId and content are required" });

    const chat = await Chat.findById(chatId).populate(
      "members",
      "_id username profilePic"
    );
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    if (!chat.members.some((m) => m._id.toString() === senderId.toString())) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const message = await Message.create({
      chat: chatId,
      sender: senderId,
      content,
      type,
    });

    // Update lastMessage for chat list speed
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    const populatedMsg = await Message.findById(message._id)
      .populate("sender", "_id username profilePic")
      .lean();

    // OPTIONAL: Realtime notify via Socket.io (rooms per userId)
    const io = req.app.get("io"); // set in server.js
    if (io) {
      // Notify every member in this chat (except the sender)
      chat.members.forEach((m) => {
        const uid = m._id ? m._id.toString() : m.toString();
        if (uid !== senderId.toString()) {
          // `uid` room is joined by sockets in socket.js
          io.to(uid).emit("newMessage", {
            chatId,
            message: populatedMsg,
          });
        }
      });
    }

    return res.status(201).json({ message: populatedMsg });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};
