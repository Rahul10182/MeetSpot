import { Friend } from "../models/friendModel.js";

// Create a friend request
export const createFriendRequest = async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        // Check if the friend relationship already exists
        const existingRequest = await Friend.findOne({
            user: userId,
            friend: friendId
        });
        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already exists" });
        }

        // Create a new friend request
        const newFriendRequest = new Friend({
            user: userId,
            friend: friendId,
            status: "pending"
        });

        await newFriendRequest.save();
        res.status(201).json(newFriendRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const friendRequest = await Friend.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        res.status(200).json({ message: "Friend request accepted", friendRequest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Block a friend
export const blockFriend = async (req, res) => {
    try {
        const { requestId } = req.params;

        const friendRequest = await Friend.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        friendRequest.status = "blocked";
        await friendRequest.save();

        res.status(200).json({ message: "Friend blocked", friendRequest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all friend relationships for a user
export const getFriends = async (req, res) => {
    try {
        const { userId } = req.params;

        const friends = await Friend.find({
            user: userId,
            status: "accepted"
        }).populate("friend", "name email");

        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
