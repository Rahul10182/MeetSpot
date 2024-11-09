import { Friend } from "../models/friendModel.js";
import { User } from "../models/userModel.js"

// Create a friend request
export const createFriendRequest = async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        // Look up the user and friend by their emails to get their ObjectIds
        const user = await User.findOne({ email: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const friend = await User.findOne({ email: friendId });
        if (!friend) {
            return res.status(404).json({ message: "Friend not found" });
        }

        // Check if the friend relationship already exists
        const existingRequest = await Friend.findOne({
            user: user._id,    // Use ObjectId for the user
            friend: friend._id  // Use ObjectId for the friend
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already exists" });
        }

        // Create a new friend request using ObjectIds
        const newFriendRequest = new Friend({
            user: user._id,
            friend: friend._id,
            status: "pending"
        });

        // Update the friends array in the User model
        await User.findByIdAndUpdate(user._id, {
            $addToSet: { friends: friend._id }  // Adds friend to user's friends array if not already present
        });

        await User.findByIdAndUpdate(friend._id, {
            $addToSet: { friends: user._id }  // Adds user to friend's friends array if not already present
        });

        await newFriendRequest.save();
        res.status(201).json(newFriendRequest);
    } catch (error) {
        // Log error for debugging
        console.error('Error in createFriendRequest:', error.message);
        res.status(500).json({ error: error.message });
    }
};


// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        // Find the friend request document by its ID
        const friendRequest = await Friend.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        // Set the status of the friend request to 'accepted'
        friendRequest.status = "accepted";
        await friendRequest.save();

        // Create a reciprocal friend request if it does not already exist
        const reciprocalFriendshipExists = await Friend.findOne({
            user: friendRequest.friend,
            friend: friendRequest.user
        });

        if (!reciprocalFriendshipExists) {
            await Friend.create({
                user: friendRequest.friend,
                friend: friendRequest.user,
                status: "accepted"
            });
        }

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

// Updated getFriends controller

export const getFriends = async (req, res) => {
    try {
        const { firebaseId } = req.params;

        // Find the user by their firebaseId
        const user = await User.findOne({ fireBaseId: firebaseId });
        
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // // Fetch friends by the user's _id
        // const friends = await Friend.find({
        //     user: user._id,  // Use user._id from the found user document
        //     status: "accepted"
        // })
        // .populate("friend", "fullName email");  // Populate the friend's details

        const friends = await Friend.find({ user: user._id }).populate('friend', 'fullName email');
        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



