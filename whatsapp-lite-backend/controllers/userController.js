// src/controllers/userController.js
import User from "../models/User.js";

export const searchUsers = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);

    const regex = new RegExp(q, "i");
    const users = await User.find({
      _id: { $ne: req.user._id },            // exclude self
      $or: [{ username: regex }, { email: regex }],
    })
      .select("_id username email profilePic")
      .limit(10);

    return res.json(users);
  } catch (err) {
    console.error("searchUsers error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
