import express from 'express';
import { createEvent, getAllEvents, registerForEvent, getUserEvent, deleteEvent, getEventById,updateEvent } from '../controllers/eventController.js';

const router = express.Router();

router.post('/create', createEvent);
router.get('/getall', getAllEvents);
router.post('/register', registerForEvent);
router.post('/getUserEvent', getUserEvent);
router.delete('/delete/:eventId', deleteEvent);
router.get('/:eventId', getEventById);
router.post('/update/:eventId', updateEvent);


export default router;

