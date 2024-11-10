import { Message } from "../models/messageModel.js";
import { Chat } from "../models/chatModel.js";
import { User } from "../models/userModel.js"; 

// Send a message in a chat
export const sendMessage = async (req, res) => {
  const { chatId, senderEmail, content } = req.body;  // Use senderEmail instead of senderId

  try {
    // Find the sender by their email
    const sender = await User.findOne({ email: senderEmail });

    if (!sender) {
      return res.status(404).json({ error: "Sender not found." });
    }

    const senderId = sender._id;

    // Verify the chat exists
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    // Create a new message
    const message = new Message({
      chat: chatId,
      sender: senderId,
      content: content,
    });

    // Save the message
    await message.save();

    // Update the chat's last message
    chat.lastMessage = message._id;
    await chat.save();

    // Populate the sender details for immediate response
    const populatedMessage = await message.populate('sender', '_id name');

    return res.status(201).json(populatedMessage);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to send message." });
  }
};

// Get all messages in a chat
export const getMessagesByChatId = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId })
      .populate('sender', '_id name'); // Populate sender details

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve messages." });
  }
};

// Mark message as read by a user
export const markMessageAsRead = async (req, res) => {
  const { messageId, userId } = req.body;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found." });
    }

    // Add the user to the readBy array if they haven't read it yet
    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId);
      await message.save();
    }

    return res.status(200).json({ message: "Message marked as read." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to mark message as read." });
  }
};
