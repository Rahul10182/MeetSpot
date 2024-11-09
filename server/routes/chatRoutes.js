import express from "express";
import { getOrCreateChat, getChatsForUser, getChatById } from "../controllers/chatController.js";

const router = express.Router();

router.post("/get", getOrCreateChat);  // Create or get a chat between two users
router.get("/:firebaseId", getChatsForUser);  // Get all chats for a user
router.get("/:chatId", getChatById);  // Get chat by ID

export default router;
