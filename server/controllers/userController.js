import jwt from "jsonwebtoken";
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
