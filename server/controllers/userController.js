import { User } from "../models/userModel.js";

export const authenticate = async (req, res) => {
    try {
        const { firebaseID, email, fullName } = req.body;

        if (!firebaseID || !email) {
            return res.status(400).json({
                message: 'firebaseID, email, and fullName are required.',
                success: false
            });
        }

        let user = await User.findOne({ fireBaseId: firebaseID });

        if (!user) {
            user = await User.create({
                fireBaseId: firebaseID,
                fullName,
                email
            });
        }

        return res.status(200).json({
            message: `Authenticated successfully as ${user.fullName}`,
            user: {
                id: user._id,
                fullName: user.fullName,
                fireBaseId: user.fireBaseId,
                email: user.email
            },
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server Error',
            success: false
        });
    }
};

// Controller to get user details using firebaseId
export const getUserFireBaseId = async (req, res) => {
    try {
        const { firebaseId } = req.body; // Get firebaseId from the request body

        // Find the user by firebaseId
        const user = await User.findOne({ fireBaseId:firebaseId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the user data
        res.status(200).json(user);
    } catch (error) {
        // Catch any errors and return a 500 status
        res.status(500).json({ error: error.message });
    }
};

//
export const getFireBaseId = async (req, res) => {
    try {
        const { selectedFriendId } = req.body; 

        // Find the user by firebaseId
        const user = await User.findOne({ _id: selectedFriendId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the user data
        res.status(200).json(user.fireBaseId);
    } catch (error) {
        // Catch any errors and return a 500 status
        res.status(500).json({ error: error.message });
    }
};

