import React, { useState, useEffect, useRef } from 'react';
import {
<<<<<<< HEAD
    Avatar, Typography, TextField, Divider, AppBar, Toolbar,
    List, ListItem, ListItemText, ListItemIcon, Card, CardContent, Button, InputAdornment
} from '@mui/material';
import { Settings, Dashboard, Notifications, AccountCircle, Event, Search, LocationOn } from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
=======
    Avatar, Typography, TextField, Divider, AppBar, Toolbar, IconButton,
    List, ListItem, ListItemText, ListItemIcon, Card, CardContent, Button, InputAdornment
} from '@mui/material';
import { CalendarToday, Settings, Dashboard, Notifications, AccountCircle, Event, Search, LocationOn } from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
>>>>>>> anshul4
import axios from 'axios';

const UserDashboard = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const name = userData?.fullName;
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const searchRef = useRef(null);

    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim()) {
            try {
                const response = await axios.post('http://localhost:3000/search', { email: query });
                setSearchResults(response.data.users);
            } catch (error) {
                console.error('Error searching for people:', error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleAddFriend = async (userId) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const firebaseID1 = currentUser?.firebaseID;

        try {
            const response = await axios.post('http://localhost:3000/friend/sendreq', {
                firebaseID1: firebaseID1,
<<<<<<< HEAD
                firebaseID2 : userId
=======
                firebaseID2: userId
>>>>>>> anshul4
            });

            if (response.status === 201) {
                console.log(`Friend request sent to user with ID: ${userId}`);
<<<<<<< HEAD
                // Optionally remove user from searchResults after adding
=======
>>>>>>> anshul4
                setSearchResults(prevResults => prevResults.filter(user => user._id !== userId));
            } else {
                console.log(`Failed to send friend request: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchQuery('');
                setSearchResults([]);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const showHeader = ['/profile/dashboard', '/profile/friends/old'].includes(currentPath);

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-r from-pink-400 to-pink-400 p-6 text-white flex flex-col shadow-xl rounded-xl">
                <div className="text-center mb-8">
                    <button onClick={() => navigate('/home')} className="text-3xl font-extrabold hover:text-pink-200 transition-colors">
                        MeetSpot
                    </button>
                </div>
                <Divider className="my-4 border-white" />
                <nav className="flex-1">
                    <List>
                        {[{ text: 'Dashboard', icon: <Dashboard />, path: '/profile/dashboard' },
                          { text: 'Friends', icon: <AccountCircle />, path: '/profile/friends/old' },
                          { text: 'Notifications', icon: <Notifications />, path: '/profile/notifications' },
<<<<<<< HEAD
                          { text: 'Create Event', icon: <Event />, path: '/profile/createevent' },
                          { text: 'Venues', icon: <LocationOn />, path: '/profile/venues' }]
=======
                          { text: 'Create Event', icon: <Event />, path: '/profile/Event/create' },
                          { text: 'Meetings', icon: <CalendarToday />, path: '/profile/show-meet/user' }]
>>>>>>> anshul4
                          .map((item, index) => (
                              <ListItem
                                  button
                                  key={index}
                                  className={`px-4 py-2 rounded-lg hover:bg-pink-700 hover:bg-opacity-30 transition-all ${currentPath === item.path ? 'bg-pink-700 bg-opacity-40' : ''}`}
                                  onClick={() => navigate(item.path)}
                              >
                                  <ListItemIcon className="text-white">
                                      {item.icon}
                                  </ListItemIcon>
                                  <ListItemText primary={item.text} className="text-white font-semibold" />
                              </ListItem>
                          ))}
                    </List>
                </nav>
            </aside>

<<<<<<< HEAD
            <main className="flex-1 p-8">
                <AppBar position="static" color="transparent" elevation={0} className="bg-blue-500 shadow-sm mb-6">
                    <Toolbar className="flex justify-between">
                        <div>
                        <Typography variant="h5" className="font-semibold text-blue-800">
                            Welcome, {name || "User"}
                        </Typography>
                        
                        </div>
                        <div className="flex items-center space-x-4 relative" ref={searchRef}>
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Search for friend"
                                className="bg-gray-100 rounded w-80"
                                value={searchQuery}
                                onChange={handleSearchChange} 
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search className="text-gray-400" />
                                        </InputAdornment>
                                    ),
                                }}

                            />
                            
                            {searchResults.length > 0 && (
                                <div className="absolute left-0 right-0 bg-white shadow-lg mt-72 rounded-md z-10 max-h-60 overflow-y-auto w-72 sm:w-80">
                                    {searchResults.map((user) => (
                                        <Card key={user._id} className="mb-2">
                                            <CardContent>
                                                <Typography variant="h6">{user.fullName}</Typography>
                                                <Typography variant="body2">{user.email}</Typography>
                                                <Button 
                                                    variant="contained" 
                                                    color="primary" 
                                                    fullWidth 
                                                    className="mt-2"
                                                    onClick={() => handleAddFriend(user.fireBaseId)}
                                                >
                                                    Add Friend
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Toolbar>
                </AppBar>

                <Outlet />
=======
            {/* Main Content */}
            <main className={`flex-1 p-8 ${showHeader ? 'pt-16' : ''} bg-gray-100 rounded-xl`}>
                {showHeader && (
                    <AppBar position="static" color="transparent" elevation={0} className="sticky top-0 z-10">
                        <Toolbar className="flex justify-between p-4">
                            <Typography variant="h5" className="font-bold text-pink-600">
                                Welcome, {name || "User"}
                            </Typography>
                            <div className="ml-auto relative w-1/4" ref={searchRef}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    placeholder="Search for friend"
                                    className="w-full bg-white rounded-lg shadow-lg"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search className="text-gray-500" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {searchResults.length > 0 && (
                                    <div className="absolute top-12 left-0 right-0 bg-white shadow-xl rounded-lg max-h-72 overflow-y-auto z-10">
                                        {searchResults.map((user) => (
                                            <Card key={user._id} className="mb-4 hover:scale-105 transition-transform ease-in-out duration-300 shadow-lg">
                                                <CardContent>
                                                    <Typography variant="h6" className="font-semibold">{user.fullName}</Typography>
                                                    <Typography variant="body2" className="text-gray-600">{user.email}</Typography>
                                                    <Button 
                                                        variant="contained" 
                                                        color="primary" 
                                                        fullWidth 
                                                        className="mt-4"
                                                        onClick={() => handleAddFriend(user.fireBaseId)}
                                                    >
                                                        Add Friend
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Toolbar>
                    </AppBar>
                )}

                <div className="px-4 py-6">
                    <Outlet />
                </div>
>>>>>>> anshul4
            </main>
        </div>
    );
};

export default UserDashboard;
