<<<<<<< HEAD
import express from "express";
import { getOrCreateChat, getChatsForUser, getChatById } from "../controllers/chatController.js";

const router = express.Router();

router.post("/get", getOrCreateChat);  // Create or get a chat between two users
router.get("/:firebaseId", getChatsForUser);  // Get all chats for a user
router.get("/:chatId", getChatById);  // Get chat by ID

export default router;
=======
import express from "express";
import { createChat, getOrCreateChat, getChatsForUser, getChatById, findChat } from "../controllers/chatController.js";

const router = express.Router();
router.post("/", createChat);  // Create a new chat between two users
router.post("/get", getOrCreateChat);  // Create or get a chat between two users
router.get("/:firebaseId", getChatsForUser);  // Get all chats for a user
router.get("/:chatId", getChatById);  // Get chat by ID
router.get("/find/:userfirebaseId/:friendfirebaseId", findChat);  // Get or create chat between two users

export default router;
>>>>>>> origin/anshul4
