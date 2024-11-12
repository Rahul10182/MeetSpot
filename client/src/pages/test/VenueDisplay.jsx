import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Typography, Card, CardContent } from '@mui/material';
import { fetchVenues, fetchDistance } from './venueService';

const VenueDisplay = ({ userLocation, friendLocation }) => {
  console.log(userLocation);
  console.log(friendLocation);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVenues = async () => {
      if (!userLocation || !friendLocation) {
        setError('Please provide both user and friend locations.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch venues based on locations
        const venuesResponse = await fetchVenues(userLocation, friendLocation);

        // Calculate distance for each venue
        const venuesWithDistances = await Promise.all(
          venuesResponse.map(async (venue) => {
            const userDistance = await fetchDistance(
              userLocation.latitude,
              userLocation.longitude,
              venue.latitude,
              venue.longitude
            );
            const friendDistance = await fetchDistance(
              friendLocation.latitude,
              friendLocation.longitude,
              venue.latitude,
              venue.longitude
            );
            return { ...venue, userDistance, friendDistance };
          })
        );

        setVenues(venuesWithDistances);
      } catch (err) {
        setError('Error fetching venues or distances.');
      } finally {
        setLoading(false);
      }
    };

    loadVenues();
  }, [userLocation, friendLocation]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ maxHeight: '400px', overflowY: 'auto', padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Available Venues
      </Typography>
      {venues.length > 0 ? (
        venues.map((venue) => (
          <Card key={venue.id || venue.venueId} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">{venue.name}</Typography>
              <Typography variant="body2">{venue.type}</Typography>
              <Typography variant="body2">{venue.address}</Typography>
              <Typography variant="body2">
                Your distance: {venue.userDistance}, Friend's distance: {venue.friendDistance}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No venues found.</Typography>
      )}
    </Box>
  );
};

export default VenueDisplay;
