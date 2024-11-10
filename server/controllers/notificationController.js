import Notification  from '../models/notificationModel.js';

export const sendNotification = async (firebaseID, message, type = 'other') => {
    try {
        const notification = new Notification({
            firebaseID,
            message,
            type,
            readStatus: false
        });
        await notification.save();
        console.log("Notification sent to user:", firebaseID);
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};

export const getUserNotifications = async (req, res) => {
    try {
        const firebaseID = req.params.firebaseID;

        const notifications = await Notification.find({ fireBaseId:firebaseID }).sort({ timestamp: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
};



export const markAsRead = async (req, res) => {
    try {
        const firebaseID = req.params.firebaseID;
        await Notification.findByIdAndDelete({fireBbseId:firebaseID});
        res.status(200).json({ message: 'Notification deleted after marking as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting notification', error });
    }
};