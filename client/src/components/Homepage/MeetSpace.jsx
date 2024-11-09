import React from 'react';
import { Button, Grid, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';

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
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          minHeight: '70vh',
        }}
      >
        {/* Left Side */}
        <Grid
          item
          xs={12}
          md={4}
          className="flex items-center justify-center bg-indigo-600 text-white"
          sx={{
            padding: { xs: '10px', md: '20px' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Ready to Connect?
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/meeting-point')}
            sx={{
              fontWeight: 'bold',
              padding: '10px 20px',
              backgroundColor: '#ff5722',
              '&:hover': { backgroundColor: '#e64a19' },
              width: { xs: '100%', md: 'auto' },
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            Set Meetup Location
          </Button>
        </Grid>

        {/* Right Side */}
        <Grid
          item
          xs={12}
          md={8}
          className="flex flex-col items-center justify-center px-4 py-10 bg-white"
          sx={{
            textAlign: 'center',
            padding: { xs: '16px', sm: '32px' },
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Animated Title with Typewriter Effect */}
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

          {/* Dynamic Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            sx={{ maxWidth: '80%' }} // Optional: max-width for better readability
          >
            
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ mt: 4 ,mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' }, lineHeight: 1.6 }}
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
      </Grid>
    </Box>
  );
};

export default MeetSpace;