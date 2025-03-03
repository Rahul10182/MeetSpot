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
    <div className="bg-gradient-to-r bg-gray-50 min-h-screen flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-10 space-y-8">
        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button 
            variant="contained" 
            color="primary" 
            className="w-full sm:w-auto py-3 text-lg rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105" 
            sx={{ backgroundColor: '#3b82f6', '&:hover': { backgroundColor: '#2563eb' } }}
            onClick={() => navigate('/profile/friends/old')}
          >
            Friends
          </Button>

          <Button 
            variant="contained" 
            color="secondary" 
            className="w-full sm:w-auto py-3 text-lg rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105" 
            sx={{ backgroundColor: '#f97316', '&:hover': { backgroundColor: '#ea580c' } }}
            onClick={() => navigate('/profile/friends/new')}
          >
            Friend Request Received
          </Button>

          <Button 
            variant="contained" 
            color="success" 
            className="w-full sm:w-auto py-3 text-lg rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105" 
            sx={{ backgroundColor: '#34d399', '&:hover': { backgroundColor: '#10b981' } }}
            onClick={() => navigate('/profile/friends/sentreq')}
          >
            Friend Request Sent
          </Button>
        </div>

        {/* Content Area */}
        <div className="bg-gray-50 h-96 rounded-lg flex items-center justify-center shadow-inner">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FriendPage;
>>>>>>> origin/newanshul
