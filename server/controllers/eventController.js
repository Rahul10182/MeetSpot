import Event from "../models/eventModel.js"

export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error });
    }
};

export const createEvent = async (req, res) => {
    try {
        const {
            eventName,
            eventType,
            status,
            location,
            photoUrl,
            description,
            beginDate,
            beginTime,
            endDate,
            endTime,
            firebaseID
        } = req.body;

        // Validate required fields
        if (!eventName || !location || !beginDate || !endDate || !firebaseID) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Create a new event instance
        const newEvent = new Event({
            eventName,
            eventType,
            status,
            location,
            photoUrl,
            description,
            beginDate,
            beginTime,
            endDate,
            endTime,
            firebaseID,
        });

        // Save the event to the database
        const savedEvent = await newEvent.save();

        res.status(201).json({
            message: 'Event created successfully',
            event: savedEvent,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error });
    }
};