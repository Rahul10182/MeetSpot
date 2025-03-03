
import Event from "../models/eventModel.js"
import { User } from "../models/userModel.js";
import {sendNotification} from './notificationController.js'

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

export const createEvent = async (req, res) => {
    try {
        
        const dataToSubmit = req.body;

        const eventName = dataToSubmit.eventName;
        const eventType = dataToSubmit.eventType;
        const status = dataToSubmit.status;
        const locationName = dataToSubmit.locationName;
        const eventLocation = dataToSubmit.eventLocation;
        const photoUrl = dataToSubmit.photoUrl;
        const description = dataToSubmit.description;
        const beginDate = dataToSubmit.beginDate;
        const beginTime = dataToSubmit.beginTime;
        const endDate = dataToSubmit.endDate;
        const endTime = dataToSubmit.endTime;
        const firebaseID = dataToSubmit.firebaseID;
        if (
            !eventName || 
            !locationName || 
            !eventLocation?.lat || 
            !eventLocation?.lng || 
            !beginDate || 
            !endDate || 
            !firebaseID
        ) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Construct the location object
        const location = {
            name: locationName,
            latitude: eventLocation.lat,  // Access lat
            longitude: eventLocation.lng, // Access lng
        };

        // Create a new Event instance
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

        const savedEvent = await newEvent.save();

        res.status(201).json({
            message: 'Event created successfully',
            event: savedEvent,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error });
    }
};

export const registerForEvent = async (req, res) => {
    const { eventId, userEmail, friendEmail } = req.body;
    console.log(eventId)
    console.log(userEmail)
    console.log(friendEmail)
    // debugging
  
    try {
      const user = await User.findOne({ email: userEmail });
      const friend = await User.findOne({ email: friendEmail });
      const event = await Event.findById(eventId);
      console.log(userEmail)
      console.log(friendEmail)
      console.log(eventId)
  
      if (!user || !friend || !event) {
        return res.status(404).json({ message: "User, friend, or event not found" });
      }
  
      user.events.push(eventId);
      friend.events.push(eventId);
  
      await user.save();
      await friend.save();
  
      const userMessage = `You have successfully registered for the event '${event.eventName}'!`;
      const friendMessage = `${userEmail} has registered you for the event '${event.eventName}'!`;
  
      await sendNotification(user.fireBaseId, userMessage, "event_registration");
      await sendNotification(friend.fireBaseId, userMessage, "event_registration");
      await sendNotification(friend.fireBaseId, friendMessage, "event_registration");
  
      res.status(200).json({ message: "Registration successful and notifications sent!" });
    } catch (error) {
      console.error("Error registering for event:", error);
      res.status(500).json({ message: "Error registering for event", error });
    }
  };


export const getUserEvent = async (req, res) => {
    const { firebaseID } = req.body;
  
    if (!firebaseID) {
      return res.status(400).json({ message: 'Firebase ID is required' });
    }
  
    try {
      const events = await Event.find({ firebaseID });
      if (events.length === 0) {
        return res.status(404).json({ message: 'No events found for this Firebase ID' });
      }
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error });
    }
  };

  export const deleteEvent = async (req, res) => {
    const { eventId } = req.params;
  
    try {
      const deletedEvent = await Event.findByIdAndDelete(eventId);
  
      if (!deletedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      return res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      return res.status(500).json({ message: 'Server error, unable to delete event' });
    }
  };

  export const getEventById = async (req, res) => {
    const { eventId } = req.params;
  
    try {
      const event = await Event.findById(eventId);
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      return res.status(200).json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      return res.status(500).json({ message: 'Server error, unable to fetch event' });
    }
  };

  export const updateEvent = async (req, res) => {
    try {
      const { eventId } = req.params; 
      const updateData = req.body;  
  
      const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { 
        new: true,            
        runValidators: true,         
      });
  
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      res.status(200).json({
        message: "Event updated successfully",
        updatedEvent,
      });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
