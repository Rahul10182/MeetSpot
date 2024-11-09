import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText } from '@mui/material';

const socket = io('http://localhost:3000');  // Initialize the socket connection

const ChatWindow = ({ userfirebaseId, friendfirebaseId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [chatId, setChatId] = useState("");

  useEffect(() => {
    if (userfirebaseId && friendfirebaseId) {
      axios.post('http://localhost:3000/api/v1/chat/get', { userfirebaseId, friendfirebaseId })
        .then(response => {
          console.log('Chat history response:', response.data);
          setMessages(response.data.lastMessage ? [response.data.lastMessage] : []);
          setChatId(response.data._id);  // Set chatId after fetching it from the backend
          socket.emit('joinChat', { chatId: response.data._id });  // Emit joinChat event with chatId
        })
        .catch(error => console.error('Error fetching chat history:', error));

      socket.on('newMessage', (msg) => {
        setMessages(prevMessages => [...prevMessages, msg]);  
      });

      return () => {
        socket.off('newMessage');  
      };
    }
  }, [userfirebaseId, friendfirebaseId]);

  const sendMessage = () => {
    if (message.trim()) {
      const msgObject = {
        chatId: chatId,
        senderId: userfirebaseId,
        content: message,
        timestamp: new Date()
      };

      socket.emit('chatMessage', msgObject); 
      setMessages(prevMessages => [...prevMessages, msgObject]);
      setMessage('');
    }
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ padding: 2, flex: '1 1 auto', overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>Chat</Typography>

        <List>
          {Array.isArray(messages) && messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'row', 
                justifyContent: msg.senderId === userfirebaseId ? 'flex-end' : 'flex-start', 
                marginBottom: 1, 
              }}
            >
              <Paper
                sx={{
                  padding: 1,
                  backgroundColor: msg.senderId === userfirebaseId ? '#e0f7fa' : '#fce4ec',
                  borderRadius: 2,
                  maxWidth: '70%', 
                  wordBreak: 'break-word',
                }}
              >
                <ListItemText
                  primary={msg.content}
                  secondary={new Date(msg.timestamp).toLocaleString()}
                />
              </Paper>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ padding: 2, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={sendMessage}>Send</Button>
      </Box>
    </Paper>
  );
};

export default ChatWindow;