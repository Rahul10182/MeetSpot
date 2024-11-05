import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../store/user-slice/userSlice';
import { Avatar, Typography, Divider, AppBar, Toolbar, Card } from '@mui/material';
import { Settings, AccountBalance, Notifications, Person } from '@mui/icons-material';

const UserDashboard = ({ userId }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const username = "Aryan";

    useEffect(() => {
        dispatch(fetchUser(userId));
    }, [dispatch, userId]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 md:flex-row">
            <aside className="w-full md:w-64 bg-gradient-to-b from-indigo-600 to-purple-600 text-white shadow-lg p-6 flex-shrink-0">
                <div className="text-center mb-8">
                    <Avatar className="mx-auto mt-8" alt={user.name} src="/static/images/avatar/1.jpg" sx={{ width: 64, height: 64 }} />
                    <Typography variant="h6" className="font-semibold mt-4">
                        {user.name}
                    </Typography>
                    <Typography variant="body2" className="text-indigo-200">
                        {user.email}
                    </Typography>
                </div>
                <Divider className="my-4 border-t-2 opacity-80" style={{ borderColor: 'white' }} />
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <div className="flex items-center p-3 rounded-lg font-bold text-white hover:bg-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
                                <AccountBalance className="mr-3" />
                                <span>Dashboard</span>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center p-3 rounded-lg font-bold text-white hover:bg-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
                                <Person className="mr-3" />
                                <span>Friends</span>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center p-3 rounded-lg font-bold text-white hover:bg-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
                                <Notifications className="mr-3" />
                                <span>Notifications</span>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center p-3 rounded-lg font-bold text-white hover:bg-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
                                <Settings className="mr-3" />
                                <span>Settings</span>
                            </div>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="flex-1 p-4 md:p-8">
                <AppBar position="static" className="bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
                    <Toolbar className="flex justify-between items-center px-6">
                        <Typography variant="h6" className="text-white font-semibold">
                            Hi, {username}
                        </Typography>
                        <div className="flex items-center space-x-3">
                            <Avatar alt={username} src="/static/images/avatar/1.jpg" />
                            <Typography variant="body1" className="text-white font-semibold">
                                {username}
                            </Typography>
                            <Notifications className="text-white cursor-pointer" />
                            <Settings className="text-white cursor-pointer" />
                        </div>
                    </Toolbar>
                </AppBar>
                <div className="mt-8 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="flex-1 bg-white rounded-lg shadow-md p-4">
                        <div className="text-center">
                            <div className="relative w-24 h-24 mx-auto bg-pink-500 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5z" /></svg>
                            </div>
                            <div className="mt-4">
                                <h1 className="text-xl font-semibold text-pink-500">Your Name</h1>
                                <p className="text-gray-400">yourname@amail.com</p>
                                <p className="text-gray-700 mt-2">
                                    <span className="font-semibold">Developer</span> | <span className="font-semibold">Designer</span>
                                </p>
                            </div>
                            <div className="flex justify-center space-x-4 mt-4 text-pink-500">
                     
                            </div>
                            <div className="bg-pink-500 text-white mt-4 py-3 rounded-b-lg">
                                <p className="text-sm">120k Followers | 10k Following</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:w-1/2 space-y-4">
                        <Card className="bg-blue-100 rounded-lg shadow-md p-4">
                            <Typography variant="h6" className="font-semibold">Small Card 1</Typography>
                            <Typography variant="body2">This is a smaller card.</Typography>
                        </Card>
                        <Card className="bg-green-100 rounded-lg shadow-md p-4">
                            <Typography variant="h6" className="font-semibold">Small Card 2</Typography>
                            <Typography variant="body2">This is another smaller card.</Typography>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
