import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Modal,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { MusicNote, Nightlife, Fastfood, Favorite, Event } from '@mui/icons-material';
import axios from 'axios';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [visibleCount, setVisibleCount] = useState(15);
  const [searchType, setSearchType] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState('');

  const categories = [
    { name: 'Music', icon: <MusicNote /> },
    { name: 'Party', icon: <Nightlife /> },
    { name: 'Food', icon: <Fastfood /> },
    { name: 'Cultural', icon: <Fastfood /> },
    { name: 'Dating', icon: <Favorite /> },
    { name: 'Other', icon: <Event /> },
  ];

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/event/getall');
      setEvents(response.data || []);
      console.log(response);
      setFilteredEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Use reverse geocoding API or mock data for demonstration
        axios
          .get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then((res) => {
            const location = res.data.address.city || res.data.address.state || 'Default';
            setUserLocation(location);
            setSelectedCategory(location);
            handleCategoryFilter(location); // Automatically filter events based on location
          })
          .catch((err) => console.error('Error fetching location:', err));
      },
      (error) => console.error('Error with geolocation:', error)
    );
  };

  useEffect(() => {
    fetchEvents();
    fetchUserLocation();
  }, []);

  const handleCategoryFilter = (eventType) => {
    setSelectedCategory(eventType);
    if (eventType === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) => event.eventType === eventType);
      setFilteredEvents(filtered);
    }
    setVisibleCount(15);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter((event) => {
      if (searchType === 'name') return event.eventName.toLowerCase().includes(searchQuery.toLowerCase());
      if (searchType === 'place') return event.location.toLowerCase().includes(searchQuery.toLowerCase());
      if (searchType === 'eventType') return event.eventType.toLowerCase().includes(searchQuery.toLowerCase());
      return false;
    });

    setFilteredEvents(filtered);
  };

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 15);
  };

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
      alert('Registration successful, notification sent!');
      handleCloseModal();
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f7fb' }}>
      {/* Search Section */}
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 150, mr: 2 }}>
          <InputLabel>Search By</InputLabel>
          <Select value={searchType} onChange={(e) => setSearchType(e.target.value)} label="Search By">
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="place">Place</MenuItem>
            <MenuItem value="eventType">Event Type</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {/* Category Icons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        {categories.map((cat) => (
          <IconButton
            key={cat.name}
            onClick={() => handleCategoryFilter(cat.name)}
            sx={{
              mx: 2,
              color: selectedCategory === cat.name ? '#f06292' : 'text.primary',
              '&:hover': { color: '#f06292' },
            }}
          >
            {cat.icon}
            <Typography variant="caption" sx={{ ml: 1 }}>
              {cat.name}
            </Typography>
          </IconButton>
        ))}
        <Button
          onClick={() => handleCategoryFilter('')}
          variant="text"
          sx={{
            ml: 2,
            color: selectedCategory === '' ? '#f06292' : 'text.primary',
          }}
        >
          All
        </Button>
      </Box>

      <Box sx={{ p: 8 }}>
        <Typography variant="h3" align="center" fontWeight="bold" color="primary" gutterBottom>
          {selectedCategory ? `${selectedCategory} Events` : 'All Events'}
        </Typography>
        <Grid container spacing={4}>
          {filteredEvents.slice(0, visibleCount).map((event) => (
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
                    <strong>Location:</strong> {event.location.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    <strong>Date:</strong> {event.beginDate} - {event.endDate}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      boxShadow: 2,
                      backgroundColor: '#f48fb1',
                      '&:hover': { backgroundColor: '#f06292' },
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
        {visibleCount < filteredEvents.length && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button variant="outlined" onClick={handleViewMore}>
              View More
            </Button>
          </Box>
        )}
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
          <Button
            variant="contained"
            sx={{
              mt: 2,
              boxShadow: 2,
              backgroundColor: '#f48fb1',
              '&:hover': { backgroundColor: '#f06292' },
            }}
            onClick={handleRegister}
          >
            Submit Registration
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default EventsPage;
