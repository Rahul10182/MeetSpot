import React from 'react';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import dataHomes from "../../Data/dataHome";

const Sliderbar = () => {
  return (
    <Box sx={{ p: 8, bgcolor: 'linear-gradient(to right, #e3f2fd, #bbdefb)' }}>
      <Typography
        variant="h3"
        align="center"
        fontWeight="bold"
        color="primary"
        gutterBottom
      >
        Explore Meeting Places
      </Typography>
      <div className="w-full">
        <div className="px-10">
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            pagination={{ clickable: true }}
            navigation
            loop
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            spaceBetween={30}
            slidesPerView={1}
            style={{ padding: '20px 0' }}
          >
            {dataHomes.map((place) => (
              <SwiperSlide key={place.id} style={{ overflow: 'visible' }}>
                <Card
                  sx={{
                    height: 450, // Initial card height
                    width: '85%', // Initial card width
                    maxWidth: '85%', // Initial max width for responsiveness
                    boxShadow: 4,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.12)', // Scale up to around 95% of window width
                      maxWidth: '95vw', // Limit to 95% of viewport width
                      zIndex: 2,
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    margin: 'auto',
                  }}
                >
                  <Box
                    component="img"
                    sx={{
                      height: 300, // Adjusted image height
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
                          className="hover:bg-pink-600"
                        >
                          Let’s MeetUp
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <br />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </Box>
  );
};

export default Sliderbar;