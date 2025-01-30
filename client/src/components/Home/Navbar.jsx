import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const Navbar = ({ showChat, handleAccountIconClick }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/home");
  };

  return (
    
      <Box
        component="header"
        className="bg-white shadow-md mx-auto flex justify-between items-center mt-4 mb-4"
        sx={{
          width: showChat ? "50%" : "80%",
          backgroundColor: "#f089cc",
          height: "60px",
          borderRadius: "30px",
          padding: "0 20px",
          marginLeft: showChat ? "calc((100vw - 400px - 50%) / 2)" : "10vw",
          marginRight: showChat ? "calc((100vw - 400px - 50%) / 2)" : "10vw",
          transition: "width 0.3s ease, margin-left 0.3s ease, margin-right 0.3s ease",
          "&:hover": {
            background: "linear-gradient(90deg, #ff7eb9, #ff65a3)",
          },
        }}
      >
        <Typography
          variant="h5"
          className="text-white font-bold"
          onClick={handleClick} // Attach the onClick handler
          style={{ cursor: "pointer" }} // Optionally, add pointer cursor to indicate it's clickable
        >
          MeetSpot
        </Typography>


        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Notification Button */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              transition: "all 0.3s ease",
              "&:hover": { width: "120px" },
              width: "40px",
              overflow: "hidden",
              backgroundColor: "white",
              borderRadius: "20px",
              boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
              marginRight: "10px",
            }}
          >
            <IconButton sx={{ color: "#ff65a3" }}>
              <NotificationsIcon />
            </IconButton>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "nowrap",
                color: "#ff65a3",
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
              "&:hover": { width: "140px" },
              width: "40px",
              overflow: "hidden",
              backgroundColor: "white",
              borderRadius: "20px",
              boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            <IconButton sx={{ color: "#ff65a3" }} onClick={handleAccountIconClick}>
              <AccountCircleIcon />
            </IconButton>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "nowrap",
                color: "#ff65a3",
                fontWeight: "bold",
                ml: "5px",
              }}
            >
              Account
            </Typography>
          </Box>
        </Box>
      </Box>
  );
};

export default Navbar;
