import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your server URL

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Listen for incoming messages from the server
  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up the event listener on component unmount
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', message);  // Emit message to server
      setMessages((prevMessages) => [...prevMessages, message]); // Optionally update UI immediately
      setMessage(''); // Clear input field
    }
  };

  return (
    <Box sx={{ flex: 1, padding: '10px' }}>
      <List sx={{ maxHeight: '400px', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <ListItem key={index}>
            <ListItemText primary={msg} />
          </ListItem>
        ))}
      </List>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </Box>
    </Box>
  );
};

export default Chat;