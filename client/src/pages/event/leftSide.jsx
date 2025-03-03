import React from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LEFTFORM = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        width: "25%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 4,
        borderRight: "2px solid #e0e0e0",
        pl: 4,
        pr: 4,
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        sx={{ width: "100%", fontWeight: "bold" }}
        onClick={() => handleNavigation("/profile/Event/create")}
      >
        Create Event
      </Button>
      <Button
        variant="contained"
        color="success"
        sx={{ width: "100%", fontWeight: "bold" }}
        onClick={() => handleNavigation("/profile/Event/manage")}
      >
        Manage Events
      </Button>
    </Box>
  );
};

export default LEFTFORM;