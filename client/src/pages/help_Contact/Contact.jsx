import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Container } from "@mui/material";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [feedback, setFeedback] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/v1/mail/contact-email", formData);
      setFeedback(response.data.message);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    } catch (error) {
      setFeedback("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 min-h-screen flex items-center">
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box className="relative text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-500 py-16 rounded-lg shadow-xl overflow-hidden">
          {/* Decorative Background Shapes */}
          <div className="absolute -top-16 -left-16 w-40 h-40 bg-blue-300 rounded-full opacity-50 blur-lg animate-pulse"></div>
          <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-purple-300 rounded-full opacity-50 blur-lg animate-pulse"></div>

          {/* Section Content */}
          <Typography
            variant="h2"
            className="font-extrabold text-white drop-shadow-lg tracking-wide"
            gutterBottom
          >
            We'd Love to Hear From You!
          </Typography>
          <Typography
            variant="h6"
            className="text-gray-200 mt-4 px-6 md:px-16 leading-relaxed"
          >
            Reach out to us with any questions, feedback, or suggestions for{" "}
            <span className="font-bold underline decoration-wavy text-pink-200">
              MeetSpot
            </span>
            . Let’s connect and make your meetings memorable!
          </Typography>
        </Box>

        {/* Contact Form Section */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 shadow-2xl rounded-xl p-10 mx-auto transform transition-all hover:scale-105"
          sx={{
            maxWidth: 800,
          }}
        >
          <Typography variant="h4" className="text-gray-800 font-bold text-center mb-8">
            Contact Us
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              name="firstName"
              label="First Name"
              variant="outlined"
              fullWidth
              value={formData.firstName}
              onChange={handleChange}
              className="rounded-md shadow-md"
            />
            <TextField
              name="lastName"
              label="Last Name"
              variant="outlined"
              fullWidth
              value={formData.lastName}
              onChange={handleChange}
              className="rounded-md shadow-md"
            />
          </div>
          <div className="mt-6">
            <TextField
              name="email"
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              className="rounded-md shadow-md"
            />
          </div>
          <div className="mt-6">
            <TextField
              name="phone"
              label="Phone Number"
              type="tel"
              variant="outlined"
              fullWidth
              value={formData.phone}
              onChange={handleChange}
              className="rounded-md shadow-md"
            />
          </div>
          <div className="mt-6">
            <TextField
              name="message"
              label="Your Message"
              variant="outlined"
              multiline
              rows={5}
              fullWidth
              value={formData.message}
              onChange={handleChange}
              className="rounded-md shadow-md"
            />
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              type="submit"
              variant="contained"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              sx={{
                typography: "h6",
              }}
            >
              Send Message
            </Button>
          </div>

          {/* Feedback */}
          {feedback && (
            <Typography variant="body1" className="text-center mt-6 text-gray-600">
              {feedback}
            </Typography>
          )}
        </Box>
        
        {/* Contact Information */}
        <Box className="mt-16 text-center">
          <Typography
            variant="h4"
            className="font-bold text-gray-800 mb-4"
          >
            Our Contact Information
          </Typography>
          <Typography
            variant="body1"
            className="text-gray-600 mb-2"
          >
            Email: <span className="font-semibold">contact@meetspot.com</span>
          </Typography>
          <Typography
            variant="body1"
            className="text-gray-600 mb-2"
          >
            Phone: <span className="font-semibold">+1 234 567 890</span>
          </Typography>
          <Typography
            variant="body1"
            className="text-gray-600"
          >
            Address: <span className="font-semibold">1234 MeetSpot Lane, Connect City, Universe</span>
          </Typography>
        </Box>


      </Container>
    </div>
  );
};

export default Contact;
