import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Avatar, Typography, Box } from '@mui/material';

const FriendList = ({ firebaseID, searchQuery, onFriendSelect }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (firebaseID) {
      console.log(firebaseID)
      axios.post(`http://localhost:3000/friend/old`, {firebaseID})
        .then(response => {
          console.log("API response:", response.data); 
          setFriends(response.data || []);
        })
        .catch(error => {
          console.error("Error fetching friends:", error);
        });
    }
  }, [firebaseID]);

  const filteredFriends = friends.filter(friend =>
    friend.friend.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("Filtered friends:", filteredFriends); 

  return (
    <List>
      {filteredFriends.length > 0 ? (
        filteredFriends.map(friend => (
          <ListItem
            button={true.toString()}
            key={friend.friend._id}
            onClick={() => onFriendSelect(friend.friend._id)}
          >
            <Avatar>{friend.friend.fullName.charAt(0)}</Avatar>
            <ListItemText primary={friend.friend.fullName} secondary={friend.friend.email} />
          </ListItem>
        ))
      ) : (
        <Box sx={{ textAlign: 'center', marginTop: 2 }}>
          <Typography variant="body2" color="textSecondary">No friends found</Typography>
        </Box>
      )}
    </List>
  );
};

export default FriendList;