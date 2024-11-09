import express from "express";
import { sendMessage, getMessagesByChatId , markMessageAsRead} from "../controllers/messageController.js";

const router = express.Router();


router.post("/send", sendMessage);  // Send a message in a chat
router.get("/:chatId", getMessagesByChatId);  // Get all messages for a specific chat
router.post("/read", markMessageAsRead);

export default router;