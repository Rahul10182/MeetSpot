import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import {Location} from "../models/locationModel.js";


// User Registration
export const register = async (req, res) => {
    try {
        const { fullName, fireBaseId } = req.body;

        if (!fullName || !fireBaseId) {
            return res.status(400).json({
                message: 'All Fields Are Mandatory',
                success: false
            });
        }

        const user = await User.findOne({ fireBaseId });
        if (user) {
            return res.status(400).json({
                message: 'User Already Exists with this Firebase ID',
                success: false
            });
        }

        await User.create({
            fullName,
            fireBaseId
        });

        return res.status(200).json({
            message: 'User Created Successfully',
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error',
            success: false,
        });
    }
};

// User Login
export const login = async (req, res) => {
    try {
        const { fireBaseId } = req.body;
        if (!fireBaseId) {
            return res.status(400).json({
                message: "All Fields Are Required",
                success: false
            });
        }

        let user = await User.findOne({ fireBaseId });

        if (!user) {
            return res.status(400).json({
                message: 'Incorrect Firebase ID',
                success: false
            });
        }

        const tokenData = {
            userId: user._id,
        };

        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            id: user._id,
            fullName: user.fullName,
            fireBaseId: user.fireBaseId
        };

        return res.status(200)
            .cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
            .json({
                message: `Welcome Back ${user.fullName}`,
                user,
                success: true,
            });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error',
            success: false,
        });
    }
};

// User Logout
export const logout = async (req, res) => {
    try {
        return res.status(200)
            .cookie("token", "", { maxAge: 0 })
            .json({
                message: "Logged Out Successfully",
                success: true,
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error',
            success: false,
        });
    }
};

// Update User Profile
export const updateProfile = async (req, res) => {
    try {
        const { fullName, location, phoneNumber, bio } = req.body;
        const userId = req.userId;

        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: 'User Not Found',
                success: false
            });
        }

        // Update fields if provided
        if (fullName) user.fullName = fullName;
        if (phoneNumber) user.profile.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;

        // Update or create location
        if (location && location.latitude && location.longitude) {
            let userLocation;
            
            if (user.location) {
                // Update existing location
                userLocation = await Location.findByIdAndUpdate(
                    user.location,
                    { latitude: location.latitude, longitude: location.longitude },
                    { new: true }
                );
            } else {
                // Create new location and link it to the user
                userLocation = await Location.create(location);
                user.location = userLocation._id;
            }
        }

        await user.save();

        return res.status(200).json({
            message: "Profile Updated Successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                profile: user.profile,
                location: user.location,
            },
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server Error',
            success: false,
        });
    }
};