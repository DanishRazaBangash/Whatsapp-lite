// src/controllers/messageController.js
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

export const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // Build new message
    let message = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    // Populate sender + chat + users
    message = await message.populate("sender", "username profilePic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username profilePic email",
    });

    // Update chat latestMessage
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    // ✅ Emit to socket room (chatId)
    req.io.to(chatId).emit("newMessage", message);

    return res.json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username profilePic email")
      .populate("chat");

    res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
