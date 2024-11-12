import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EventsBar = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

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

  const handleMoreDetailsClick = () => {
    navigate('/events');
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        // overflow: 'hidden',
        bgcolor: 'linear-gradient(to right, #e3f2fd, #bbdefb)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', // Center everything vertically
        p: 4,
      }}
    >
      <Typography
        variant="h3"
        align="center"
        fontWeight="bold"
        color="primary"
        gutterBottom
        sx={{ mb: 4 }}
      >
        Upcoming Events
      </Typography>

      <Box
        sx={{
          width: '100%',
          maxWidth: '800px', // Set the maximum width for the card container
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // Center the Swiper horizontally
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
            600: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
          }}
        >
          {events.length > 0 ? (
            events.map((event) => (
              <SwiperSlide key={event._id}>
                <Card
                  sx={{
                    height: 450,
                    width: '100%',
                    maxWidth: '350px', // Limit individual card width
                    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    margin: '0 auto', // Center align cards in each slide
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
                      backgroundColor: '#f0f0f0',
                    }}
                    src={event.photoUrl || 'https://via.placeholder.com/400x240?text=No+Image+Available'}
                    alt={event.eventName}
                  />
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      p: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="textPrimary"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ textAlign: 'center', mb: 2 }}
                    >
                      {event.eventName || 'Unnamed Event'}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleMoreDetailsClick}
                      sx={{
                        mt: 2,
                        bgcolor: '#007FFF',
                        '&:hover': {
                          bgcolor: '#005BBB',
                        },
                      }}
                    >
                      More Details
                    </Button>
                  </CardContent>
                </Card>
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
