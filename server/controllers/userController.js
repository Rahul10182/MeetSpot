import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const authenticate = async (req, res) => {
    try {
        // console.log(req.body)
        const { firebaseID, email, fullName } = req.body;
        console.log(firebaseID, email, fullName)

        if (!firebaseID || !email || !fullName) {
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
        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(200)
            .cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
            .json({
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
        console.log(error);
        return res.status(500).json({
            message: 'Server Error',
            success: false
        });
    }
};

