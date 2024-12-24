import React, { useState, useEffect } from 'react';
import { pink } from '@mui/material/colors'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchEvents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // State to store clicked card info

  const handleSearch = async () => {
    const apiKey = 'x5pRc2bpCxMBPJnBVjidOPFdEYUKCfAF'; // Replace with your Ticketmaster API key
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&keyword=${encodeURIComponent(
      searchQuery
    )}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data._embedded && data._embedded.events) {
        setResults(
          data._embedded.events.map((event) => ({
            id: event.id,
            name: event.name,
            description: event.info
              ? event.info.split(' ').slice(0, 20).join(' ') + '...'
              : 'No description available',
            image:
              event.images && event.images.length > 0
                ? event.images[0].url
                : 'https://via.placeholder.com/150',
            date: event.dates.start.localDate || 'Date not available',
            venue:
              event._embedded.venues &&
              event._embedded.venues.length > 0 &&
              event._embedded.venues[0].name
                ? event._embedded.venues[0].name
                : 'Venue not available',
          }))
        );
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setResults([]);
    }
  };

  useEffect(() => {
    handleSearch(); // Trigger the search on component mount
  }, []);

  const handleCardClick = (event) => {
    setSelectedEvent(event); // Store clicked card info
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null); // Close the dialog or clear the selected event
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <header>
        <AppBar position="static">
          <Toolbar
            className=' bg-pink-400'
            position="static"
            sx={{ bgcolor: 'dark-pink' }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, textAlign: 'left',color:'',height:'' }}
            >
              Event Finder
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'black' }}>
              <SearchIcon sx={{ mr: 1 }} />
              <InputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                sx={{
                  color: 'inherit',
                  bgcolor: 'white',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  width: '200px',
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </header>

      <Box sx={{ padding: 4 }}>
        <Typography
          variant="h4"
          sx={{ mb: 4, textAlign: 'left', fontWeight: 'bold' }}
        >
          Search Results
        </Typography>

        <Grid
          container
          spacing={3}
          sx={{
            marginTop: 2,
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
        >
          {results.length > 0 ? (
            results.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card
                    onClick={() => handleCardClick(event)} // Add onClick to the card
                    sx={{
                      maxWidth: 345,
                      height: 400,
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #f9f9f9, #fefefe)',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        cursor: 'pointer',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                      },
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <CardMedia
                      component="img"
                      alt={event.name}
                      height="140"
                      image={event.image}
                      sx={{
                        transition: 'opacity 0.3s ease',
                        '&:hover': { opacity: 0.85 },
                      }}
                    />
                    <CardContent
                      sx={{
                        padding: '16px',
                        textAlign: 'center',
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '18px',
                          color: '#333',
                        }}
                      >
                        {event.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#555',
                          fontSize: '14px',
                          margin: '8px 0',
                          lineHeight: 1.5,
                        }}
                      >
                        {event.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#777',
                          fontSize: '13px',
                          marginTop: '4px',
                        }}
                      >
                        <strong>Date:</strong> {event.date}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#777',
                          fontSize: '13px',
                          marginTop: '4px',
                        }}
                      >
                        <strong>Venue:</strong> {event.venue}
                      </Typography>
                    </CardContent>
                  </Card>

              </Grid>
            ))
          ) : (
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ mt: 4, textAlign: 'center', fontStyle: 'italic' }}
            >
              No results found. Try searching for an event.
            </Typography>
          )}
        </Grid>
      </Box>

      {/* Dialog to show clicked card details */}
      {selectedEvent && (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>{selectedEvent.name}</DialogTitle>
          <DialogContent>
            <Typography>
              <strong>Description:</strong> {selectedEvent.description}
            </Typography>
            <Typography>
              <strong>Date:</strong> {selectedEvent.date}
            </Typography>
            <Typography>
              <strong>Venue:</strong> {selectedEvent.venue}
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleCloseDialog}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default SearchEvents;
