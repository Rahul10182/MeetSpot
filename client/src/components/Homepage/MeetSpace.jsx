import React from 'react';
import { Button, Grid, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';

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
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          flexGrow: 1,
        }}
      >

        <Grid
          item
          xs={12}
          md={6}
          className="flex items-center justify-center bg-indigo-600 text-white"
          sx={{ padding: { xs: '10px', md: '20px' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              mt: 6,
              textAlign: 'center',
            }}
          >
            Want To Meet?
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
            }}
          >
            Set Meetup Location
          </Button>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          className="flex items-center justify-center bg-[#4caf50] text-white"
          sx={{
            padding: { xs: '10px', md: '20px' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              mt: 6,
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
              color="secondary"
              size="large"
              onClick={() => navigate('/chat')}
              sx={{
                fontWeight: 'bold',
                padding: '10px 20px',
                backgroundColor: '#ff5722',
                '&:hover': { backgroundColor: '#e64a19' },
                width: { xs: '100%', md: 'auto' },
              }}
            >
              Chat
            </Button>
          </motion.div>
        </Grid>
      </Grid>

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
          sx={{ mb: 2 }}
        >
          <Typography
            variant="h3"
            component="h1"
            color="primary"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.8rem', sm: '2.5rem' },
              textAlign: 'center', 
            }}
          >
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString('Welcome to MeetSpot')
                  .start();
              }}
              options={{
                loop: false,
                delay: 75, 
              }}
            />
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ maxWidth: '80%' }} 
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
        </motion.div>
      </Grid>
    </Box>
  );
};

export default MeetSpace;