import React from "react";
import { Container, Typography, Box } from "@mui/material";
import laptopImage from "../../assets/laptop.png";


const AboutUs = () => {
  return (
    <Container maxWidth="lg" className="py-20">
      <Typography variant="h3" align="center" className="text-indigo-700 font-bold mb-6">
        About Us
      </Typography>
      <Box className="text-center text-gray-700">
        <Typography variant="h5" className="mb-6">
          Welcome to MeetSpot! Your trusted platform for connecting with friends and finding the perfect meeting spot.
        </Typography>
        <Typography variant="body1" className="mb-6">
          At MeetSpot, we believe in making meetups easier by using technology to find the most convenient and central location based on your preferences.
        </Typography>
        <Typography variant="body1" className="mb-6">
          Whether you’re meeting friends, colleagues, or new acquaintances, we ensure that your experience is seamless and enjoyable with smart location recommendations and real-time chat functionality.
        </Typography>
        <Typography variant="body1">
          Our mission is to help people make meaningful connections and experience unforgettable moments, no matter where they are.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUs;