import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardActions, Button, Typography, Box, Paper } from '@mui/material';
import { Delete } from '@mui/icons-material';

const Notifications = ({ firebaseID }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/notifications/${firebaseID}`);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [firebaseID]);

  const handleDelete = async (notificationId) => {
    try {
        await axios.delete(`http://localhost:3000/notifications/del/${notificationId}`);
        setNotifications(notifications.filter(notification => notification._id !== notificationId));
    } catch (error) {
        console.error("Error deleting notification:", error);
    }
  };

  return (
    <Box 
      className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-200 to-pink-400"
    >
      <Paper 
        elevation={6} 
        className="notification-container mx-auto p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-lg rounded-lg"
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <Typography variant="h5" align="center" className="mb-4 font-semibold text-blue-600">
          Notifications
        </Typography>
        
        <Box>
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <Card 
                key={notification._id} 
                className={`notification-item mb-4 transition-transform ${notification.read ? 'bg-gray-100' : 'bg-white'} shadow-md`} 
                sx={{
                  borderRadius: '12px',
                  padding: '8px',
                  borderLeft: notification.read ? '4px solid #a0aec0' : '4px solid #4299e1'
                }}
              >
                <CardContent>
                  <Typography variant="body1" className="text-gray-700">
                    {notification.message}
                  </Typography>
                </CardContent>
                <CardActions className="flex justify-end space-x-2">
                  <Button 
                    onClick={() => handleDelete(notification._id)} 
                    startIcon={<Delete />} 
                    className="delete text-red-500"
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))
          ) : (
            <Typography variant="body2" align="center" className="text-gray-500">
              No notifications found.
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Notifications;
