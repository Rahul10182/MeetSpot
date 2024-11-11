import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = ({ toggleChat, toggleSidebar }) => {
  return (
    <Box
      component="header"
      className="bg-white shadow-md mx-auto flex justify-between items-center px-4 py-2 mt-4 mb-4"
      sx={{
        width: '80%',
        backgroundColor: '#f089cc',
        height: '80px',
        borderRadius: '30px',
        padding: '0 20px',
        transition: 'background-color 0.3s ease',
        '&:hover': {
          background: 'linear-gradient(90deg, #ff7eb9, #ff65a3)',
        },
      }}
    >
      <Typography variant="h5" className="text-white font-bold">
        MeetSpot
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            '&:hover': { width: '120px' },
            width: '40px',
            overflow: 'hidden',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
            marginRight: '10px',
          }}
        >
          <IconButton onClick={toggleChat} sx={{ color: '#ff65a3' }}>
            <ChatBubbleIcon />
          </IconButton>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'nowrap',
              color: '#ff65a3',
              fontWeight: 'bold',
              ml: '5px',
            }}
          >
            Chat
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            '&:hover': { width: '140px' },
            width: '40px',
            overflow: 'hidden',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
          }}
        >
          <IconButton sx={{ color: '#ff65a3' }}>
            <AccountCircleIcon />
          </IconButton>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'nowrap',
              color: '#ff65a3',
              fontWeight: 'bold',
              ml: '5px',
            }}
          >
            Account
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;