import express from 'express';
import Event from '../models/eventModel.js';
import { User } from '../models/userModel.js';  

const router = express.Router();

router.route("/").post(async (req, res) => {
  const { eventName, beginDate, location, firebaseID } = req.body; 

  try {
    const existingEvent = await Event.findOne({ eventName, beginDate, location });

    if (existingEvent) {
      return res.status(400).json({ message: 'Event already exists' });
    }

    const event = new Event(req.body);
    await event.save();

    const user = await User.findOne({ fireBaseId : firebaseID });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.events.push(event._id);
    await user.save();

    res.status(201).json({ message: 'Event created successfully', event });

  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
});

export default router;
