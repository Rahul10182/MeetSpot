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
    <div className="flex flex-col items-center w-full h-screen relative pt-16 pb-12">
      <img
        src={LaptopImage} 
        alt="Laptop Background"
        className="absolute w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />

      <div className="z-10 text-center mb-8 mt-24">
        <Typography variant="h4" component="div" className="font-bold text-gray-800" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}>
          Welcome to MeetSpace
        </Typography>
        <Typography variant="body1" component="div" className="text-gray-600 mt-1" style={{ maxWidth: '500px', lineHeight: '1.5' }}>
          Connect, chat, and collaborate with others in a vibrant and interactive space designed just for you.
        </Typography>
      </div>

      <div className="flex space-x-4 z-10 mt-6">
        <Card className="flex-1 max-w-xs bg-white bg-opacity-90 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300 p-4"
          style={{ background: 'linear-gradient(to right, #FF5722, #FF7043)' }}>
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

        <Card className="flex-1 max-w-xs bg-white bg-opacity-90 rounded-xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300 p-4"
          style={{ background: 'linear-gradient(to right, #FF9800, #FFB74D)' }}>
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
  );
};

export default MeetSpace;
