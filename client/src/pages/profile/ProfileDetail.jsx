import React, { useState ,useEffect,useRef} from 'react';
import {
    Avatar, Typography, TextField, Divider, AppBar, Toolbar,
    List, ListItem, ListItemText, ListItemIcon, Card, CardContent, Button,InputAdornment
} from '@mui/material';
import { Settings, Dashboard, Notifications, AccountCircle, Event,Search } from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const name = userData?.fullName;
    const email = userData?.email;
    const firebaseID1 = userData?.firebaseID;
    const navigate = useNavigate();

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
        console.log(userId)
        console.log(firebaseID1)

    
        try {
            const response = await axios.post('http://localhost:3000/friend/sendreq', {
                firebaseID1: firebaseID1,
                firebaseID2: userId       
            });
            
            if (response.status === 201) {
                console.log(`Friend request sent to user with ID: ${userId}`);
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

    
    return (
        <div className="min-h-screen flex bg-blue-300 relative">
            <aside className="w-64 bg-gradient-to-b from-indigo-600 to-purple-500 text-white shadow-lg p-6">
                <div className="text-center mb-8">

                <button 
                    onClick={() => navigate('/')} 
                    className="text-center text-3xl font-semibold mx-4 whitespace-nowrap transition-all duration-200 focus:outline-none"
                >
                    MeetSpot
                </button>
                <br></br>
                <br></br>
                <br></br>
                <br></br>

                </div>
                <Divider className="my-4 border-indigo-400" />
                <nav>
                    <List className=' cursor-pointer'>
                        {[{ text: 'Dashboard', icon: <Dashboard />, path: '/profile/dashboard' },
                          { text: 'Friends', icon: <AccountCircle />, path: '/profile/friends/old' },
                          { text: 'Notifications', icon: <Notifications />, path: '/profile/notifications' },
                          { text: 'Create Event', icon: <Event />, path: '/profile/createevent' },
                          { text: 'Settings', icon: <Settings />, path: '/profile/settings' }]
                          .map((item, index) => (
                            <ListItem
                                button
                                key={index}
                                className="mb-2 rounded-lg hover:bg-indigo-700 transition duration-150 ease-in-out"
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

            <main className="flex-1 p-8">
                <AppBar position="static" color="transparent" elevation={0} className="bg-blue-500 shadow-sm mb-6">
                    <Toolbar className="flex justify-between">
                        <div>
                        {/* <Avatar
                            className="mx-auto mb-4 bg-pink-500"
                            alt={name}
                            src="/static/images/avatar/1.jpg"
                            sx={{ width: 72, height: 72 ,backgroundColor: '#FFB6C1'}}
                            
                        /> */}
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
                            {/* <Avatar alt={name} src="/static/images/avatar/1.jpg" /> */}
                            
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
            </main>
        </div>
    );
};

export default UserDashboard;
