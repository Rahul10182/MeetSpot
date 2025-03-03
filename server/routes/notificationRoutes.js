import express from "express";
import { deleteNotification, getUserNotifications, markNotificationAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/:firebaseID", getUserNotifications); // Get all user notifications
router.delete("/del/:notificationId", deleteNotification); // Delete notification
router.patch('/read/:id', markNotificationAsRead);

export default router;

