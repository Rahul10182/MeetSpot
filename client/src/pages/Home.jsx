import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Navbar from "../components/Homepage/Navbar";
import Sliderbar from '../components/Homepage/Sliderbar';
import Footer from '../components/Homepage/Footer';
import { getAuth } from 'firebase/auth';
import Cards from '../components/Homepage/Cards';
import MeetSpace from '../components/Homepage/MeetSpace';
import EventSlider from '../components/event/EventSlider';


const Home = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <Sliderbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* MeetSpace Section */}
        <Box mb={6}>
          <MeetSpace />
        </Box>

        <Box mb={6}>
          <EventSlider/>
        </Box>


        {/* Welcome Message */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" gutterBottom>
            Welcome to Meeting Point
          </Typography>
          <Typography variant="body1">
            Connecting people for meaningful meetings and conversations.
          </Typography>
        </Box>

        {/* Travel Section */}
        <Box mb={6} textAlign="center">
          <Typography variant="h4" color="textSecondary" gutterBottom>
            There Are Some Beautiful Places In INDIA
          </Typography>
          <Cards />
        </Box>
      </Container>

      <Footer />
    </div>
  );
};

export default Home;
