import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import homepageImage from '../../Data/homepage.png';
import Header from './Navbar';

const SliderBar = () => {
  return (
    <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-8">
      <Header className="absolute top-0 left-0 w-full z-10 mt-0" />
      <div className="relative flex items-center h-screen">
        <div className="flex-1 text-left p-8 pt-20"> {/* Add padding top to make room for the fixed header */}
          <h1 className="text-5xl font-bold text-white mb-4">
            Connect, Collaborate, and Meet Anywhere
          </h1>
          <p className="text-white text-lg mb-6">
            Easy location-based meeting spot suggestions for seamless connections.
          </p>
          {/* Wrap the button in Link for navigation */}
          <Link to="/meeting-point">
            <button className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-lg transition duration-300">
              Get Started
            </button>
          </Link>
        </div>

        <div className="flex-1 h-full flex justify-center items-center">
          <img
            src={homepageImage}
            alt="MeetSpot Map Illustration"
            className="object-contain max-h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SliderBar;
