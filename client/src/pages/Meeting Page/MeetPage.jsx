import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Container,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import FriendSelector from "./Friend/FriendSelector";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UserLocation from "./MeetingMap";
import VenuesSection from "./Venues/VenueSection";
import Notifications from "./MeetingDetails/NotificationAndSubmit";
import MeetingDetailsPage from "./MeetingDetails/MeetingDetails";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateMeetingPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [friendLocation, setFriendLocation] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: null,
    attendees: [],
    createdBy: "",
  });

  const handleCreateMeeting = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/meeting/create",
        formData
      );
      alert("Meeting created successfully!");
      navigate("/profile/show-meet/user");
    } catch (error) {
      console.error("Error creating meeting:", error.response?.data || error.message);
      alert("Failed to create meeting. Please try again.");
    }
  };

  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    "Meeting Details",
    "Your Location",
    "Friend's Location",
    "Venue",
    "Send Notification",
  ];

  const stepsDetails = [
    {
      title: "Meeting Details",
      component: (
        <MeetingDetailsPage formData={formData} setFormData={setFormData} />
      ),
    },
    {
      title: "Your Location",
      component: (
        <UserLocation setUserLocation={setUserLocation} handleNext={() => setActiveStep(1)} />
      ),
    },
    {
      title: "Friend's Location",
      component: (
        <UserLocation
          isFriend={true}
          setUserLocation={setFriendLocation}
          handleNext={() => setActiveStep(2)}
        />
      ),
    },
    {
      title: "Venue",
      component: (
        <VenuesSection
          userLocation={userLocation}
          friendLocation={friendLocation}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
    {
      title: "Send Notification",
      component: <Notifications />,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Stepper with clickable steps */}
      <Box sx={{ py: 2, px: 4, backgroundColor: "#f5f5f5" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                icon={
                  activeStep > index ? (
                    <CheckCircleIcon color="success" />
                  ) : undefined
                }
                onClick={() => setActiveStep(index)} // Click handler for steps
                sx={{ cursor: "pointer" }} // Make steps clickable
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Render active step content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
              {stepsDetails[activeStep].title}
            </Typography>
            <Box sx={{ mt: 4 }}>{stepsDetails[activeStep].component}</Box>
          </Paper>
        </Container>

        {/* Navigation buttons */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", px: 4 }}>
          <Button
            variant="outlined"
            onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
            disabled={activeStep === 0}
          >
            Previous
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))}
            >
              Next
            </Button>
          ) : (
            <Button variant="contained" color="success" onClick={handleCreateMeeting}>
              Create
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CreateMeetingPage;
