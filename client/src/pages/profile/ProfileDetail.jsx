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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar with gradient background */}
      <aside className="w-64 bg-gradient-to-b from-indigo-600 to-purple-600 text-white shadow-lg p-6">
        <div className="text-center mb-16">
          <Avatar className="mx-auto mt-12" alt={user.name} src="/static/images/avatar/1.jpg" sx={{ width: 64, height: 64 }} />
          <Typography variant="h6" className="font-semibold mt-4">
            {user.name}
          </Typography>
          <Typography variant="body2" className="text-indigo-200">
            {user.email}
          </Typography>
        </div>
        <Divider style={{ borderColor: 'white', opacity: 0.8 }} className="my-4 border-t-2" />
        <nav>
          <ul className="space-y-4 mt-24">
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

      <main className="flex-1 p-8">
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
        <div className="mt-8 flex flex-col space-y-4">
          <div className="flex flex-grow bg-gray-200 rounded-lg shadow-lg p-4">
            {/* Left Card */}
            <div className="flex-1 bg-white rounded-lg shadow-md p-4 h-full">
              <div className="flex h-full">
                <div className="w-1/2 flex flex-col justify-center">
                  <img 
                    src="https://via.placeholder.com/150" 
                    alt="Default" 
                    className="w-full h-1/3 object-cover rounded-lg" 
                  />
                  <Typography variant="h5" className="font-semibold mt-2">Card Title</Typography>
                  <Typography variant="body2">This is a description of the card.</Typography>
                </div>
                <div className="w-1/2 flex flex-col justify-between p-4">
                  <div>
                    <Typography variant="h6" className="font-semibold">Friends</Typography>
                    <Divider className="my-2" />
                    {/* Dummy friends */}
                    <div className="flex space-x-4">
                      <Typography variant="body2">Friend 1</Typography>
                      <Typography variant="body2">Friend 2</Typography>
                      <Typography variant="body2">Friend 3</Typography>
                    </div>
                  </div>
                  <Typography variant="body2" className="mt-4">This is a dummy paragraph with some placeholder text.</Typography>
                </div>
              </div>
            </div>
            
            {/* Right Cards */}
            <div className="flex flex-col justify-between space-y-4 w-1/3 pl-4">
              <Card className="bg-blue-100 rounded-lg shadow-md p-4 h-1/2">
                <Typography variant="h6" className="font-semibold">Small Card 1</Typography>
                <Typography variant="body2">This is a smaller card.</Typography>
              </Card>
              <Card className="bg-green-100 rounded-lg shadow-md p-4 h-1/2">
                <Typography variant="h6" className="font-semibold">Small Card 2</Typography>
                <Typography variant="body2">This is another smaller card.</Typography>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
