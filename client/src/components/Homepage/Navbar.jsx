import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startTransition } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const [anchorAccount, setAnchorAccount] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleAccountMenuClick = (event) => {
    setAnchorAccount(anchorAccount ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorAccount(null);
  };

  const toggleDrawer = (open) => (event) => {
    setDrawerOpen(open);
  };

  const handleLogin = () => {
    startTransition(() => {
      navigate('/auth/login');
    });
  };
  const handleSignUp = () => {
    startTransition(() => {
      navigate('/auth/register');
    });
  };

  const categories = ['Music', 'Business', 'Dating', 'MeetUp'];

  return (
    <div className="fixed top-0 w-full z-50 bg-blue-900 text-white">
      <div className="flex items-center justify-between p-4">

        <button
          className="white-black focus:outline-none"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon fontSize="large" />
        </button>

        {/* Title centered */}
        <h6 className="flex-grow text-center text-2xl font-bold">
          MeetSpot
        </h6>

        {/* Search Bar */}
        <div className="flex-grow mx-4">
        <div className="relative flex items-center ">
            <input
              type="text"
              placeholder="Search…"
              className="bg-white text-black rounded p-2 flex-grow max-w-xs"  // Adjusted size
              style={{ marginRight: '0' }} // Remove right margin to prevent extra space
            />
            <button className=" text-white p-2 right-0  rounded ml-0 relative">  {/* Reduced margin */}
              <SearchIcon fontSize="medium" />
            </button>
          </div>

        </div>

        {/* Login Button */}
        <button
          className="bg-blue-700 text-white font-bold py-2 px-4 rounded hover:bg-pink-600 mr-4"
          onClick={handleLogin}
        >
          Login
        </button>
        <button
          className="bg-blue-700 text-white font-bold py-2 px-4 rounded hover:bg-pink-600 mr-4"
          onClick={handleSignUp}
        >
          SignUp
        </button>

        {/* Account icon */}
        <div>
          <button
            className="text-white focus:outline-none"
            onClick={handleAccountMenuClick}
          >
            <AccountCircle fontSize="large" />
          </button>
          {/* Account Menu (Dropdown) */}
          {anchorAccount && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
              <div onClick={handleClose} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Profile</div>
              <div onClick={handleClose} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Settings</div>
              <div onClick={handleClose} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Logout</div>
            </div>
          )}
        </div>
      </div>

      {/* Sell Drawer (Sidebar) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleDrawer(false)}>
          <div className=" fixed left-0 top-0 w-1/6 h-full bg-white p-4">
            <h6 className="text-lg font-bold">Sell Categories</h6>
            <ul className='w-full'>
              {categories.map((category, index) => (
                <li
                  key={index}
                  onClick="/{category}"
                  className="py-2 relative text-2xl hover:text-white text-center text-black hover:bg-blue-500 cursor-pointer"
                >
                  {category}
                  
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
