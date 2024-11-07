import React from 'react';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import dataHomes from "../../Data/dataHome";

const Sliderbar = () => {
  return (
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
        </div>
      </div>
    </Box>
  );
};

export default Sliderbar;
