import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Modal, TextField } from '@mui/material';
import axios from 'axios';
import Header from '../components/Homepage/Navbar';

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
    try {
      await axios.post('http://localhost:3000/event/register', {
        eventId: selectedEvent._id,
        userEmail,
        friendEmail,
      });
      console.log(selectedEvent._id);
      console.log(userEmail);
      console.log(friendEmail)
      alert('Registration successful, notification sent!');
      handleCloseModal();
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ p: 8, bgcolor: '#f4f6f8' }}>
        <Typography variant="h3" align="center" fontWeight="bold" color="primary" gutterBottom>
          All Events
        </Typography>
        <Grid container spacing={4}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card
                sx={{
                  height: 450,
                  boxShadow: 4,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <Box
                  component="img"
                  sx={{
                    height: 200,
                    width: '100%',
                    objectFit: 'cover',
                    borderRadius: '4px 4px 0 0',
                  }}
                  src={event.photoUrl}
                  alt={event.eventName}
                />
                <CardContent>
                  <Typography variant="h5" component="div" color="textPrimary" gutterBottom>
                    {event.eventName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {event.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Location: {event.location}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary">
                    Date: {event.beginDate} - {event.endDate}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
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
          <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
            Submit Registration
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default EventsPage;