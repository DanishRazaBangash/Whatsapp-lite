import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    isGroup: { type: Boolean, default: false },
    groupName: { type: String, default: "" },
    groupAvatar: { type: String, default: "" },

    // Members for 1-1 or group chats
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Last message shortcut for fast chat list rendering
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  { timestamps: true }
);

// Enforce at least 2 members
chatSchema.path("members").validate(function (v) {
  return Array.isArray(v) && v.length >= 2;
}, "A chat must have at least two members.");

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
