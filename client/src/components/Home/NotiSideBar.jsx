import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Divider,
} from "@mui/material";
import { Delete, Notifications, CheckCircle } from "@mui/icons-material";

const NotificationSidebar = ({ firebaseID }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Sidebar toggle

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/notifications/${firebaseID}`);
        console.log(response);
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
      setNotifications(notifications.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:3000/notifications/read/${notificationId}`, {
        readStatus: true,
      });
      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, readStatus: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: isOpen ? "300px" : "60px",
        backgroundColor: "#ffffff",
        boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        transition: "width 0.3s ease",
        zIndex: 1200,
      }}
    >
      {/* Header with Notification Icon */}
      <Tooltip title={isOpen ? "Collapse" : "Expand"} placement="right">
        <IconButton
          sx={{
            color: "#ec4899",
            marginTop: "10px",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Notifications />
        </IconButton>
      </Tooltip>

      {isOpen && (
        <Typography
          variant="h6"
          sx={{
            marginY: "10px",
            fontWeight: "bold",
            color: "#4299e1",
            textAlign: "center",
          }}
        >
          Notifications
        </Typography>
      )}

      <Divider />

      {/* Notification List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          width: "100%",
          paddingX: isOpen ? "10px" : "5px",
        }}
      >
        {notifications.length > 0 ? (
          <List>
            {notifications.map((notification) => (
              <ListItem
                key={notification._id}
                sx={{
                  backgroundColor: notification.readStatus ? "#d4f8e8" : "#ffffff",
                  borderRadius: "8px",
                  marginBottom: "8px",
                  padding: "8px",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                {isOpen ? (
                  <>
                    <ListItemText
                      primary={notification.message}
                      primaryTypographyProps={{
                        color: notification.readStatus ? "#38a169" : "#000000",
                        fontWeight: notification.readStatus ? "bold" : "normal",
                        fontSize: "14px",
                      }}
                    />
                    <ListItemSecondaryAction>
                        <Tooltip title="Mark as Read">
                            <IconButton
                                sx={{ color: "#38a169" }}
                                onClick={() => handleMarkAsRead(notification._id)}
                                disabled={notification.readStatus}
                            >
                                <CheckCircle />
                            </IconButton>
                        </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          sx={{ color: "#e53e3e" }}
                          onClick={() => handleDelete(notification._id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </>
                ) : (
                  <Tooltip title={notification.message}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: notification.readStatus ? "#38a169" : "#000000",
                        fontWeight: notification.readStatus ? "bold" : "normal",
                        fontSize: "12px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        width: "40px",
                      }}
                    >
                      {notification.message}
                    </Typography>
                  </Tooltip>
                )}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "#718096", marginTop: "20px" }}
          >
            No notifications found.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default NotificationSidebar;