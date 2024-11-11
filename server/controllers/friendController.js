
import { User } from '../models/userModel.js'; 

export const showFriends = async (req, res) => {
    try {
        const { firebaseID } = req.body;

        const user = await User.findOne({
            fireBaseId: firebaseID
        }).populate('friends', 'fullName email fireBaseId');

        const friendsData = user.friends.map(friend => ({
            name: friend.fullName,
            email: friend.email,
            firebaseID: friend.fireBaseId 
        }));

        res.json(friendsData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const showFriendRequest = async (req, res) => {
    try {
        const { firebaseID } = req.body;

        const user = await User.findOne({
            fireBaseId : firebaseID
        }).populate('friendRequests', 'fullName email fireBaseId');

        const friendsData = user.friendRequests.map(friend => ({
            name: friend.fullName,
            email: friend.email,
            firebaseID: friend.fireBaseId
        }));
        
        res.json(friendsData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const sendFriendRequest = async (req, res) => {
    try {
        const { firebaseID1, firebaseID2 } = req.body;

        // Find both users based on their firebase IDs
        const user1 = await User.findOne({ fireBaseId: firebaseID1 });
        const user2 = await User.findOne({ fireBaseId: firebaseID2 });

        if (!user1 || !user2) {
            return res.status(404).json({ message: "One or both users not found." });
        }

        // Check if the request has already been sent
        const requestAlreadySent = user2.friendRequests.some(
            (friendRequest) => friendRequest.toString() === user1._id.toString()
        );
        if (requestAlreadySent) {
            return res.status(400).json({ message: "Friend request already sent." });
        }

        // Check if there is a pending request that should be accepted
        const requestPending = user1.friendRequests.some(
            (friendRequest) => friendRequest.toString() === user2._id.toString()
        );
        
        if (requestPending) {
            // Accept the friend request by adding each other as friends
            user1.friends.push(user2._id);
            user2.friends.push(user1._id);

            // Remove pending friend requests for both users
            user1.friendRequests = user1.friendRequests.filter(
                (friendRequest) => friendRequest.toString() !== user2._id.toString()
            );
            user2.friendRequests = user2.friendRequests.filter(
                (friendRequest) => friendRequest.toString() !== user1._id.toString()
            );

            await user1.save();
            await user2.save();

            return res.status(200).json({ message: "Friend request accepted." });
        }

        // Send friend request by updating `sentFriendRequests` and `friendRequests`
        user1.sentFriendRequests.push(user2._id);
        user2.friendRequests.push(user1._id);

        await user1.save();
        await user2.save();

        return res.status(201).json({ message: "Friend request sent." });
    } catch (error) {
        console.error('Error in sendFriendRequest:', error);
        res.status(500).json({ error: error.message });
    }
};


export const sentFrienReqest = async (req, res) => {
    try {
        const { firebaseID } = req.body;

        const user = await User.findOne({
            fireBaseId: firebaseID
        }).populate('sentFriendRequests', 'fullName email fireBaseId');

        const friendsData = user.sentFriendRequests.map(friend => ({
            name: friend.fullName,
            email: friend.email,
            firebaseID: friend.fireBaseId
        }));

        res.json(friendsData);
    } catch (error) {
        console.error('Error in sentFrienReqest:', error.message);
        res.status(500).json({ error: error.message });
    }
};

export const acceptFriendRequest = async (req, res) => {
    try {
        const { firebaseID1, firebaseID2 } = req.body;

        if (firebaseID1 === firebaseID2) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself." });
        }

        const user1 = await User.findOne({ fireBaseId: firebaseID1 });
        const user2 = await User.findOne({ fireBaseId: firebaseID2 });

        if (!user1 || !user2) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if they are already friends
        if (user1.friends.includes(user2._id) || user2.friends.includes(user1._id)) {
            return res.status(400).json({ message: "Already friends." });
        }

        // Add each other to friends list if not already there
        user1.friends.push(user2._id);
        user2.friends.push(user1._id);

        // Remove friend requests
        user2.friendRequests = user2.friendRequests.filter(id => !id.equals(user1._id));
        user2.sentFriendRequests = user2.sentFriendRequests.filter(id => !id.equals(user1._id));
        user1.friendRequests = user1.friendRequests.filter(id => !id.equals(user2._id));
        user1.sentFriendRequests = user1.sentFriendRequests.filter(id => !id.equals(user2._id));

        await user1.save();
        await user2.save();

        res.status(200).json({ message: "Friend request accepted." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const rejectFriendRequest = async (req, res) => {
    try {
        const { firebaseID1, firebaseID2 } = req.body;

        const user1 = await User.findOne({ fireBaseId: firebaseID1 });
        const user2 = await User.findOne({ fireBaseId: firebaseID2 });

        if (!user1 || !user2) {
            return res.status(404).json({ message: "User not found." });
        }

        user1.friendRequests = user1.friendRequests.filter(id => !id.equals(user2._id));

        user2.sentFriendRequests = user2.sentFriendRequests.filter(id => !id.equals(user1._id));

        await user1.save();
        await user2.save();

        res.status(200).json({ message: "Friend request rejected." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteFriend = async (req, res) => {
    try {
        const { firebaseID1, firebaseID2 } = req.body;

        const user1 = await User.findOne({ fireBaseId: firebaseID1 });
        const user2 = await User.findOne({ fireBaseId: firebaseID2 });

        if (!user1 || !user2) {
            return res.status(404).json({ message: "User not found." });
        }

        const isFriendInUser1 = user1.friends.includes(user2._id);
        const isFriendInUser2 = user2.friends.includes(user1._id);

        if (isFriendInUser1 && isFriendInUser2) {
            user1.friends = user1.friends.filter(id => !id.equals(user2._id));

            user2.friends = user2.friends.filter(id => !id.equals(user1._id));

            await user1.save();
            await user2.save();

            res.status(200).json({ message: "Friend deleted successfully." });
        } else {
            res.status(400).json({ message: "Users are not friends." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



