import React, { useState } from "react";
import { Box, Typography, TextField, MenuItem, Button, Modal } from "@mui/material";
import axios from "axios";
import LEFTFORM from "./leftSide";
import { Outlet } from "react-router-dom";


const EventPlannerForm = () => {
  const [isInputActive, setIsInputActive] = useState(false);
  const [eventLocation, setEventLocation] = useState(null);
  const [eventAddress, setEventAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "",
    status: "",
    location: "",
    photoUrl: "",
    description: "",
    beginDate: "",
    beginTime: "",
    endDate: "",
    endTime: "",
    firebaseID: "",
  });

  const handleBoxClick = () => {
    setIsInputActive(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const firebaseID = user ? user.firebaseID : null;

    const now = new Date();
    const beginDateTime = new Date(`${formData.beginDate}T${formData.beginTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    // Validation checks
    if (beginDateTime < now) {
      alert("Begin date and time must be greater than or equal to the current date and time.");
      return;
    }

    if (endDateTime <= beginDateTime) {
      alert("End date and time must be greater than begin date and time.");
      return;
    }

    const dataToSubmit = {
        ...formData,
        locationName: eventAddress,   // eventAddress holds location name
        eventLocation: eventLocation, // eventLocation holds { lat, lng }
        firebaseID: firebaseID,      // Add firebaseID to the data
    };

    axios.post('http://localhost:3000/event/create', dataToSubmit)
        .then((response) => {
            console.log('Event created successfully:', response.data);
            handleCloseModal();
        })
        .catch((error) => {
            console.error('Error creating event:', error);
        });
  };


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        bgcolor: "#f9f9f9",
      }}
    >
      {/* Left Hand Side: Static Steps */}
      <LEFTFORM />

      {/* Right Hand Side: Scrollable Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 4,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default EventPlannerForm;
