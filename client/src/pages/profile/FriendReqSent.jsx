import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Avatar, IconButton, Typography } from '@mui/material';
import { Delete, SentimentDissatisfied } from '@mui/icons-material';

const FriendRequestSent = () => {
  const [friends, setFriends] = useState([]);
  const userData = JSON.parse(localStorage.getItem('user'));
  const firebaseID = userData?.firebaseID;

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await axios.post('http://localhost:3000/friend/sentreq', { firebaseID });
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const handleReject = async (user2ID) => {
    console.log(user2ID)
    console.log(firebaseID)
    try {
      await axios.post('http://localhost:3000/friend/reject', { firebaseID2: firebaseID, firebaseID1: user2ID });
      fetchFriends();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
      {friends.length > 0 ? (
        <div className="overflow-y-auto" style={{ maxHeight: '250px' }}>
          {friends.map((friend, index) => (
            <Card key={index} className="flex items-center mb-4 p-2">
              <Avatar alt={friend.name} className="mr-4" />
              <CardContent className="flex-1">
                <h3 className="text-lg font-medium">{friend.name}</h3>
                <p>{friend.email}</p>
              </CardContent>
              <IconButton color="error" aria-label="Reject" onClick={() => handleReject(friend.firebaseID1)}>
                <Delete />
              </IconButton>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-500">
          <SentimentDissatisfied style={{ fontSize: 50, marginBottom: 10 }} />
          <Typography variant="h6" className="mb-2">No Sent Friend Requests</Typography>
          <Typography>You haven't sent any friend requests yet.</Typography>
        </div>
      )}
    </div>
  );
};

export default FriendRequestSent;
