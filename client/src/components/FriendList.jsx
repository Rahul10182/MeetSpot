import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Avatar, Typography, Box, TextField ,InputAdornment} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const FriendList = ({ firebaseID, onFriendSelect }) => {
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (firebaseID) {
      axios
        .post('http://localhost:3000/friend/old', { firebaseID })
        .then((response) => {
          console.log('API response:', response.data);
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
    <div style={{ backgroundColor: '#1a4d8f', minHeight: '100vh', padding: '16px' }}>

    <Box >
      {/* Search Bar */}

        <div>
                  <button 
                onClick={() => navigate('/')}
                    className="text-center text-white h-20 text-3xl font-semibold mx-28 whitespace-nowrap transition-all duration-200 focus:outline-none"
                >
                    MeetSpot
                </button>
        </div>
                
      
        <TextField
            variant="outlined"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              marginBottom: 2,
              backgroundColor: '#ffffff', 
              width: '80%', 
              borderRadius: '8px',
              margin: '30px',  
              
              '& .MuiOutlinedInput-root': {
                height: 56,
                borderRadius: '8px', 
                border: '1px solid #3498db', 
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#3498db',
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


      <Box sx={{ 
          maxHeight: '60vh', 
          overflowY: 'auto', 
      }}>

      {/* Friends List */}
      <List>
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <ListItem
              button
              key={friend._id || friend.email}
              onClick={() =>
                onFriendSelect({
                  firebaseID: friend.firebaseID,
                  fullName: friend.name,
                  email: friend.email,
                })
              }
            >
              <div className="flex items-center gap-4 border cursor-pointer border-gray-300 w-full bg-[#3498db] text-white rounded-lg p-3 shadow-md">
                <Avatar
                  alt={friend.name?.charAt(0).toUpperCase() || 'A'}
                  className="bg-white text-[#3498db]"
                />

                <div className="flex flex-col">
                  <span className="text-lg font-medium">
                    {friend.name || 'Friend Name'}
                  </span>
                </div>
              </div>
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
    </div>
  );
};

export default FriendList;
