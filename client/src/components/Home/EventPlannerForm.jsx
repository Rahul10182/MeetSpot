import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Modal, Backdrop, Fade, Typography } from "@mui/material";

const EventPlannerForm = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [hoveredBox, setHoveredBox] = useState(null); // Track which box is hovered

  const handleBoxClick = (path) => {
    navigate(path);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          {/* Create a Meeting Box */}
          <Box
            onMouseEnter={() => setHoveredBox(1)} // Set hoveredBox to 1 on hover
            onMouseLeave={() => setHoveredBox(null)} // Reset hoveredBox on mouse leave
            onClick={() => handleBoxClick("/profile/Event/create")}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 250, // Increased height
              border: `2px solid ${
                hoveredBox === 1 ? "blue" : hoveredBox === 2 ? "green" : "black"
              }`,
              borderRadius: "8px",
              padding: 3,
              textAlign: "center",
              cursor: "pointer",
              transition: "border-color 0.3s",
            }}
          >
            <Typography variant="h6" component="h3" sx={{ fontWeight: "bold" }}>
              Create a Meeting
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Schedule a meeting with your team. Add participants, set a time, and manage everything in one place.
            </Typography>
          </Box>

          {/* Create an Event Box */}
          <Box
            onMouseEnter={() => setHoveredBox(2)} // Set hoveredBox to 2 on hover
            onMouseLeave={() => setHoveredBox(null)} // Reset hoveredBox on mouse leave
            onClick={() => handleBoxClick("/profile/Event/create")}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 250, // Increased height
              border: `2px solid ${
                hoveredBox === 2 ? "blue" : hoveredBox === 1 ? "green" : "black"
              }`,
              borderRadius: "8px",
              padding: 3,
              textAlign: "center",
              cursor: "pointer",
              transition: "border-color 0.3s",
            }}
          >
            <Typography variant="h6" component="h3" sx={{ fontWeight: "bold" }}>
              Create an Event
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Plan an event, invite attendees, and manage everything seamlessly. Perfect for any occasion.
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EventPlannerForm;
