<<<<<<< HEAD
import React from 'react';
import { Button } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';

const FriendPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-blue-300 min-h-screen flex justify-center items-center p-8">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-around mb-8">
          <Button 
            variant="contained" 
            color="primary" 
            className="w-1/3 py-3 text-lg" 
            sx={{ backgroundColor: '#3b82f6', '&:hover': { backgroundColor: '#2563eb' } }}
            onClick={() => navigate('/profile/friends/old')}
          >
            Friends
          </Button>

          <Button 
            variant="contained" 
            color="secondary" 
            className="w-1/3 py-3 text-lg" 
            sx={{ backgroundColor: '#f97316', '&:hover': { backgroundColor: '#ea580c' } }}
            onClick={() => navigate('/profile/friends/new')}
          >
            Friend Request Received
          </Button>

          <Button 
            variant="contained" 
            color="success" 
            className="w-1/3 py-3 text-lg" 
            sx={{ backgroundColor: '#34d399', '&:hover': { backgroundColor: '#10b981' } }}
            onClick={() => navigate('/profile/friends/sentreq')}
          >
            Friend Request Sent
          </Button>
        </div>

        <div className="bg-gray-50 h-96 rounded-lg flex items-center justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FriendPage;
=======
import React from 'react';
import { Button } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';

const FriendPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-pink-200 to-pink-400 min-h-screen flex justify-center items-center p-8">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-around mb-8">
          <Button 
            variant="contained" 
            color="primary" 
            className="w-1/3 py-3 text-lg" 
            sx={{ backgroundColor: '#3b82f6', '&:hover': { backgroundColor: '#2563eb' } }}
            onClick={() => navigate('/profile/friends/old')}
          >
            Friends
          </Button>

          <Button 
            variant="contained" 
            color="secondary" 
            className="w-1/3 py-3 text-lg" 
            sx={{ backgroundColor: '#f97316', '&:hover': { backgroundColor: '#ea580c' } }}
            onClick={() => navigate('/profile/friends/new')}
          >
            Friend Request Received
          </Button>

          <Button 
            variant="contained" 
            color="success" 
            className="w-1/3 py-3 text-lg" 
            sx={{ backgroundColor: '#34d399', '&:hover': { backgroundColor: '#10b981' } }}
            onClick={() => navigate('/profile/friends/sentreq')}
          >
            Friend Request Sent
          </Button>
        </div>

        <div className="bg-gray-50 h-96 rounded-lg flex items-center justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FriendPage;
>>>>>>> origin/newanshul
