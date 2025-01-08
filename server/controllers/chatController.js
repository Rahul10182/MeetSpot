import Chat  from "../models/chatModel.js";
import { User } from "../models/userModel.js";

// Create or retrieve an existing chat between two users
export const getOrCreateChat = async (req, res) => {
  const { userfirebaseId, friendfirebaseId } = req.body;

  try {
    const user = await User.findOne({ fireBaseId: userfirebaseId });
    const friend = await User.findOne({ fireBaseId: friendfirebaseId });

    if (!user || !friend) {
      return res.status(404).json({ error: "One or both users not found." });
    }

    const userId = user._id;
    const friendId = friend._id;

    let chat = await Chat.findOne({
      participants: { $all: [userId, friendId] }
    })
    .populate('participants', '_id name')
    .populate('lastMessage');

    if (!chat) {
      chat = new Chat({ participants: [userId, friendId] });
      await chat.save();
      chat = await chat.populate('participants', '_id name');
    }

    return res.status(200).json(chat);
  } catch (error) {
    return res.status(500).json({ error: "Failed to get or create chat." });
  }
};

// Create a new chat between two users
export const createChat = async (req, res) => {
  const { userfirebaseId, friendfirebaseId } = req.body;

  try {
    const user = await User.findOne({ fireBaseId: userfirebaseId });
    const friend = await User.findOne({ fireBaseId: friendfirebaseId });

    if (!user || !friend) {
      return res.status(404).json({ error: "One or both users not found." });
    }

    const userId = user._id;
    const friendId = friend._id;

    // Check if the chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [userId, friendId], $size: 2 },
      type: "single",
    });

    if (!chat) {
      // Create a new chat if not found
      chat = new Chat({ participants: [userId, friendId], type: "single" });
      await chat.save();
    }

    chat = await chat.populate("participants", "_id name");

    return res.status(201).json(chat);
  } catch (error) {
    console.error("Error in createChat:", error);
    return res.status(500).json({ error: "Failed to create chat." });
  }
};

// Find a chat between two users
export const findChat = async (req, res) => {
  const { userfirebaseId, friendfirebaseId } = req.params;

  try {
    const user = await User.findOne({ fireBaseId: userfirebaseId });
    const friend = await User.findOne({ fireBaseId: friendfirebaseId });

    if (!user || !friend) {
      return res.status(404).json({ error: "One or both users not found." });
    }

    const userId = user._id;
    const friendId = friend._id;

    const chat = await Chat.findOne({
      participants: { $all: [userId, friendId], $size: 2 },
      type: "single",
    }).populate("participants", "_id name");

    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    return res.status(200).json(chat);
  } catch (error) {
    console.error("Error in findChat:", error);
    return res.status(500).json({ error: "Failed to find chat." });
  }
};

// Get all chats for a specific user
export const getChatsForUser = async (req, res) => {
  const { firebaseId } = req.params;

  try {
    const user = await User.findOne({ fireBaseId: firebaseId });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const chats = await Chat.find({ participants: user._id })
      .populate("participants", "_id name")
      .lean(); // Use `.lean()` for lightweight response and faster performance

    // // Optionally, fetch the last message dynamically for each chat
    // for (const chat of chats) {
    //   const lastMessage = await Message.findOne({ chat: chat._id })
    //     .sort({ createdAt: -1 })
    //     .populate("sender", "_id name")
    //     .lean();
    //   chat.lastMessage = lastMessage; // Add the lastMessage dynamically
    // }

    return res.status(200).json(chats);
  } catch (error) {
    console.error("Error in getChatsForUser:", error);
    return res.status(500).json({ error: "Failed to retrieve chats." });
  }
};

// Get a specific chat by chat ID
export const getChatById = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId)
      .populate("participants", "_id name")
      .lean();

    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    // Fetch the last message dynamically if needed
    const lastMessage = await Message.findOne({ chat: chat._id })
      .sort({ createdAt: -1 })
      .populate("sender", "_id name")
      .lean();
    chat.lastMessage = lastMessage; // Add the lastMessage dynamically

    return res.status(200).json(chat);
  } catch (error) {
    console.error("Error in getChatById:", error);
    return res.status(500).json({ error: "Failed to retrieve chat." });
  }
};
