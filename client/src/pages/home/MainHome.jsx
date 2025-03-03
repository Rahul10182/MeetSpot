import React from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { FaMapMarkerAlt, FaComments, FaUsers } from "react-icons/fa";
import mapvideo from "../../assests/mapvideo.mp4";
import { useNavigate } from "react-router-dom";
const MainHome = () => {

  const navigate = useNavigate();
  
    const handleGoHome = () => {
      navigate("/create-meeting");
    };
  return (
    <div className="bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-100 min-h-screen">
      {/* Hero Section */}
      <Container maxWidth="lg" className="text-center pt-16">
        <Box className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 px-8 rounded-lg shadow-xl overflow-hidden">
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-blue-300 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-purple-300 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <Typography
            variant="h2"
            className="font-extrabold drop-shadow-md tracking-wide"
            gutterBottom
          >
            Welcome to Meeting Point
          </Typography>
          <Typography
            variant="h6"
            className="mt-4 px-6 md:px-16 leading-relaxed text-gray-100"
          >
            A seamless platform to schedule and manage meetings between two
            people at cafes, parks, malls, and more. Let’s connect, plan, and
            enjoy!
          </Typography>
          <div className="mt-10">
            <Button
              variant="contained"
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-8 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition-all"
              sx={{ typography: "h6" }}
              onClick={handleGoHome}
            >
              Schedule Your Meeting
            </Button>
          </div>
        </Box>
      </Container>

      <Container maxWidth="md" className="mt-16 text-center">
        <Typography
          variant="h4"
          className="font-bold text-gray-800 mb-8"
        >
          How It Works
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Box className="flex flex-col items-center bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 p-8 rounded-lg shadow-md hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              📍
            </div>
            <Typography
              variant="h6"
              className="mt-4 font-bold text-gray-800"
            >
              Choose a Location
            </Typography>
            <Typography className="mt-2 text-gray-600">
              Select the perfect spot, whether it's a cafe, park, or hotel.
            </Typography>
          </Box>

          {/* Feature 2 */}
          <Box className="flex flex-col items-center bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 p-8 rounded-lg shadow-md hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              📅
            </div>
            <Typography
              variant="h6"
              className="mt-4 font-bold text-gray-800"
            >
              Schedule the Time
            </Typography>
            <Typography className="mt-2 text-gray-600">
              Pick a time and date that works for both parties.
            </Typography>
          </Box>

          {/* Feature 3 */}
          <Box className="flex flex-col items-center bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 p-8 rounded-lg shadow-md hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              🤝
            </div>
            <Typography
              variant="h6"
              className="mt-4 font-bold text-gray-800"
            >
              Meet and Enjoy
            </Typography>
            <Typography className="mt-2 text-gray-600">
              Connect, discuss, and enjoy quality time together.
            </Typography>
          </Box>
        </div>
      </Container>

      

        {/* Map Section */}
        <Container maxWidth="md" className="mt-16">
        <Typography
            variant="h4"
            className="font-bold text-gray-800 text-center mb-8"
        >
            Real-Time Map Tracking
        </Typography>
        <Box className="bg-white shadow-lg p-8 rounded-lg">
            <Typography
            variant="h6"
            className="font-semibold text-gray-700 mb-4 border-b-4 border-purple-400 pb-2"
            sx={{ typography: "subtitle1" }}
            >
            🌍 Track your distance and your meeting partner's distance to the location:
            </Typography>
            <div className="relative">
            {/* Map Video */}
            <video
                src={mapvideo}
                className="w-full h-auto rounded-lg"
                autoPlay
                loop
                muted
                style={{ maxWidth: "100%", height: "auto" }}
            ></video>
            </div>
        </Box>
        </Container>




      {/* Features Section */}
      <Container maxWidth="md" className="mt-16">
        <Typography
          variant="h4"
          className="font-bold text-gray-800 text-center mb-8"
        >
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {/* Feature 1 */}
          <Grid item xs={12} sm={4}>
            <Box className="flex flex-col items-center bg-gradient-to-r from-indigo-200 to-pink-200 p-8 rounded-lg shadow-md hover:scale-105 transition-transform">
              <FaMapMarkerAlt className="text-5xl text-blue-500" />
              <Typography
                variant="h6"
                className="mt-4 font-bold text-gray-800"
              >
                Track Your Location
              </Typography>
              <Typography className="mt-2 text-gray-600">
                Use our map integration to track your distance to the meeting
                point in real-time.
              </Typography>
            </Box>
          </Grid>

          {/* Feature 2 */}
          <Grid item xs={12} sm={4}>
            <Box className="flex flex-col items-center bg-gradient-to-r from-indigo-200 to-pink-200 p-8 rounded-lg shadow-md hover:scale-105 transition-transform">
              <FaComments className="text-5xl text-purple-500" />
              <Typography
                variant="h6"
                className="mt-4 font-bold text-gray-800"
              >
                Chat with Your Partner
              </Typography>
              <Typography className="mt-2 text-gray-600">
                Communicate with your meeting partner through an integrated
                chat system.
              </Typography>
            </Box>
          </Grid>

          {/* Feature 3 */}
          <Grid item xs={12} sm={4}>
            <Box className="flex flex-col items-center bg-gradient-to-r from-indigo-200 to-pink-200 p-8 rounded-lg shadow-md hover:scale-105 transition-transform">
              <FaUsers className="text-5xl text-pink-500" />
              <Typography
                variant="h6"
                className="mt-4 font-bold text-gray-800"
              >
                Plan Together
              </Typography>
              <Typography className="mt-2 text-gray-600">
                Choose meeting spots, set the time, and finalize plans all in
                one place.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Container maxWidth="lg" className="mt-16 text-center">
        <Typography
          variant="h4"
          className="font-bold text-gray-800 mb-8"
        >
          What You Will Say
          
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Box className="bg-gradient-to-r from-purple-200 to-pink-200 p-6 rounded-lg shadow-lg">
              <Typography className="text-gray-800 font-semibold">
                “Meeting Point made it so easy to catch up with my friends. The
                map feature is a lifesaver!”
              </Typography>
              {/* <Typography className="mt-2 text-gray-600">
                - Alex Johnson
              </Typography> */}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box className="bg-gradient-to-r from-purple-200 to-pink-200 p-6 rounded-lg shadow-lg">
              <Typography className="text-gray-800 font-semibold">
                “Loved how simple it is to schedule meetings. The chat feature
                is super convenient!”
              </Typography>
              {/* <Typography className="mt-2 text-gray-600">
                - Sarah Williams
              </Typography> */}
            </Box>
          </Grid>
        </Grid>
      </Container>

      <br></br>
      <br></br>
      

      {/* Footer Section */}
      <footer className="mt-16 py-8 bg-gradient-to-r from-blue-800 to-purple-900 text-white text-center">
        <Typography variant="h6" className="font-bold">
          Meeting Point
        </Typography>
        <Typography className="text-gray-300 mt-2">
          Your go-to platform for meeting scheduling. © 2025
        </Typography>
      </footer>
    </div>
  );
};

export default MainHome;
