import React from 'react';
import { Box, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatWindow from '../../components/ChatWindow';  // Import the ChatWindow component

const RightSidebar = ({ showChat, toggleChat, selectedFriend }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        right: 0,
        top: 0,
        width: '400px',
        height: '100vh',
        backgroundColor: '#fff',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        transform: showChat ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        zIndex: 1000,
      }}
    >
      <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
          <h3>Chat</h3>
          <IconButton onClick={() => {
            toggleChat();
          }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Render the chat window for the selected friend */}
        {selectedFriend ? (
          <ChatWindow
            userfirebaseId={selectedFriend.userfirebaseId}
            friendfirebaseId={selectedFriend.friendfirebaseId}
            friendName={selectedFriend.fullName}
            friendEmail={selectedFriend.email}
          />
        ) : (
          <p style={{ padding: '20px' }}>Select a friend to start chatting.</p>
        )}
      </Paper>
    </Box>
  );
};

export default RightSidebar;
