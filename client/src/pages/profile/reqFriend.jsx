import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Avatar, IconButton, Typography } from '@mui/material';
import { CheckCircle, Delete, SentimentDissatisfied } from '@mui/icons-material';

const FriendRequest = () => {
  const [friends, setFriends] = useState([]);
  const userData = JSON.parse(localStorage.getItem('user'));
  const firebaseID = userData?.firebaseID;

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.post('http://localhost:3000/friend/new', { firebaseID });
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };

    fetchFriends();
  }, []); 

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
      {friends.length > 0 ? (
        friends.map((friend, index) => (
          <Card key={index} className="flex items-center mb-4 p-2">
            <Avatar alt={friend.name} className="mr-4" />
            <CardContent className="flex-1">
              <h3 className="text-lg font-medium">{friend.name}</h3>
              <p>{friend.email}</p>
            </CardContent>
            <div className="flex space-x-2">
              <IconButton color="success" aria-label="Approve">
                <CheckCircle />
              </IconButton>
              <IconButton color="error" aria-label="Delete">
                <Delete />
              </IconButton>
            </div>
          </Card>
        ))
      ) : (
        <div className="flex flex-col items-center text-gray-500">
          <SentimentDissatisfied style={{ fontSize: 50, marginBottom: 10 }} />
          <Typography variant="h6" className="mb-2">No Friend Requests</Typography>
          <Typography>You're all caught up! No new friend requests at the moment.</Typography>
        </div>
      )}
    </div>
  );
};

export default FriendRequest;
