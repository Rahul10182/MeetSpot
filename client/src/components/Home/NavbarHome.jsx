import React, { useState } from "react";
import { Box, IconButton, Typography, Button } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EventPlannerForm from "./EventPlannerForm";
import NotificationSidebar from "./NotiSideBar";

const NavbarHome = ({ handleAccountIconClick, zIndex = 10, firebaseID }) => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleCreateClick = () => {
    setShowEventForm(true);
  };

  const handleCloseForm = () => {
    setShowEventForm(false);
  };

  // Function to toggle notifications panel
  const handleNotificationsClick = () => {
    setShowNotifications((prev) => !prev);
  };

  return (
    <Box
      component="header"
      className="bg-white shadow-md fixed top-0 left-0 flex justify-between items-center bg-pink-500"
      sx={{
        width: "100%",
        backgroundColor: "#ec4899",
        height: "60px",
        border: "1px solid rgb(164, 51, 110)",
        padding: "0 20px",
        margin: "0 auto",
        transition: "width 0.3s ease",
        zIndex: zIndex,
      }}
    >
      <Typography variant="h5" className="text-white font-bold">
        MeetSpot
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* Notification Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            transition: "all 0.3s ease",
            "&:hover": { width: "157px", backgroundColor: "#be185d" },
            width: "40px",
            overflow: "hidden",
            borderRadius: "4px",
            boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
            marginRight: "10px",
          }}
        >
          <IconButton sx={{ color: "#fff" }} onClick={handleNotificationsClick}>
            <NotificationsIcon />
          </IconButton>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "nowrap",
              color: "#fff",
              fontWeight: "bold",
              ml: "5px",
            }}
          >
            Notifications
          </Typography>
        </Box>

        {/* Account Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            transition: "all 0.3s ease",
            "&:hover": { width: "140px", backgroundColor: "#be185d" },
            width: "40px",
            overflow: "hidden",
            backgroundColor: "#ec4899",
            borderRadius: "4px",
            boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          <IconButton sx={{ color: "#fff" }} onClick={handleAccountIconClick}>
            <AccountCircleIcon />
          </IconButton>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "nowrap",
              color: "#fff",
              fontWeight: "bold",
              ml: "5px",
            }}
          >
            Account
          </Typography>
        </Box>

        {/* Create Event Button */}
        <Button
          sx={{
            backgroundColor: "#ec4899",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "50px",
            padding: "10px 20px",
            marginLeft: "10px",
            "&:hover": { backgroundColor: "#be185d" },
          }}
          onClick={handleCreateClick}
        >
          <Typography variant="body1" sx={{ marginRight: "10px" }}>
            Create
          </Typography>
          <span>+</span>
        </Button>
      </Box>

      {/* Event Planner Form */}
      {showEventForm && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={handleCloseForm} // Close when clicking outside
        >
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
              width: "90%",
              maxWidth: "500px",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the form
          >
            <EventPlannerForm open={showEventForm} onClose={handleCloseForm} />
          </Box>
        </Box>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <Box
          sx={{
            position: "fixed", // Use `fixed` to make it always visible on the right
            top: "60px", // Start below the header
            right: "0", // Align to the right
            width: "300px", // Sidebar width
            height: "calc(100vh - 60px)", // Full height minus the header height
            backgroundColor: "#fdf2f8", // Light pink background
            borderLeft: "1px solid #e2e8f0", // Subtle border
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Soft shadow for separation
            overflowY: "auto", // Scroll if content exceeds height
            zIndex: 10, // Ensure it stays above other elements
          }}
        >
          <NotificationSidebar firebaseID={firebaseID} />
        </Box>
      )}
    </Box>
  );
};

export default NavbarHome;
