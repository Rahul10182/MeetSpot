import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Avatar, IconButton, Typography } from '@mui/material';
import { CheckCircle, Delete, SentimentDissatisfied } from '@mui/icons-material';

const FriendRequest = () => {
  const [friends, setFriends] = useState([]);
  const userData = JSON.parse(localStorage.getItem('user'));
  const firebaseID = userData?.firebaseID;

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await axios.post('http://localhost:3000/friend/new', { firebaseID });
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const handleApprove = async (userID) => {
    try {
      await axios.post('http://localhost:3000/friend/accept', { firebaseID1: firebaseID, firebaseID2: userID });
      fetchFriends();
    } catch (error) {
      console.error('Error approving friend request:', error);
    }
  };

  const handleReject = async (userID) => {
    try {
      await axios.post('http://localhost:3000/friend/reject', { firebaseID1: firebaseID, firebaseID2: userID });
      fetchFriends();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
      <Typography variant="h5" className="text-center font-semibold mb-4">
        Friend Requests
      </Typography>
      {friends.length > 0 ? (
        <div
          className="overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
          style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '8px' }}
        >
          {friends.map((friend, index) => (
            <Card key={index} className="flex items-center mb-4 p-2 shadow-sm hover:shadow-md transition-shadow duration-300">
              <Avatar alt={friend.name} className="mr-4" />
              <CardContent className="flex-1">
                <Typography variant="subtitle1" className="font-medium">
                  {friend.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {friend.email}
                </Typography>
              </CardContent>
              <div className="flex space-x-2">
                <IconButton
                  color="success"
                  aria-label="Approve"
                  onClick={() => handleApprove(friend.firebaseID)}
                >
                  <CheckCircle />
                </IconButton>
                <IconButton
                  color="error"
                  aria-label="Delete"
                  onClick={() => handleReject(friend.firebaseID)}
                >
                  <Delete />
                </IconButton>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-500">
          <SentimentDissatisfied style={{ fontSize: 50, marginBottom: 10 }} />
          <Typography variant="h6" className="mb-2">
            No Friend Requests
          </Typography>
          <Typography>
            You're all caught up! No new friend requests at the moment.
          </Typography>
        </div>
      )}
    </div>
  );
};

export default FriendRequest;