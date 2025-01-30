import Meeting from "../models/meetingModel.js";
import Venue from "../models/venueModel.js";

// Create a new meeting
export const createMeeting = async (req, res) => {
    const { title, description, date, time, venue, attendees, createdBy } = req.body;

    try {
        const venueExists = await Venue.findById(venue);
        if (!venueExists) {
            return res.status(404).json({ message: "Venue not found" });
        }


        const meeting = new Meeting({
            title,
            description,
            date,
            time,
            venue,
            attendees,
            createdBy,
        });

        const savedMeeting = await meeting.save();
        venueExists.meetings.push(savedMeeting._id);
        res.status(201).json(savedMeeting);
    } catch (error) {
        res.status(500).json({ message: "Error creating meeting", error });
    }
};

// Get all meetings
export const getAllMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find()
            .populate("venue", "name address")
            .populate("attendees", "fullName email")
            .populate("createdBy", "fullName email");
        res.status(200).json(meetings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching meetings", error });
    }
};

// Get meeting by ID
export const getMeetingById = async (req, res) => {
    const { meetingId } = req.params;

    try {
        const meeting = await Meeting.findById(meetingId)
            .populate("venue", "name address location")
            .populate("attendees", "fullName email")
            .populate("createdBy", "fullName email");
        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }
        const meetingDetails = {
            venue: {
                name: meeting.venue.name,
                address: meeting.venue.address,
                location: meeting.venue.location
            },
            createdBy: {
                fullName: meeting.createdBy.fullName,
                email: meeting.createdBy.email,
            },
            attendees: meeting.attendees.map(attendee => ({
                id: attendee._id,
                fullName: attendee.fullName,
                email: attendee.email,
            })),
        };
        res.status(200).json(meetingDetails);
    } catch (error) {
        res.status(500).json({ message: "Error fetching meeting", error });
    }
};

// Update a meeting venue
export const updateMeetingVenue = async (req, res) => {
    const { id } = req.params;
    const { venue } = req.body;

    try {
        const venueExists = await Venue.findById(venue);
        if (!venueExists) {
            return res.status(404).json({ message: "Venue not found" });
        }

        const updatedMeeting = await Meeting.findByIdAndUpdate(
            id,
            { venue },
            { new: true }
        );

        if (!updatedMeeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        res.status(200).json(updatedMeeting);
    } catch (error) {
        res.status(500).json({ message: "Error updating venue", error });
    }
};
//update meeting details
export const updateMeetingDetails = async (req, res) => {
    const { meetingId } = req.params;
    const { title, description, date, time, attendees } = req.body;

    try {
        const updatedMeeting = await Meeting.findByIdAndUpdate(
            meetingId,
            { title, description, date, time, attendees },
            { new: true }
        );

        if (!updatedMeeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        res.status(200).json(updatedMeeting);
    } catch (error) {
        res.status(500).json({ message: "Error updating meeting details", error });
    }
};
// Delete a meeting
export const deleteMeeting = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMeeting = await Meeting.findByIdAndDelete(id);
        if (!deletedMeeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }
        res.status(200).json({ message: "Meeting deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting meeting", error });
    }
};

// update meeting status
export const updateMeetingStatuses = async () => {
    try {
        const now = new Date();
        await Meeting.updateMany(
            { date: { $lt: now }, status: "scheduled" },
            { $set: { status: "missed" } }
        );
    } catch (error) {
        console.error("Error updating meeting statuses:", error);
    }
};

// Fetch User Meetings API
export const getUserMeetings = async (req, res) => {
    const { userId } = req.params;

    try {
        await updateMeetingStatuses(); // Ensure statuses are updated before fetching

        const userMeetings = await Meeting.find({
            $or: [
                { createdBy: userId },
                { attendees: userId }
            ]
        })
            .populate("venue", "name address ")
            .populate("attendees", "fullName email")
            .populate("createdBy", "fullName email");


        if (!userMeetings || userMeetings.length === 0) {
            return res.status(404).json({ message: "No meetings found for this user" });
        }

        const formattedMeetings = userMeetings.map(meeting => ({
            id: meeting._id,
            title: meeting.title,
            description: meeting.description,
            date: meeting.date,
            time: meeting.time,
            status: meeting.status,
            attendees: meeting.attendees.map(attendee => ({
                id: attendee._id,
                fullName: attendee.fullName,
                email: attendee.email,
            })),
            venue: {
                id: meeting.venue._id,
                name: meeting.venue.name,
                address: meeting.venue.address,
            },
            createdBy: {
                id: meeting.createdBy._id,
                fullName: meeting.createdBy.fullName,
                email: meeting.createdBy.email,
            }
        }));

        res.status(200).json(formattedMeetings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user meetings", error });
    }
};