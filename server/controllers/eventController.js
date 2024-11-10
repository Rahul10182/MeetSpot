import Event from "../models/eventModel.js";
import { User } from "../models/userModel.js";
import { sendNotification } from "./notificationController.js";

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
      firebaseID,
    } = req.body;

    if (!eventName || !location || !beginDate || !endDate || !firebaseID) {
      return res.status(400).json({ message: "Please provide all required fields." });

    }

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
      message: "Event created successfully",
      event: savedEvent,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
};

export const registerForEvent = async (req, res) => {
  const { eventId, userEmail, friendEmail } = req.body;

  try {
    const user = await User.findOne({ email: userEmail });
    const friend = await User.findOne({ email: friendEmail });
    const event = await Event.findById(eventId);

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