import React, { useState, useEffect } from 'react';
import { Box, Typography, InputBase, Card, CardContent, CardMedia, Grid, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
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
    <Box className="bg-gradient-to-r from-blue-200 to-purple-200 min-h-screen p-6">
      <header>
        <Box className="flex items-center justify-center mb-8">
          <SearchIcon className=" text-gray-400 mr-2" />
          <InputBase
            placeholder="Search events…"
            inputProps={{ 'aria-label': 'search' }}
            className="bg-white text-black rounded-full py-2 px-4 w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
        </Box>
      </header>

      <Box className="max-w-full mx-auto">
        <Typography variant="h4" className="text-blue-400 font-bold text-center mb-6">
          Search Results
        </Typography>

        <Grid container spacing={4} className="justify-center">
          {results.length > 0 ? (
            results.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card
                  onClick={() => handleCardClick(event)} // Add onClick to the card
                  className="bg-gradient-to-r from-blue-200 to-purple-200 hover:scale-105 transition-all duration-300 rounded-2xl shadow-lg transform"
                  sx={{
                    height: '450px', // Reduce card height for compact design
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Softer shadow
                    border: '1px solid #e0e0e0', // Light border
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={event.name}
                    height="100" // Set fixed height for images
                    image={event.image}
                    className="transition-opacity duration-300 hover:opacity-80"
                  />
                  <CardContent className="text-center p-4">
                    <Typography
                      variant="h6"
                      className="font-semibold text-gray-800 mb-2"
                    >
                      {event.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-gray-600 mb-2"
                    >
                      {event.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-gray-600 text-sm"
                    >
                      <strong>Date:</strong> {event.date}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-gray-600 text-sm"
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
              className="text-white text-center italic mt-4"
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
              className="bg-blue-500 text-white"
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
