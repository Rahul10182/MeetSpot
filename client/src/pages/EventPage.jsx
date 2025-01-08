import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Modal, TextField } from '@mui/material';
import axios from 'axios';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [friendEmail, setFriendEmail] = useState('');

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

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setUserEmail('');
    setFriendEmail('');
  };

  const handleRegister = async () => {
    console.log(selectedEvent._id);
    console.log(userEmail);
    console.log(friendEmail);
    try {
      await axios.post('http://localhost:3000/event/register', {
        eventId: selectedEvent._id,
        userEmail,
        friendEmail,
      });
      alert('Registration successful, notification sent!');
      handleCloseModal();
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f4f7fb', // Subtle light gray background
      }}
    >
      <Box sx={{ p: 8 }}>
        <Typography variant="h3" align="center" fontWeight="bold" color="primary" gutterBottom>
          All Events
        </Typography>
        <Grid container spacing={4}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card
                sx={{
                  height: '100%',
                  boxShadow: 3,
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease',
                  '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box
                  component="img"
                  sx={{
                    height: 200,
                    width: '100%',
                    objectFit: 'cover',
                    borderBottom: '2px solid #f1f1f1',
                  }}
                  src={event.photoUrl}
                  alt={event.eventName}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div" color="textPrimary" fontWeight="bold" gutterBottom>
                    {event.eventName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {event.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Location:</strong> {event.location}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    <strong>Date:</strong> {event.beginDate} - {event.endDate}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      boxShadow: 2,
                      backgroundColor: '#f48fb1', // Pink 300 color
                      '&:hover': {
                        backgroundColor: '#f06292', // Darker pink on hover
                      },
                    }}
                  
                    onClick={() => handleOpenModal(event)}
                  >
                    Register
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Registration Modal */}
      <Modal open={open} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" mb={2}>
            Register for {selectedEvent?.eventName}
          </Typography>
          <TextField
            label="Your Email"
            fullWidth
            variant="outlined"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Friend's Email"
            fullWidth
            variant="outlined"
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" sx={{
                      mt: 2,
                      boxShadow: 2,
                      backgroundColor: '#f48fb1', // Pink 300 color
                      '&:hover': {
                        backgroundColor: '#f06292', // Darker pink on hover
                      },
                    }}  onClick={handleRegister}>
            Submit Registration
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default EventsPage;
