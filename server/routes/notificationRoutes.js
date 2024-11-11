import express from "express";
import { deleteNotification, getUserNotifications } from "../controllers/notificationController.js";

const router = express.Router();

router.post("/:firebaseId", getUserNotifications); // Get all user notifications
router.delete("/del/:notificationId", deleteNotification); // Delete notification
router.patch("/read/:id", );  

export default router;
