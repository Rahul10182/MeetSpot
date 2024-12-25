import express from "express";
import { sendReminder, getAllMeetings, sendMail } from '../controllers/mailController.js'

const router = express.Router();

router.post('/send-reminder', sendReminder);
router.post('/send-email', sendMail);
router.get('/all-meetings', getAllMeetings);

export default router;
