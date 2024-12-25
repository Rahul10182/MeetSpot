import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  List,
  ListItem,
  Avatar,
  Typography,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const FriendList = ({ firebaseID, onFriendSelect }) => {
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (firebaseID) {
      axios
        .post('http://localhost:3000/friend/old', { firebaseID })
        .then((response) => {
          setFriends(response.data || []);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching friends:', error);
          setIsLoading(false);
        });
    }
  }, [firebaseID]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredFriends = friends
    .filter((friend) =>
      friend.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aMatch = a.name.toLowerCase().startsWith(searchQuery.toLowerCase());
      const bMatch = b.name.toLowerCase().startsWith(searchQuery.toLowerCase());
      return bMatch - aMatch;
    });

  return (
    <Box
      sx={{
        backgroundColor: '#1a4d8f',
        minHeight: '100vh',
        padding: '16px',
        color: '#fff',
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
        <button
          onClick={() => navigate('/')}
          style={{
            fontSize: '2rem',
            color: '#fff',
            fontWeight: 'bold',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          MeetSpot
        </button>
      </Box>

      {/* Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search friends..."
        value={searchQuery}
        onChange={handleSearch}
        sx={{
          marginBottom: 2,
          backgroundColor: '#ffffff',
          width: '100%',
          borderRadius: '8px',
          '& .MuiOutlinedInput-root': {
            height: 56,
            borderRadius: '8px',
          },
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
      <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {isLoading ? (
          <Box sx={{ textAlign: 'center', marginTop: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <Card
              key={friend._id || friend.email}
              onClick={() =>
                onFriendSelect({
                  firebaseID: friend.firebaseID,
                  fullName: friend.name,
                  email: friend.email,
                })
              }
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#3498db',
                color: '#fff',
                borderRadius: 2,
                marginBottom: 2,
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: '#ffffff',
                  color: '#3498db',
                  margin: 1,
                }}
              >
                {friend.name?.charAt(0).toUpperCase() || 'A'}
              </Avatar>
              <CardContent>
                <Typography variant="h6">{friend.name || 'Friend Name'}</Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', marginTop: 4 }}>
            <Typography variant="body2" color="textSecondary">
              No friends found
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FriendList;
