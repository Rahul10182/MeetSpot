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
      console.log("Events Fetched");
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
    <Box sx={{ p: 8, bgcolor: 'linear-gradient(to right, #e3f2fd, #bbdefb)' }}>
      <Typography variant="h3" align="center" fontWeight="bold" color="primary" gutterBottom>
        Upcoming Events
      </Typography>

      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        pagination={{ clickable: true }}
        navigation
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        spaceBetween={30}
        breakpoints={{
          0: { slidesPerView: 1 },       // Show 1 slide on very small screens
          600: { slidesPerView: 2 },     // Show 2 slides on medium screens
          900: { slidesPerView: 3 },     // Show 3 slides on larger screens
        }}
        style={{ padding: '20px 0' }}
      >
        {events.length > 0 ? (
          events.map((event) => (
            <SwiperSlide key={event._id}>
              <Card
                sx={{
                  height: 400,
                  width: '100%',
                  boxShadow: 4,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <Box
                  component="img"
                  sx={{
                    height: 220,
                    width: '100%',
                    objectFit: 'cover',
                    borderRadius: '4px 4px 0 0',
                  }}
                  src={event.photoUrl}
                  alt={event.eventName}
                />
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" component="div" color="textPrimary" gutterBottom>
                    {event.eventName}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleMoreDetailsClick}
                    sx={{ mt: 2 }}
                  >
                    More Details
                  </Button>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))
        ) : (
          <Typography variant="body1" align="center" sx={{ p: 2 }}>
            No events available.
          </Typography>
        )}
      </Swiper>
    </Box>
  );
};

export default EventsBar;