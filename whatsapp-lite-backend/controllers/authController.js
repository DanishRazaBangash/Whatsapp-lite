import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Helper to send token in cookie
const sendTokenResponse = (user, res) => {
  const token = generateToken(user._id);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // use secure flag in prod
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.json({
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      status: user.status,
      createdAt: user.createdAt,
    },
  });
};

export const register = async (req, res) => {
  try {
    const { username, email, password, profilePic } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Email or username already in use" });
    }

    const user = await User.create({ username, email, password, profilePic });
    return sendTokenResponse(user, res);
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
const emailOrUsername = email || username;

if (!emailOrUsername || !password) {
  return res.status(400).json({ message: "All fields are required" });
}


    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    }).select("+password");

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    return sendTokenResponse(user, res);
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const me = async (req, res) => {
  return res.json({ user: req.user });
};

// Logout = clear cookie
export const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.json({ message: "Logged out" });
};
