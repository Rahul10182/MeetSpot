import React from 'react';
import { Container, Typography, Box } from '@mui/material';
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
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-pink-500 to-purple-500">

      <Sliderbar />
      <MeetSpace className='h-screen'/>
      <Container maxWidth="lg" >
        

        <Box mb={6}>
          <EventSlider className='h-screen w-full'/>
        </Box>
      </Container>

      <Footer />
    </div>
  );
};

export default Home;
