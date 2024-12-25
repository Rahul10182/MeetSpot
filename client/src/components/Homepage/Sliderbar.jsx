import React from 'react';
<<<<<<< HEAD
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import dataHomes from "../../Data/dataHome";
=======
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import homepageImage from '../../Data/homepage.png';
import Header from './Navbar';
>>>>>>> origin/newanshul

const SliderBar = () => {
  return (
<<<<<<< HEAD
    <Box sx={{ p: 8, bgcolor: 'linear-gradient(to right, #e3f2fd, #bbdefb)' }} className=" ">
      <Typography
        variant="h3"
        align="center"
        fontWeight="bold"
        color="primary"
        gutterBottom
      >
        Explore Meeting Places
      </Typography>
      <div className=' w-full'>
        <div className=' px-10'>
      <Swiper
        modules={[Pagination, Navigation]}
        pagination={{ clickable: true }}
        navigation
        loop
        spaceBetween={30}
        slidesPerView={1}
        style={{ padding: '20px 0' }}
        
      >
        {dataHomes.map((place) => (
          <SwiperSlide key={place.id}>
            <Card
              sx={{
                height: 500, // Adjusted card height
                boxShadow: 4,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': { transform: 'scale(1.05)' },
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                component="img"
                sx={{
                  height: 400, // Reduced image height
                  width: '100%',
                  objectFit: 'cover',
                  borderRadius: '4px 4px 0 0',
                }}
                src={place.imgSrc}
                alt={place.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="h5" component="div" color="textPrimary" gutterBottom>
                      {place.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {place.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ borderRadius: '20px', mt: 2 }}
                      className='hover:bg-pink-600'
                    >
                      Let’s MeetUp
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <br></br>

          </SwiperSlide>
        ))}
      </Swiper>
=======
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
>>>>>>> origin/newanshul
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Sliderbar;
=======
export default SliderBar;
>>>>>>> origin/newanshul
