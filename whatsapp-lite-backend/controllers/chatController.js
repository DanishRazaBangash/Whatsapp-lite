import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

// Create or get 1-1 chat between current user and target userId
export const accessOneToOneChat = async (req, res) => {
  try {
    const me = req.user._id;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    // Find existing chat (1-1)
    let chat = await Chat.findOne({
      isGroup: false,
      members: { $all: [me, userId], $size: 2 },
    })
      .populate("members", "_id username profilePic status")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "_id username profilePic" },
      });

    if (!chat) {
      chat = await Chat.create({
        isGroup: false,
        members: [me, userId],
      });

      chat = await chat
        .populate("members", "_id username profilePic status")
        .execPopulate?.(); // Mongoose v5 compat

      if (!chat.members) {
        chat = await Chat.findById(chat._id).populate(
          "members",
          "_id username profilePic status"
        );
      }
    }

    return res.json({ chat });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all chats where current user is a member
export const getMyChats = async (req, res) => {
  try {
    const me = req.user._id;

    const chats = await Chat.find({ members: me })
      .sort({ updatedAt: -1 })
      .populate("members", "_id username profilePic status")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "_id username profilePic" },
      });

    return res.json({ chats });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};
