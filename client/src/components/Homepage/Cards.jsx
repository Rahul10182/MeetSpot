import React from 'react';
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import statesData from "../../Data/dataEvents";

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const Cards = () => {

  const slides = chunkArray(statesData, 4);

  return (
    <div style={{ padding: '20px' }}>

      <div style={{ marginBottom: '30px' }}>
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Pagination, Navigation]}
          style={{ padding: '40px' }}
        >
          {slides.map((group, index) => (
            <SwiperSlide key={index}>
              <Grid container spacing={2}>
                {group.map((city, idx) => (
                  <Grid item xs={3} key={idx}>
                    <Card sx={{ 
                      height: 310, 
                      position: 'relative',
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', 
                      transition: 'transform 0.3s ease', 
                      '&:hover': { 
                        transform: 'scale(1.05)', 
                        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
                      }
                    }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={city.image}
                        alt={city.name}
                      />
                      <CardContent sx={{ height: 110, textAlign: 'center' }}>
                        <Typography variant="h6">{city.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Capital of {city.state}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </div>
  );
};

export default Cards;
