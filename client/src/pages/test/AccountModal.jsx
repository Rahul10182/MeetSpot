import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Modal, TextField, List, ListItem, Avatar, Typography, InputAdornment, Button, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const AccountModal = ({ open, onClose, firebaseID, onSelectFriend }) => {
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (firebaseID) {
      axios
        .post('http://localhost:3000/friend/old', { firebaseID })
        .then((response) => {
          setFriends(response.data || []);
        })
        .catch((error) => {
          console.error('Error fetching friends:', error);
        });
    }
  }, [firebaseID]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFriend = (friend) => {
    onSelectFriend({
      userfirebaseId: firebaseID, // Current user ID
      friendfirebaseId: friend.firebaseID,
      fullName: friend.name,
      email: friend.email,
    });
    onClose(); 
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box 
        sx={{ 
          width: '90%',  
          maxWidth: '700px',  
          height: 'auto',
          maxHeight: '80vh',  
          padding: 4, 
          margin: 'auto', 
          backgroundColor: '#1a4d8f', 
          marginTop: '5%', 
          borderRadius: '10px',
          boxShadow: 24, 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Close button */}
        <IconButton
          sx={{ position: 'absolute', top: '10px', right: '10px', color: '#fff' }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" sx={{ color: '#fff', marginBottom: 3, textAlign: 'center' }}>
          Select a Friend
        </Typography>

        {/* Search Field */}
        <TextField
          variant="outlined"
          placeholder="Search friends..."
          value={searchQuery}
          onChange={handleSearch}
          fullWidth
          sx={{
            marginBottom: 2,
            backgroundColor: '#ffffff',
            borderRadius: '8px',
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: '#3498db' }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Friend List */}
        <Box 
          sx={{ 
            maxHeight: '50vh',  
            overflowY: 'auto', 
            backgroundColor: '#ffffff', 
            borderRadius: '8px', 
            padding: 2,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <List sx={{ padding: 0 }}>
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <ListItem
                  key={friend._id || friend.email}
                  sx={{ 
                    marginBottom: 1, 
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: '#3498db', 
                    color: '#fff',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: '#2980b9',
                    },
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {/* Friend Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      alt={friend.name?.charAt(0).toUpperCase() || 'A'}
                      sx={{ backgroundColor: '#fff', color: '#3498db' }}
                    />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {friend.name || 'Friend Name'}
                      </Typography>
                      <Typography variant="body2" color="#d1d1d1">
                        {friend.email || 'Email'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Add Button */}
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#fff', color: '#3498db', fontWeight: 'bold', borderRadius: '8px' }}
                    onClick={() => handleSelectFriend(friend)}
                  >
                    Add
                  </Button>
                </ListItem>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  No friends found
                </Typography>
              </Box>
            )}
          </List>
        </Box>
      </Box>
    </Modal>
  );
};

export default AccountModal;
