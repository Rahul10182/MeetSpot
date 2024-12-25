import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText, CircularProgress, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Namebar from './Namebar';

const socket = io('http://localhost:3000');  // Initialize the socket connection

const ChatWindow = ({ userfirebaseId, friendfirebaseId, friendName, friendEmail }) => {
  console.log(userfirebaseId);
  console.log(friendfirebaseId);
  console.log(friendName);
  console.log(friendEmail);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [chatId, setChatId] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (userfirebaseId && friendfirebaseId) {
      axios.post('http://localhost:3000/api/v1/chat/get', { userfirebaseId, friendfirebaseId })
        .then(response => {
          setMessages(response.data.messages || []);
          setChatId(response.data._id);
          socket.emit('joinChat', { chatId: response.data._id });
        })
        .catch(error => console.error('Error fetching chat history:', error));

      socket.on('newMessage', (msg) => {
        setMessages(prevMessages => [...prevMessages, msg]);
      });

      socket.on('typing', ({ chatId: typingChatId, isTyping }) => {
        if (typingChatId === chatId) {
          setTypingIndicator(isTyping);
        }
      });

      return () => {
        socket.off('newMessage');
        socket.off('typing');
      };
    }
  }, [userfirebaseId, friendfirebaseId, chatId]);

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', { chatId, isTyping: true });
    }
    setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing', { chatId, isTyping: false });
    }, 1000);
  };

  const sendMessage = () => {
    if (message.trim()) {
      setIsSending(true);
      const msgObject = {
        chatId: chatId,
        senderId: userfirebaseId,
        content: message,
        timestamp: new Date()
      };

      socket.emit('chatMessage', msgObject);
      setMessages(prevMessages => [...prevMessages, msgObject]);
      setMessage('');
      setIsSending(false);
    }
  };

  return (
    <Paper
      elevation={5}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f3ec78, #af4261)',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <Namebar friendName={friendName} friendEmail={friendEmail} />

      <Box
        sx={{
          padding: 2,
          flex: '1 1 auto',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 200px)',
          background: '#fefefe',
        }}
      >
        <List>
          {Array.isArray(messages) &&
            messages.map((msg, index) => {
              const isUserMessage = msg.senderId === userfirebaseId;
              return (
                <ListItem
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: isUserMessage ? 'flex-end' : 'flex-start',
                    marginBottom: 1,
                  }}
                >
                  <Paper
                    sx={{
                      padding: 2,
                      borderRadius: 3,
                      maxWidth: '70%',
                      wordBreak: 'break-word',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                      animation: 'fadeIn 0.5s',
                      background: isUserMessage
                        ? 'linear-gradient(135deg, #8e44ad, #3498db)'
                        : 'linear-gradient(135deg, #f1c40f, #e74c3c)',
                      color: '#fff',
                    }}
                  >
                    <ListItemText
                      primary={msg.content}
                      secondary={new Date(msg.timestamp).toLocaleString()}
                      sx={{
                        textAlign: isUserMessage ? 'right' : 'left',
                      }}
                    />
                  </Paper>
                </ListItem>
              );
            })}
          {typingIndicator && (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontStyle: 'italic', marginLeft: 2 }}
            >
              {friendName} is typing...
            </Typography>
          )}
        </List>
      </Box>

      <Box
        sx={{
          padding: 2,
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          background: '#fefefe',
          borderTop: '1px solid #ddd',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={message}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#fff',
              borderRadius: 20,
            },
          }}
        />
        <Button
          variant="contained"
          onClick={sendMessage}
          sx={{
            borderRadius: '50%',
            minWidth: 50,
            minHeight: 50,
            background: 'linear-gradient(135deg, #8e44ad, #3498db)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(135deg, #3498db, #8e44ad)',
            },
          }}
        >
          {isSending ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <SendIcon />}
        </Button>
        <Button
          variant="text"
          sx={{
            borderRadius: '50%',
            minWidth: 50,
            minHeight: 50,
            background: '#f3f3f3',
            '&:hover': {
              background: '#ddd',
            },
          }}
        >
          <AttachFileIcon />
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatWindow;