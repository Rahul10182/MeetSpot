import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EventsBar = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/event/getall');
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 4,
        width: '100%',
      }}
    >
      <Typography
        variant="h3"
        align="center"
        fontWeight="bold"
        color="primary"
        gutterBottom
        sx={{ mb: 12, mt: 16 }}
      >
        Upcoming Events
      </Typography>

      <Box
        sx={{
          width: '100%',
          maxWidth: '800px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          pagination={{ clickable: true }}
          navigation
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          spaceBetween={30}
          style={{ width: '100%' }}
          breakpoints={{
            0: { slidesPerView: 1 },
            900: { slidesPerView: 3 },
          }}
        >
          {events.length > 0 ? (
            events.map((event) => (
              <SwiperSlide key={event._id}>
                <Link to="./events" style={{ textDecoration: 'none' }}>
                  <Card
                    sx={{
                      height: 450,
                      width: '100%',
                      maxWidth: '350px',
                      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      margin: '0 auto',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.3)',
                      },
                    }}
                  >
                    <Box
                      component="img"
                      sx={{
                        height: 240,
                        width: '100%',
                        objectFit: 'cover',
                      }}
                      src={
                        event.photoUrl ||
                        'https://via.placeholder.com/400x240?text=No+Image+Available'
                      }
                      alt={event.eventName}
                    />
                    <CardContent
                      // sx={{
                      //   display: 'flex',
                      //   flexDirection: 'column',
                      //   justifyContent: 'center',
                      //   alignItems: 'center',
                      //   height: '100%',
                      //   p: 3,
                      // }}
                    >
                      <Typography
                        variant="h6"
                        color="textPrimary"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ textAlign: 'center', mb: 2, marginBottom: '20px' }}
                      >
                        {event.eventName || 'Unnamed Event'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </SwiperSlide>
            ))
          ) : (
            <Typography
              variant="body1"
              align="center"
              sx={{
                p: 2,
                color: 'textSecondary',
                fontStyle: 'italic',
              }}
            >
              No events available.
            </Typography>
          )}
        </Swiper>
      </Box>
    </Box>
  );
};

export default EventsBar;
