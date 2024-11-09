import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

const Namebar = ({ friendName, friendEmail }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',  
        backgroundColor: '#1a4d8f', 
        color: 'white',
       
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',  
        height: '50px', 
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'white', color: '#3498db', fontSize: '18px' }}>
          {friendName?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: '500', 
              fontSize: '16px', 
            }}
          >
            {friendName || 'Friend'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',  
              fontSize: '12px',  
            }}
          >
            {friendEmail || 'No email available'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Namebar;
