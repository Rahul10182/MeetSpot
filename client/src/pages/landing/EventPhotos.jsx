import React from "react";
import Typewriter from "typewriter-effect";
import { Container, Typography, Box, Grid } from "@mui/material";
import { motion } from "framer-motion";

// Sample event data
const eventPhotos = [
  { name: "Concerts", src: "https://plus.unsplash.com/premium_photo-1681830630610-9f26c9729b75?q=80&w=2940&auto=format&fit=crop" },
  { name: "Festivals", src: "https://images.unsplash.com/photo-1728535196944-58deb0547cb3?q=80&w=2880&auto=format&fit=crop" },
  { name: "Sports Events", src: "https://plus.unsplash.com/premium_photo-1684820878202-52781d8e0ea9?q=80&w=2942&auto=format&fit=crop" },
  { name: "Conferences", src: "https://plus.unsplash.com/premium_photo-1679547203090-6313a91d4478?q=80&w=2942&auto=format&fit=crop" },
  { name: "Workshops", src: "https://plus.unsplash.com/premium_photo-1677529496999-2739fa867abd?q=80&w=2940&auto=format&fit=crop" },
  { name: "Exhibitions", src: "https://images.unsplash.com/photo-1731200302205-db29cf05bd61?q=80&w=2874&auto=format&fit=crop" },
  { name: "Theater Shows", src: "https://images.pexels.com/photos/2372945/pexels-photo-2372945.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
  { name: "Food Festivals", src: "https://img.etimg.com/thumb/width-1600,height-900,imgsize-60751,resizemode-75,msid-50058151/industry/cons-products/food/food-festivals.jpg" },
];

const Events = () => {
  return (
    <Container maxWidth="lg" className="py-20 relative">
      {/* Decorative Background */}
      <Box className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 opacity-30 blur-3xl" />

      {/* Title Section */}
      <Typography
        variant="h3"
        align="center"
        className="text-pink-500 font-bold mb-6 relative"
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typewriter
            options={{
              strings: [
                "Various Types Of Events Based On Your Interest",
                "Concerts",
                "Festivals",
                "Sports Events",
              ],
              autoStart: true,
              loop: true,
              delay: 75,
              cursor: "|",
            }}
          />
        </motion.div>
      </Typography>

      {/* Events Grid */}
      <Box className="overflow-auto max-h-[600px] py-4">
        <Grid container spacing={4}>
          {eventPhotos.map((event, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 2 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Box className="p-4 bg-white rounded-xl shadow-xl hover:shadow-2xl transform transition-transform duration-300">
                  {/* Event Image */}
                  <motion.img
                    src={event.src}
                    alt={event.name}
                    className="w-full h-40 object-cover rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Event Name */}
                  <Typography
                    variant="h6"
                    className="font-semibold mt-4 text-center text-purple-700"
                  >
                    {event.name}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer Animation */}
      <Box className="mt-10 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <Typography variant="body1" className="text-gray-600">
            Discover your next favorite event and make unforgettable memories!
          </Typography>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Events;
