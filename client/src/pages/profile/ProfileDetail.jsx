import React, { useState } from 'react';
import {
    Avatar, Typography, TextField, Divider, AppBar, Toolbar,
    List, ListItem, ListItemText, ListItemIcon, Card, CardContent, Button
} from '@mui/material';
import { Settings, Dashboard, Notifications, AccountCircle, Event } from '@mui/icons-material';
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

    const handleAddFriend = (userId) => {
        console.log(`Added friend with ID: ${userId}`);
    };

    return (
        <div className="min-h-screen flex bg-gray-50 relative">
            <aside className="w-64 bg-gradient-to-b from-indigo-600 to-purple-600 text-white shadow-lg p-6">
                <div className="text-center mb-8">
                    <Avatar
                        className="mx-auto mb-4"
                        alt={name}
                        src="/static/images/avatar/1.jpg"
                        sx={{ width: 72, height: 72 }}
                    />
                    <Typography variant="body1" className="font-medium text-sm">
                        {name || "Anonymous"}
                    </Typography>
                    <Typography variant="body2" className="text-indigo-200">
                        {email}
                    </Typography>
                </div>
                <Divider className="my-4 border-indigo-400" />
                <nav>
                    <List>
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
                <AppBar position="static" color="transparent" elevation={0} className="bg-white shadow-sm mb-6">
                    <Toolbar className="flex justify-between">
                        <Typography variant="h5" className="font-semibold text-gray-800">
                            Welcome, {name || "User"}
                        </Typography>
                        <div className="flex items-center space-x-4 relative">
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Search for people"
                                className="bg-gray-100 rounded-full"
                                value={searchQuery}
                                onChange={handleSearchChange} 
                                InputProps={{
                                    startAdornment: <span className="material-icons text-gray-400 ml-2"></span>,
                                }}
                            />
                            <Avatar alt={name} src="/static/images/avatar/1.jpg" />
                            
                            {searchResults.length > 0 && (
                                <div className="absolute left-0 right-0 bg-white shadow-lg mt-72 rounded-md z-10 max-h-60 overflow-y-auto w-full sm:w-80">
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
                                                    onClick={() => handleAddFriend(user._id)}
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
