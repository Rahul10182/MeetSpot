import express from "express";
import { sendReminder, getAllMeetings, sendMail, contactMail } from '../controllers/mailController.js'

const router = express.Router();

router.post('/send-reminder', sendReminder);
router.post('/send-email', sendMail);
router.post('/contact-email', contactMail);
router.get('/all-meetings', getAllMeetings);

export default router;
