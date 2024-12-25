
import express from "express";
import { getUserNotifications } from "../controllers/notificationController.js";

const router = express.Router();

router.post("/:userId", getUserNotifications); //get all user notifications
router.patch("/read/:id", );  


export default router;

