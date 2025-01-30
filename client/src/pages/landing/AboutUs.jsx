import React from "react";
import { Container, Typography, Box } from "@mui/material";
import laptopI from "../../assests/laptop.jpg"
const AboutUs = () => {
  return (
    <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 min-h-screen flex items-center">
      <Container maxWidth="lg">
        {/* Hero Section */}
        

        {/* About Us Content */}
        <Box className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 shadow-2xl rounded-xl p-10 mx-auto">
          <Typography variant="h4" className="text-gray-800 font-bold text-center mb-8">
            About MeetSpot
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fadeIn">
            {/* Left Content */}
            <Box className="p-6 bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-50 rounded-lg shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl">
              <Typography 
                variant="h4" 
                className="text-indigo-700 font-bold mb-6 tracking-wider leading-snug animate-bounce">
                Make Every Meetup Memorable
              </Typography>
              <Typography 
                variant="body1" 
                className="text-gray-700 mb-4 text-justify leading-relaxed">
                At <span className="font-bold text-purple-600">MeetSpot</span>, we simplify the process of planning meetups. 
                Using smart technology, we help you find the most convenient and central location for meetings, such as:
              </Typography>
              <ul className="list-disc list-inside text-gray-600 space-y-3 pl-4">
                <li className="hover:text-purple-600 transform hover:translate-x-2 transition-all">
                  Cafes
                </li>
                <li className="hover:text-purple-600 transform hover:translate-x-2 transition-all">
                  Restaurants
                </li>
                <li className="hover:text-purple-600 transform hover:translate-x-2 transition-all">
                  Parks
                </li>
                <li className="hover:text-purple-600 transform hover:translate-x-2 transition-all">
                  Food Markets
                </li>
                <li className="hover:text-purple-600 transform hover:translate-x-2 transition-all">
                  Hotels
                </li>
                <li className="hover:text-purple-600 transform hover:translate-x-2 transition-all">
                  Malls
                </li>
              </ul>
            </Box>

            {/* Right Image */}
            <Box className="rounded-lg overflow-hidden shadow-lg transform hover:scale-110 hover:rotate-2 hover:shadow-2xl transition-all duration-500 relative">
              <img 
                src={laptopI} 
                alt="MeetSpot Laptop" 
                className="w-full animate-float rounded-lg"
              />
              {/* Decorative Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-500 to-transparent opacity-40 rounded-lg"></div>
            </Box>
          </div>


          {/* Mission Section */}
          <Box className="mt-10 bg-gradient-to-r from-indigo-100 to-blue-100 p-8 rounded-lg shadow-md">
            <Typography
              variant="h5"
              className="text-purple-700 font-semibold text-center mb-4"
            >
              Our Mission
            </Typography>
            <Typography variant="body1" className="text-gray-700 text-center">
              To help people make meaningful connections and experience unforgettable moments by
              simplifying the process of planning meetings and finding the perfect spots to connect.
            </Typography>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default AboutUs;
