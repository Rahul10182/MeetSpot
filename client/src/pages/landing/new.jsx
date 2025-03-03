import React from "react";
import { Container, Typography, Box, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import homepageImage from "../../Data/homepage.png";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";
import TouristPlaces from "./TouristPlaces";
import { Link as ScrollLink, Element } from "react-scroll";
import { useNavigate } from "react-router-dom";
import AboutUs from "./AboutUs";
import Footer from "../../components/Home/Footer";
import Header from "../home/Header";

const eventPhotos = [
  { name: "Concerts", src: "https://plus.unsplash.com/premium_photo-1681830630610-9f26c9729b75?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Festivals", src: "https://images.unsplash.com/photo-1728535196944-58deb0547cb3?q=80&w=2880&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Sports Events", src: "https://plus.unsplash.com/premium_photo-1684820878202-52781d8e0ea9?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Conferences", src: "https://plus.unsplash.com/premium_photo-1679547203090-6313a91d4478?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Workshops", src: "https://plus.unsplash.com/premium_photo-1677529496999-2739fa867abd?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Exhibitions", src: "https://images.unsplash.com/photo-1731200302205-db29cf05bd61?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Theater Shows", src: "https://images.pexels.com/photos/2372945/pexels-photo-2372945.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
  { name: "Food Festivals", src: "https://img.etimg.com/thumb/width-1600,height-900,imgsize-60751,resizemode-75,msid-50058151/industry/cons-products/food/food-festivals-are-hot-new-trend-in-the-metros-but-how-viable-is-the-business.jpg" },
  { name: "Music Events", src: "https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2020/02/06/Pictures/_24d141fc-48a1-11ea-b9ea-c2a424b98379.jpg" },
  { name: "Community Meetups", src: "https://cdn.prod.website-files.com/6384688c73b91edce99d8da1/65017d8a987ff646a3135723_Picture62.jpg" }
];

const MeetspotLandingPage = () => {
  const navigate  = useNavigate();

  const handleNavigation = (path) =>{
    navigate(path);
  }
  return (
    <div>
      {/* <Header className="absolute top-0 left-0 w-full z-10" /> */}

      {/* Hero Section */}
      {/* Hero Section */}
      <Box
        id="home"
        sx={{
          position: "relative",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(to right, #ec4899, #8b5cf6)",
          padding: 2,
          flexDirection: "column",
        }}
      >
        <Header className="absolute top-0 left-0 w-full z-10"></Header>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
            width: "100%",
          }}
        >
          <Box sx={{ flex: 1, padding: 4 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <Typography
                variant="h2"
                sx={{ fontWeight: "bold", color: "#fff", mb: 4 }}
              >
                Connect, Collaborate, and Meet Anywhere
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2 }}
            >
              <Typography variant="h6" sx={{ color: "#fff", mb: 6 }}>
                Easy location-based meeting spot suggestions for seamless
                connections.
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleNavigation("/home")}
                sx={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  backgroundColor: "#4f46e5",
                  ":hover": {
                    backgroundColor: "#4338ca",
                  },
                }}
              >
                Get Started
              </Button>
            </motion.div>
          </Box>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            sx={{ flex: 1, display: "flex", justifyContent: "center" }}
          >
            <img
              src={homepageImage}
              alt="MeetSpot Map Illustration"
              style={{
                maxHeight: "500px",
                width: "100%",
                objectFit: "contain",
              }}
            />
          </motion.div>
        </Box>
      </Box>
      

      {/* Events Section */}
      <Element name="events">
        <div className="bg-gray-100 py-20">
          <Container maxWidth="lg">
            <Typography variant="h3" className="text-center font-bold mb-10">
              Events You Can Join or Attend
            </Typography>
            <Grid container spacing={4}>
              {eventPhotos.map((event, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  >
                    <Box className="p-4 bg-white rounded-lg shadow-lg">
                      <img
                        src={event.src}
                        alt={event.name}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      <Typography variant="h6" className="font-semibold mt-4 text-center">
                        {event.name}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </div>
      </Element>

      {/* Tourist Places Section */}
      <Element name="touristPlaces">
          <TouristPlaces />
      </Element>

      <div>
            <AboutUs></AboutUs>
        </div>

      {/* Call to Action */}
        <Element name="cta">
          <div className="bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 h-screen flex flex-col justify-center items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="space-y-6"
            >
              {/* Heading */}
              <Typography
                variant="h3"
                className="text-white font-extrabold text-4xl md:text-5xl tracking-wide animate-bounce"
              >
                Ready to Meet?
              </Typography>

              {/* Subheading */}
              <Typography
                variant="body1"
                className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              >
                Discover the easiest way to organize meetups and find perfect locations. 
                Join us today to make every meetup memorable!
              </Typography>

              {/* Button */}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleNavigation("/auth/register")}
                className="rounded-full py-4 px-12 font-semibold text-lg text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 shadow-lg transform transition-all hover:scale-105"
              >
                Sign Up Now
              </Button>
            </motion.div>

            {/* Decorative Floating Elements */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="absolute top-10 left-10 w-16 h-16 bg-purple-600 rounded-full filter blur-lg opacity-50"
            ></motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="absolute bottom-20 right-20 w-24 h-24 bg-indigo-700 rounded-full filter blur-lg opacity-50"
            ></motion.div>
          </div>
        </Element>

        <Footer/>

    </div>
  );
};

export default MeetspotLandingPage;
