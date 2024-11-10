import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { startTransition } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventIcon from '@mui/icons-material/EventNote';
import { signOut, getAuth } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Drawer from '@mui/material/Drawer';
import 'react-toastify/dist/ReactToastify.css';


const Header = () => {

  const auth = getAuth();
  const user = auth.currentUser;
  const userData = JSON.parse(localStorage.getItem('user'));
  const name = userData?.fullName;
  const firebaseID = userData?.firebaseID;
  // console.log(firebaseID);

  const [anchorAccount, setAnchorAccount] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [seenNotifications, setSeenNotifications] = useState(new Set(JSON.parse(localStorage.getItem('seenNotifications') || '[]')));

  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  const handleAccountMenuClick = (event) => {
    setAnchorAccount(anchorAccount ? null : event.currentTarget);
  };

  const toggleDrawer = useCallback(
    async (open) => {
      setDrawerOpen(open);
      if (open && firebaseID) {
        try {
          const response = await axios.post(`http://localhost:3000/notifications/${firebaseID}`);
          console.log(response.data);
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

        toast.success('You are Logged out');

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
        setAnchorAccount(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full z-50 bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
      <div className="flex items-center justify-between p-3">
        <button
          onClick={() => handleNavigation('/')}
          className="text-center text-3xl font-semibold whitespace-nowrap transition-all duration-200 focus:outline-none mr-4"
        >
          MeetSpot
        </button> {/* Made "MeetSpot" clickable to navigate to homepage */}

        {/* Search Bar aligned slightly left from center
        <div className="flex items-center flex-grow mx-80 ">
          {searchVisible && (
            <input
              type="text"
              placeholder="Search…"
              className="bg-transparent text-white border-b-2 border-white rounded-lg p-2 pl-8 pr-8 max-w-xs transition duration-200 ease-in-out focus:outline-none"
              style={{ marginRight: '0.5rem' }}
            />
          )}
          <button
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 transition duration-300 focus:outline-none"
            onClick={() => setSearchVisible((prev) => !prev)}
          >
            <SearchIcon fontSize="medium" />
          </button>
        </div> */}

        {/* Notification, Events, and User's name */}
        <div className="flex items-center space-x-4 ml-4">
          <button
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 transition duration-300 focus:outline-none"
            onClick={() => toggleDrawer(!isDrawerOpen)}
          >
            <NotificationsIcon fontSize="medium" />
          </button>

          <button
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 transition duration-300 focus:outline-none"
            onClick={() => handleNavigation('/events')}
          >
            <EventIcon fontSize="medium" />
          </button>

          {/* User name and account icon */}
          {userData ? (
            <div className="relative flex items-center ml-4" ref={profileMenuRef}>
              <span className="text-lg mx-2 whitespace-nowrap overflow-hidden text-ellipsis">{`Hello, ${name}`}</span>
              <button
                className="text-white focus:outline-none"
                onClick={handleAccountMenuClick}
              >
                <AccountCircle fontSize="medium" />
              </button>
              {anchorAccount && (
                <div className="absolute right-0 mt-40 w-40 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-lg z-50 transition-all duration-200 ease-in-out">
                  <div
                    onClick={() => handleNavigation('/profile/dashboard')}
                    className="flex items-center px-4 py-2 hover:bg-blue-600 cursor-pointer transition-colors duration-200"
                  >
                    <AccountCircle fontSize="small" className="mr-2" /> Profile
                  </div>
                  <div
                    onClick={() => handleNavigation('/auth/settings')}
                    className="flex items-center px-4 py-2 hover:bg-blue-600 cursor-pointer transition-colors duration-200"
                  >
                    <SettingsIcon fontSize="small" className="mr-2" /> Settings
                  </div>
                  <div
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 hover:bg-blue-600 cursor-pointer transition-colors duration-200"
                  >
                    <LogoutIcon fontSize="small" className="mr-2" /> Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <button
                className="bg-blue-600 text-white font-bold py-1 px-5 mx-4 rounded-lg hover:bg-pink-600 transition duration-300 mr-2 text-xl"
                onClick={() => handleNavigation('/auth/login')}
              >
                Login
              </button>
              <button
                className="bg-blue-600 text-white mx-4 font-bold py-1 px-5 rounded-lg hover:bg-pink-600 transition duration-300 text-xl"
                onClick={() => handleNavigation('/auth/register')}
              >
                SignUp
              </button>
            </div>
          )}
        </div>
      </div>
    

      {/* Notifications Drawer */ }
      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="w-80 p-4">
          <h2 className="text-lg font-semibold mb-4 text-center">Notifications</h2>
          <ul className="overflow-y-auto max-h-96">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <li
                  key={notification._id}
                  className={`p-2 border-b border-gray-300 last:border-b-0 ${
                    seenNotifications.has(notification._id) ? 'bg-green-200' : ''
                  }`}
                  onClick={() => handleNotificationClick(index, notification._id)}
                >
                  {notification.message}
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">No new notifications</p>
            )}
          </ul>
          <button
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition duration-300"
            onClick={() => setDrawerOpen(false)}
          >
            Close
          </button>
        </div>
      </Drawer>

      <ToastContainer />
    </div >
  );
};

export default Header;
