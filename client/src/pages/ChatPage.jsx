import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FriendList from '../components/FriendList';
import ChatWindow from '../components/ChatWindow';
import axios from 'axios';

const ChatPage = ({ firebaseID }) => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendFirebaseId, setFriendFirebaseId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasFriends, setHasFriends] = useState(true);
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    if (firebaseID) {
      axios.post('http://localhost:3000/api/v1/user/getId', { firebaseID })
        .then(response => setUser(response.data))
        .catch(error => console.error("Error fetching user:", error));
    }
  }, [firebaseID]);

  useEffect(() => {
    if (firebaseID) {
      axios.post('http://localhost:3000/friend/old', { firebaseID })
        .then(response => setHasFriends(response.data.length > 0))
        .catch(error => console.error("Error fetching friends:", error));
    }
  }, [firebaseID]);

  console.log(firebaseID);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  

  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid item xs={3} sx={{ borderRight: '1px solid #ddd' }}>
        {/* <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}>
          <IconButton type="submit" sx={{ padding: '10px' }}>
            <SearchIcon />
          </IconButton>
        </Box> */}

        {hasFriends ? (
          <FriendList
            firebaseID={firebaseID}
            searchQuery={searchQuery}
            onFriendSelect={setSelectedFriend}
            
          />
        ) : (
          <Box sx={{ textAlign: 'center', marginTop: 2 }}>
            <Typography variant="body2" color="textSecondary">You have no friends yet. Start adding friends!</Typography>
          </Box>
        )}
      </Grid>

      <Grid item xs={9}>
        {selectedFriend ? (
          <ChatWindow
            userfirebaseId={firebaseID}
            friendfirebaseId={selectedFriend.firebaseID}
            friendName={selectedFriend.fullName}
            friendEmail={selectedFriend.email}
          />
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
