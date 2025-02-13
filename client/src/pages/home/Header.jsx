import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { startTransition } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventIcon from '@mui/icons-material/EventNote';
import { signOut, getAuth } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Drawer from '@mui/material/Drawer';
import { Box, IconButton, Typography } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const auth = getAuth();
  const userData = JSON.parse(localStorage.getItem('user'));
  const name = userData?.fullName;
  const firebaseID = userData?.firebaseID;

  const [anchorAccount, setAnchorAccount] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [seenNotifications, setSeenNotifications] = useState(new Set(JSON.parse(localStorage.getItem('seenNotifications') || '[]')));

  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  const toggleAccountMenu = () => {
    setAnchorAccount((prev) => !prev);
  };

  const toggleDrawer = useCallback(
    async (open) => {
      setDrawerOpen(open);
      if (open && firebaseID) {
        try {
          const response = await axios.post(`http://localhost:3000/notifications/${firebaseID}`);
          setNotifications(response.data || []);
        } catch (error) {
          console.error('Failed to fetch notifications', error);
        }
      }
    },
    [firebaseID]
  );

  const handleNotificationClick = (index, notificationId) => {
    setSeenNotifications((prevSeen) => {
      const updatedSeen = new Set(prevSeen);
      updatedSeen.add(notificationId);
      localStorage.setItem('seenNotifications', JSON.stringify(Array.from(updatedSeen)));
      return updatedSeen;
    });
  };

  const handleNavigation = (path) => {
    startTransition(() => {
      navigate(path);
    });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('user');
        toast.success('You are logged out');
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
        toast.error('Failed to log out');
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setAnchorAccount(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Box
      component="header"
      className="mx-auto flex justify-between items-center px-4 py-2"
      sx={{
        width: '100%',
        height: '60px',
        padding: '0 20px',
      }}
    >
    <Link to="/" style={{ textDecoration: 'none' }}>
      <Typography
        variant="h5"
        className="text-white font-bold"
        style={{ fontSize: '2rem', fontWeight: 'bolder' }} 
      >
        MeetSpot
      </Typography>
    </Link>
      <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
      

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            '&:hover': { width: '140px' },
            width: '40px',
            overflow: 'hidden',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
            marginRight: '10px',
          }}
        >
          {/* <IconButton sx={{ color: '#ff65a3' }} onClick={() => handleNavigation('/events')}>
            <EventIcon />
          </IconButton> */}
          {/* <Typography
            variant="body1"
            sx={{
              whiteSpace: 'nowrap',
              color: '#ff65a3',
              fontWeight: 'bold',
              ml: '5px',
            }}
          >
            Events
          </Typography> */}
        </Box>

        {userData ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              backgroundColor: '#ff65a3',
              padding: '8px 12px',
              borderRadius: '8px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            ref={profileMenuRef}
          >
            <IconButton
              sx={{
                color: 'white',
                padding: '6px',
              }}
              onClick={toggleAccountMenu}
            >
              <AccountCircle fontSize="medium" />
            </IconButton>

            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'nowrap',
                color: 'white',
                fontWeight: 'bold',
                ml: '10px',
                fontSize: '16px',
                letterSpacing: '0.5px',
              }}
            >
              Hello, <span style={{ color: '#FFD700' }}>{name}</span>
            </Typography>

            {anchorAccount && (
              <div
                className="absolute right-0 mt-40 w-48 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-lg shadow-lg z-50"
                style={{
                  boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.25)',
                  borderRadius: '12px',
                }}
              >
                <div
                  onClick={() => handleNavigation('/profile/dashboard')}
                  className="flex items-center px-4 py-2 hover:bg-blue-600 cursor-pointer transition-colors duration-200 rounded-lg"
                >
                  <AccountCircle fontSize="small" className="mr-2" /> Profile
                </div>

                <div
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 hover:bg-blue-600 cursor-pointer transition-colors duration-200 rounded-lg"
                >
                  <LogoutIcon fontSize="small" className="mr-2" /> Logout
                </div>
              </div>
            )}
          </Box>
        ) : (
          <div className="space-x-4">
            <button
              className="bg-white text-pink-500 font-bold py-2 px-4 rounded-lg hover:bg-pink-500 hover:text-white transition duration-300 text-lg"
              onClick={() => handleNavigation('/auth/login')}
            >
              Login
            </button>
            <button
              className="bg-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-600 hover:text-white transition duration-300 text-lg"
              onClick={() => handleNavigation('/auth/register')}
            >
              Sign Up
            </button>
          </div>
        )}
      </Box>

      <Drawer anchor="right" open={isDrawerOpen} onClose={() => toggleDrawer(false)}>
        <Box sx={{ width: 300, padding: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Notifications
          </Typography>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <Box
                key={notification.id}
                sx={{
                  padding: 2,
                  backgroundColor: seenNotifications.has(notification.id) ? '#f4f4f4' : '#ffefef',
                  borderRadius: '8px',
                  marginBottom: 1,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#ffe6e6' },
                }}
                onClick={() => handleNotificationClick(index, notification.id)}
              >
                {notification.message}
              </Box>
            ))
          ) : (
            <Typography variant="body1">No notifications available.</Typography>
          )}
        </Box>
      </Drawer>

      <ToastContainer />
    </Box>
  );
};

export default Header;
