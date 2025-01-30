import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, MenuItem, Button, Modal } from "@mui/material";
import Eventmap from "./EventMap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdateEvent() {
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
  
  const { eventId } = useParams(); // Extract eventId from URL
  const navigate = useNavigate();

  // Fetch event data on component mount
  useEffect(() => {
    axios
      .get(`http://localhost:3000/event/${eventId}`)
      .then((response) => {
        const eventData = response.data;
        setFormData({
          eventName: eventData.eventName,
          eventType: eventData.eventType,
          status: eventData.status,
          photoUrl: eventData.photoUrl || "",
          description: eventData.description || "",
          beginDate: eventData.beginDate.split("T")[0], // Extract date
          beginTime: eventData.beginDate.split("T")[1]?.slice(0, 5) || "", // Extract time
          endDate: eventData.endDate.split("T")[0], // Extract date
          endTime: eventData.endDate.split("T")[1]?.slice(0, 5) || "", // Extract time
          firebaseID: eventData.firebaseID || "",
        });
        setEventAddress(eventData.locationName || "");
        setEventLocation(eventData.eventLocation || null);
      })
      .catch((error) => {
        console.error("Error fetching event data:", error);
      });
  }, [eventId]);

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
    const user = JSON.parse(localStorage.getItem("user"));
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
      locationName: eventAddress,
      eventLocation: eventLocation,
      firebaseID: firebaseID,
    };
    console.log(dataToSubmit);

    axios
      .post(`http://localhost:3000/event/update/${eventId}`, dataToSubmit)
      .then((response) => {
        console.log("Event updated successfully:", response.data);
        handleCloseModal();
        navigate("/profile/Event/manage"); // Navigate to profile or other desired page
      })
      .catch((error) => {
        console.error("Error updating event:", error);
      });
  };

  return (
    <div>
      <Box
        sx={{
          width: "75%",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          p: 4,
          gap: 3,
        }}
      >
        {/* Photo Box at the top */}
        <Box sx={{ mb: 4 }}>
          {!isInputActive ? (
            <Box
              onClick={handleBoxClick}
              sx={{
                width: 300,
                height: 300,
                border: "2px dashed #1976d2",
                borderRadius: 8,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  borderColor: "#0d47a1",
                  "&::after": {
                    content: "'Add Photo'",
                    position: "absolute",
                    bottom: -20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "#1976d2",
                    fontWeight: "bold",
                  },
                },
              }}
            >
              <img
                src={formData.photoUrl || "https://via.placeholder.com/100"}
                alt="Placeholder"
                style={{
                  position: "absolute",
                  width: "50%",
                  height: "50%",
                  objectFit: "contain",
                  opacity: 0.6,
                }}
              />
              <Typography
                sx={{
                  fontSize: 48,
                  fontWeight: "bold",
                  color: "#1976d2",
                  opacity: 0.8,
                }}
              >
                +
              </Typography>
            </Box>
          ) : (
            <TextField
              variant="outlined"
              fullWidth
              autoFocus
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleInputChange}
              placeholder="Enter Photo URL"
              sx={{
                width: 300,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 8,
                },
              }}
            />
          )}
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Basic Details
          </Typography>
          <TextField
            label="Event Name"
            name="eventName"
            fullWidth
            value={formData.eventName}
            onChange={handleInputChange}
          />
          <TextField
            label="Event Type"
            name="eventType"
            fullWidth
            select
            value={formData.eventType}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          >
            <MenuItem value="Music">Music</MenuItem>
            <MenuItem value="Party">Party</MenuItem>
            <MenuItem value="Cultural">Cultural</MenuItem>
            <MenuItem value="Dating">Dating</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField
            label="Status"
            name="status"
            fullWidth
            select
            value={formData.status}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          >
            <MenuItem value="Planning">Planning</MenuItem>
            <MenuItem value="Confirmed">Confirmed</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Location & Description
          </Typography>
          <Eventmap setUserLocation={setEventLocation} setAddress={setEventAddress}/>
          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Event Schedule
          </Typography>
          <TextField
            label="Begin Date"
            name="beginDate"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.beginDate}
            onChange={handleInputChange}
          />
          <TextField
            label="Begin Time"
            name="beginTime"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.beginTime}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.endDate}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
          <TextField
            label="End Time"
            name="endTime"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.endTime}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
        </Box>

        {/* Submit Button to Open Modal */}
        <Button
          variant="contained"
          sx={{ mt: 4, alignSelf: "flex-end" }}
          onClick={handleOpenModal}
        >
          Submit
        </Button>

        {/* Modal */}
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              width: 400,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Confirm Submission
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Are you sure you want to submit the form data?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </div>
  )
}

export default UpdateEvent;
