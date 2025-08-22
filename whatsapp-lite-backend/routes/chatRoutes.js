import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { accessOneToOneChat, getMyChats } from "../controllers/chatController.js";

const router = Router();

// Create/get 1-1 chat with a user
router.post("/access", protect, accessOneToOneChat);

// Get my chats
router.get("/", protect, getMyChats);

export default router;
