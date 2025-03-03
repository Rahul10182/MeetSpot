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
        const { firebaseID } = req.params;

        const notifications = await Notification.find({ firebaseID }).sort({ timestamp: -1 });

        if (notifications.length === 0) {
            return res.status(404).json({ message: 'No notifications found for this user.' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
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

export const deleteNotification = async (req, res) => {
    try {
      const notificationId = req.params.notificationId; 
      console.log(notificationId)
  
      const deletedNotification = await Notification.findByIdAndDelete(notificationId);
  
      if (!deletedNotification) {
        return res.status(404).json({ message: 'Notification not found.' });
      }
  
      res.status(200).json({ message: 'Notification deleted successfully.' });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ message: 'Error deleting notification', error });
    }
  };

  export const markNotificationAsRead = async (req, res) => {
    try {
      const { id } = req.params;
      const { readStatus } = req.body;
  
      const notification = await Notification.findByIdAndUpdate(id, { readStatus }, { new: true });
  
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
  
      res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
      console.error('Error updating notification:', error);
      res.status(500).json({ message: 'Error updating notification', error });
    }
  };