import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FriendList from '../components/FriendList';
import ChatWindow from '../components/ChatWindow';
import axios from 'axios';

const ChatPage = ({ firebaseId }) => {
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasFriends, setHasFriends] = useState(true);
  const [user, setUser] = useState(null);
  const [friendfirebaseId, setFriendfirebaseId] = useState(null);

  useEffect(() => {
    if (selectedFriendId) {
      axios.post('http://localhost:3000/api/v1/user/getfirebaseid', { selectedFriendId })
        .then(response => setFriendfirebaseId(response.data))
        .catch(error => console.error("Error fetching friend Firebase ID:", error));
    }
  }, [selectedFriendId]);

  useEffect(() => {
    if (firebaseId) {
      axios.post('http://localhost:3000/api/v1/user/getId', { firebaseId })
        .then(response => setUser(response.data))
        .catch(error => console.error("Error fetching user:", error));
    }
  }, [firebaseId]);

  useEffect(() => {
    if (firebaseId) {
      axios.get(`http://localhost:3000/api/v1/friends/${firebaseId}`)
        .then(response => setHasFriends(response.data.length > 0))
        .catch(error => console.error("Error fetching friends:", error));
    }
  }, [firebaseId]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid item xs={3} sx={{ borderRight: '1px solid #ddd' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}>
          <InputBase
            placeholder="Search friends..."
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ paddingLeft: 2 }}
          />
          <IconButton type="submit" sx={{ padding: '10px' }}>
            <SearchIcon />
          </IconButton>
        </Box>

        {hasFriends ? (
          <FriendList
            firebaseId={firebaseId}
            searchQuery={searchQuery}
            onFriendSelect={setSelectedFriendId}
          />
        ) : (
          <Box sx={{ textAlign: 'center', marginTop: 2 }}>
            <Typography variant="body2" color="textSecondary">You have no friends yet. Start adding friends!</Typography>
          </Box>
        )}
      </Grid>

      <Grid item xs={9}>
        {selectedFriendId ? (
          <ChatWindow userfirebaseId={firebaseId} friendfirebaseId={friendfirebaseId} />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="h5" color="textSecondary">
              Select a friend to start chatting
            </Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default ChatPage;