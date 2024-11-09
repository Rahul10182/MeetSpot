import express from 'express';
import { createEvent, getAllEvents } from '../controllers/eventController.js';

const router = express.Router();

router.post('/create', createEvent);
router.get('/getall', getAllEvents);


export default router;
