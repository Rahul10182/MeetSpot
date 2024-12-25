import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LaptopImage from '../../Data/laptop.png';


const MeetSpace = () => {
  return (
<<<<<<< HEAD
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

        {/* Lower Half (Want To Chat? + Chat Button) */}
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

            backgroundColor: '#388e3c',
            color: 'white',
            borderRadius: '12px',

          }}
=======
    <div className="flex flex-col items-center w-full h-screen relative pt-16 pb-12">
      {/* Laptop Background */}
      <img
        src={LaptopImage}
        alt="Laptop Background"
        className="absolute w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />

      {/* Heading Section */}
      <div className="z-10 text-center mb-8 mt-24">
        <Typography
          variant="h4"
          component="div"
          className="font-bold text-gray-800"
          style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}
        >
          Welcome to MeetSpace
        </Typography>
        <Typography
          variant="body1"
          component="div"
          className="text-gray-600 mt-1"
          style={{ maxWidth: '500px', lineHeight: '1.5' }}
>>>>>>> origin/newanshul
        >
          Connect, chat, and collaborate with others in a vibrant and interactive space designed just for you.
        </Typography>
      </div>

<<<<<<< HEAD
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
          sx={{ mb: 2 }}
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
          sx={{ maxWidth: '80%' }}
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
=======
      {/* Cards Section */}
      <div className="flex justify-center items-center space-x-4 z-10 w-2/5 max-w-6xl">
        {/* Want to Meet Card */}
        <Card
          className="flex-1 bg-white bg-opacity-90 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300 p-4 max-h-80"
          style={{ background: 'linear-gradient(to right, #FF5722, #FF7043)' }}
        >
          <CardContent className="text-center space-y-4">
            <PeopleAltIcon fontSize="large" style={{ color: '#fff' }} />
            <Typography variant="h6" component="div" className="font-bold text-white">
              Want to Meet?
            </Typography>
            <Typography variant="body2" className="text-white">
              Connect with like-minded people in your area.
            </Typography>
            <Link to="/meeting-point">
              <Button
                variant="contained"
                color="error"
                className="mt-4"
                style={{ backgroundColor: '#FF5722', boxShadow: '0px 4px 10px rgba(255, 87, 34, 0.3)' }}
                startIcon={<LocationOnIcon />}
              >
                Set Meetup Location
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Want to Chat Card */}
        <Card
          className="flex-1 bg-white bg-opacity-90 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300 p-4 max-h-80"
          style={{ background: 'linear-gradient(to right, #FF9800, #FFB74D)' }}
        >
          <CardContent className="text-center space-y-4">
            <ChatBubbleOutlineIcon fontSize="large" style={{ color: '#fff' }} />
            <Typography variant="h6" component="div" className="font-bold text-white">
              Want to Chat?
            </Typography>
            <Typography variant="body2" className="text-white">
              Join a conversation and make new connections instantly.
            </Typography>
            <Link to="/chat">
              <Button
                variant="contained"
                color="warning"
                className="mt-4"
                style={{ backgroundColor: '#FF9800', boxShadow: '0px 4px 10px rgba(255, 152, 0, 0.3)' }}
                startIcon={<ChatBubbleOutlineIcon />}
              >
                Chat
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
>>>>>>> origin/newanshul
  );
};

export default MeetSpace;
