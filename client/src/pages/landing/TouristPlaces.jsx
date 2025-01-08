import React, { useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";

const touristPlaces = [
  { name: "Taj Mahal", description: "A symbol of love in Agra.", src: "https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
  { name: "Jaipur", description: "The Pink City of India.", src: "https://travelogyindia.wordpress.com/wp-content/uploads/2018/12/pink-city-jaipur-min-1.jpg" },
  { name: "Goa", description: "Beaches and vibrant nightlife.", src: "https://www.ibef.org/assets/images/states/goa-2.jpg" },
  { name: "Kerala", description: "God's own country.", src: "https://media.easemytrip.com/media/Blog/India/637598691713888246/637598691713888246OjaZ2J.jpg" },
  { name: "Delhi", description: "The heart of India.", src: "https://images.pexels.com/photos/1542620/pexels-photo-1542620.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Mumbai", description: "The city that never sleeps.", src: "https://media.istockphoto.com/id/539018660/photo/taj-mahal-hotel-and-gateway-of-india.jpg?s=612x612&w=0&k=20&c=L1LJVrYMS8kj2rJKlQMcUR88vYoAZeWbYIGkcTo6QV0=" },
  { name: "Rajasthan", description: "Land of kings and palaces.", src: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/fc/f9/rajasthan.jpg?w=1200&h=700&s=1" },
  { name: "Himachal Pradesh", description: "Abode of snow.", src: "https://plus.unsplash.com/premium_photo-1661905692737-e075ebc940e8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Kolkata", description: "City of joy.", src: "https://www.holidayrider.com/wp-content/uploads/2018/11/compressed-rkt1.jpg" },
  { name: "Pondicherry", description: "A French colonial settlement.", src: "https://images.unsplash.com/photo-1597073642928-48c0971f7ded?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
];

const TouristPlaces = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % touristPlaces.length);
    }, 7000); // Change image every 7 seconds for slower animation
    return () => clearInterval(interval);
  }, []);

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 2.5, ease: "easeOut" } }, // Slower animation
  };

  return (
    <div className="relative flex min-h-screen">
      {/* Left Section: "Famous Places" title */}
      <Box className="w-2/5 flex flex-col justify-center items-start p-10 bg-black text-white">
        <Typography variant="h2" className="font-bold text-white">
          <Typewriter
            options={{
              strings: ["Famous Places"],
              autoStart: true,
              loop: true,
              delay: 75,
            }}
          />
        </Typography>
      </Box>

      {/* Right Section: Tourist Place Image and Details */}
      <Container className="w-3/5 relative flex justify-center items-center">
        {/* Background Image */}
        <motion.div
          key={index}
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${touristPlaces[index].src})`,
            filter: "brightness(70%)",
          }}
          initial="hidden"
          animate="visible"
          variants={variants}
        />

        {/* Place Details */}
        <Box className="relative z-10 text-center p-4 text-white w-full bottom-0 left-0  mb-10">
          <Typography
            variant="h3"
            className="font-bold"
            style={{ fontSize: "2.5rem" }}
          >
            {touristPlaces[index].name}
          </Typography>
          <Typography
            variant="h6"
            className="mt-4"
            style={{ fontSize: "1.2rem" }}
          >
            {touristPlaces[index].description}
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default TouristPlaces;