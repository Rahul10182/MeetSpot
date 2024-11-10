import React from 'react';
import { Button, Grid, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MeetSpace = () => {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{

        margin: { xs: '20px', sm: '30px', md: '60px', lg: '80px' },
        backgroundColor: '#f0f4f8',
        borderRadius: '12px',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        height: '100vh', // Make the box take full viewport height
        display: 'flex',
        flexDirection: 'column', // Use column direction for top and bottom sections
      }}
    >
      <Grid 
        container 
        spacing={2}
        sx={{
          flexGrow: 1, // This makes sure the grid stretches to fill the available space
        }}
      >
        {/* Upper Half (Ready to Connect + Set Meetup Location) */}
        <Grid
          item
          xs={12}
          md={6} // Use half of the height for this part
          className="flex items-center justify-center bg-indigo-600 text-white"
          sx={{ padding: { xs: '10px', md: '20px' } }}
        >
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/meeting-point')}
            sx={{
              fontWeight: 'bold',
              padding: '10px 20px',
              backgroundColor: '#ff5722', // Same color as the Meetup button
              '&:hover': { backgroundColor: '#e64a19' },
            }}
            fullWidth={{ xs: true, md: false }}
          >
            Set Meetup Location
          </Button>
        </Grid>

        {/* Lower Half (Want To Chat? + Chat Button) */}
        <Grid
          item
          xs={12}
          md={6} // Use the other half for the chat section
          className="flex items-center justify-center"
          sx={{
            padding: { xs: '10px', md: '20px' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            backgroundColor: '#388e3c', // Green background
            color: 'white', // White text color for contrast
            borderRadius: '12px', // Optional: Rounded corners for a modern look
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              mt: 6, // Adding margin-top for spacing
              textAlign: 'center',
            }}
          >
            Want To Chat?
          </Typography>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            sx={{ mt: 2 }}
          >
            <Button
              variant="contained"
              color="secondary" // Set color to secondary to match meetup button
              size="large"
              onClick={() => navigate('/chat')}
              sx={{
                fontWeight: 'bold',
                padding: '10px 20px',
                backgroundColor: '#ff5722', // Same color as the Meetup button
                '&:hover': { backgroundColor: '#e64a19' }, // Same hover effect
                width: { xs: '100%', md: 'auto' },
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              Chat
            </Button>
          </motion.div>
        </Grid>
      </Grid>

      {/* Right Side Section */}
      <Grid
        container
        spacing={2}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ mb: 2 }} // Margin bottom to add space below title
        >
          <Typography
            variant="h3"
            component="h1"
            color="primary"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.8rem', sm: '2.5rem' },
            }}
          >
            <Typewriter
              words={['Welcome to MeetSpot']}
              loop={false}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          sx={{ maxWidth: '80%' }} // Optional: max-width for better readability
        >
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ mt: 4, mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' }, lineHeight: 1.6 }}
          >
            MeetSpace provides a user-friendly platform where you can effortlessly schedule and manage
            your meetings. Whether you're planning team discussions, client presentations, or personal
            catch-ups, we've got you covered.
          </Typography>

          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mt: 2, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
          >
            Click the "Schedule Meeting" button to get started and experience seamless collaboration.
          </Typography>
        </motion.div>
      </Grid>
    </Box>
  );
};

export default MeetSpace;
