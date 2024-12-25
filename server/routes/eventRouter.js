import express from 'express';
import { createEvent, getAllEvents, registerForEvent } from '../controllers/eventController.js';

const router = express.Router();

router.post('/create', createEvent);
router.get('/getall', getAllEvents);
router.post('/register', registerForEvent);


export default router;

