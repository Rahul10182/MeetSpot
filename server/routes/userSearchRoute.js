import express from 'express';
import { User } from '../models/userModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || email.trim() === '') {
            return res.status(400).json({ message: 'Email search term is required.' });
        }

        const users = await User.find({
            email: { $regex: email, $options: 'i' }
        }).select('fullName email fireBaseId'); 

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found matching the email.' });
        }

        return res.status(200).json({ users });
    } catch (error) {
        console.error('Error searching for users:', error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
});

export default router;
