import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startTransition } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut, getAuth } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Header = () => {

  const auth = getAuth();
  const user = auth.currentUser;
  const userData = JSON.parse(localStorage.getItem('user'));
  const name = userData?.fullName;

  const [anchorAccount, setAnchorAccount] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [errors , setErrors] = useState(false);

  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  const handleAccountMenuClick = (event) => {
    setAnchorAccount(anchorAccount ? null : event.currentTarget);
  };

  const toggleDrawer = (open) => (event) => {
    setDrawerOpen(open);
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

  const categories = ['Music', 'Business', 'Dating', 'MeetUp'];


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
    <div className="relative w-full z-50 bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg" style={{ marginTop: '0' }}>
      <div className="flex items-center justify-between p-3"> {/* Reduced padding from p-4 to p-3 */}

        <button className="focus:outline-none" onClick={toggleDrawer(true)}>
          <MenuIcon fontSize="medium" /> {/* Reduced font size */}
        </button>

        <button onClick={() => handleNavigation('/')} className="text-center text-3xl font-semibold mx-4 whitespace-nowrap transition-all duration-200 focus:outline-none">
          MeetSpot
        </button> {/* Made "MeetSpot" clickable to navigate to homepage */}

        <div className="flex items-center mr-4">
          {searchVisible && (
            <input
              type="text"
              placeholder="Search…"
              className="bg-transparent text-white border-b-2 border-white rounded-lg p-2 pl-8 pr-8 flex-grow max-w-xs transition duration-200 ease-in-out focus:outline-none"
              style={{ marginRight: '0.5rem' }}
            />
          )}
          <button
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 transition duration-300 focus:outline-none"
            onClick={() => setSearchVisible((prev) => !prev)}
          >
            <SearchIcon fontSize="medium" /> {/* Reduced font size */}
          </button>
        </div>

        {userData?(
          <div className="relative flex items-center" ref={profileMenuRef}>
            <button className="text-white focus:outline-none" onClick={handleAccountMenuClick}>
              <AccountCircle fontSize="medium" /> {/* Reduced font size */}
            </button>
            {anchorAccount && (
              <div className="absolute right-0 mt-40 w-40 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-lg z-50 transition-all duration-200 ease-in-out">
                <div onClick={() => handleNavigation('/profile/dashboard')} className="flex items-center px-4 py-2 hover:bg-blue-600 cursor-pointer transition-colors duration-200">

                  <AccountCircle fontSize="small" className="mr-2" /> Profile
                </div>
                <div onClick={() => handleNavigation('/auth/settings')} className="flex items-center px-4 py-2 hover:bg-blue-600 cursor-pointer transition-colors duration-200">
                  <SettingsIcon fontSize="small" className="mr-2" /> Settings
                </div>
                <div onClick={handleLogout} className="flex items-center px-4 py-2 hover:bg-blue-600 cursor-pointer transition-colors duration-200">
                  <LogoutIcon fontSize="small" className="mr-2" /> Logout
                </div>
              </div>
            )}
            <span className="text-lg mx-2">Hello, {name}</span>

          </div>
        ):(
          <div>
            <button className="bg-blue-600 text-white font-bold py-1 px-5 mx-4 rounded-lg hover:bg-pink-600 transition duration-300 mr-2 text-xl" onClick={() => handleNavigation('/auth/login')}>
              Login
            </button>

            <button className="bg-blue-600 text-white mx-4 font-bold py-1 px-5 rounded-lg hover:bg-pink-600 transition duration-300 text-xl" onClick={() => handleNavigation('/auth/register')}>
              
              SignUp
            </button>
          </div>
        )}
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleDrawer(false)}>
          <div className="fixed left-0 top-0 w-2/5 sm:w-1/4 md:w-1/6 h-full bg-white p-4">
            <h6 className="text-lg font-bold">Sell Categories</h6>
            <ul className='w-full'>
              {categories.map((category, index) => (
                <li key={index} onClick={() => handleNavigation(`/${category}`)} className="py-2 relative text-xl hover:text-white text-center text-black hover:bg-blue-600 cursor-pointer transition duration-300">
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
