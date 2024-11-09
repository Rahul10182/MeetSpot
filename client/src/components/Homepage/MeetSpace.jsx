import React from 'react';
import { Button, Grid, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MeetSpace = () => {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{
        margin: { xs: '20px', sm: '30px', md: '60px', lg: '80px' }, // Margin for the entire page
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Grid 
        container 
        spacing={2}
        sx={{
          minHeight: '70vh', // Reduced height
        }}
      >
        {/* Left Side */}
        <Grid 
          item 
          xs={12} 
          md={4} 
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
              backgroundColor: '#ff5722',
              '&:hover': { backgroundColor: '#e64a19' },
            }}
            fullWidth={{ xs: true, md: false }}
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
          }}
        >
          {/* Animated Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h3"
              component="h1"
              color="primary"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                fontSize: { xs: '1.8rem', sm: '2.5rem' },
              }}
            >
              Welcome to MeetSpot
            </Typography>
          </motion.div>

          {/* Dynamic Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Typography 
              variant="body1" 
              color="textSecondary" 
              sx={{ mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}
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
