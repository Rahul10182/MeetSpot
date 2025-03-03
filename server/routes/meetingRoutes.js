import express from "express";
import {
    createMeeting,
    getAllMeetings,
    getMeetingById,
    updateMeetingVenue,
    updateMeetingDetails,
    deleteMeeting,
    getUserMeetings
} from "../controllers/meetingController.js";

const router = express.Router();

// Create a meeting
router.post("/create", createMeeting);

// Get all meetings
router.get("/", getAllMeetings);

// Get meeting by ID
router.get("/:meetingId", getMeetingById);

// Update a meeting
router.put("/:meetingId", updateMeetingDetails);

//update meeting venue
router.put("/venue/:id", updateMeetingVenue);

// Delete a meeting
router.delete("/:id", deleteMeeting);

//get user meeting
router.get("/user/:userId", getUserMeetings);

export default router;