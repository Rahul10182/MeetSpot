import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, CardContent, Avatar, IconButton, Typography, 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button 
} from '@mui/material';
import { Message, Delete, SentimentVeryDissatisfied } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const userData = JSON.parse(localStorage.getItem('user'));
  const firebaseID = userData?.firebaseID;
  const navigate = useNavigate();

  const fetchFriends = async () => {
    try {
      const response = await axios.post('http://localhost:3000/friend/old', { firebaseID });
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleDeleteClick = (friend) => {
    setSelectedFriend(friend);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedFriend) {
      try {
        await axios.post('http://localhost:3000/friend/delete', { firebaseID1: firebaseID, firebaseID2: selectedFriend.firebaseID });

        await fetchFriends();
        
        setOpenDialog(false);
        setSelectedFriend(null);
      } catch (error) {
        console.error('Error deleting friend:', error);
      }
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedFriend(null);
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <Card key={index} className="flex items-center mb-4 p-2">
              <Avatar alt={friend.name} className="mr-4" />
              <CardContent className="flex-1">
                <h3 className="text-lg font-medium">{friend.name}</h3>
                <p>{friend.email}</p>
              </CardContent>
              <div className="flex space-x-2">
                <IconButton color="primary" aria-label="Message" onClick={() => navigate('/chat')}>
                  <Message />
                </IconButton>
                <IconButton color="error" aria-label="Delete" onClick={() => handleDeleteClick(friend)}>
                  <Delete />
                </IconButton>
              </div>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <SentimentVeryDissatisfied style={{ fontSize: 50, marginBottom: 10 }} />
            <Typography variant="h6" className="mb-2">No friends yet</Typography>
            <Typography>Looks a bit lonely here... maybe try sending some friend requests!</Typography>
          </div>
        )}
      </div>

      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedFriend?.name} from your friend list?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FriendList;
