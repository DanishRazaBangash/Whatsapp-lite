import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";

const router = Router();

// Get messages for a chat
router.get("/:chatId", protect, getMessages);

// Send message to a chat
router.post("/", protect, sendMessage);

export default router;
