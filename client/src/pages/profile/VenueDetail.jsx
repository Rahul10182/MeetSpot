import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { LocationOn, EventNote, AccessTime } from '@mui/icons-material';

const VenueCard = ({ venue }) => {
  const { name, type, address, location, lastVisited } = venue;

  return (
    <Card elevation={3} className="mb-6">
      <CardContent>
        <Typography variant="h5" component="div" className="font-semibold">
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          <LocationOn /> {address}
        </Typography>

        <Typography variant="body2" color="textSecondary" gutterBottom>
          <EventNote /> Type: {type}
        </Typography>

        {location && (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            <AccessTime /> Coordinates: {location.coordinates[0]}, {location.coordinates[1]}
          </Typography>
        )}

        {lastVisited && (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            <AccessTime /> Last Visited: {new Date(lastVisited).toLocaleDateString()}
          </Typography>
        )}

        {!lastVisited && (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            <AccessTime /> This venue has not been visited yet.
          </Typography>
        )}

        <Box mt={2}>
          <Button variant="contained" color="primary">
            Show More Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const UserVenues = ({ firebaseID }) => {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/venue/visited`, {
          firebaseID: firebaseID,  
        });
        setVenues(response.data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchVenues();
  }, [firebaseID]);

  return (
    <div>
      {venues.length === 0 ? (
        <p>No venues found.</p>
      ) : (
        venues.map((venue) => (
          <VenueCard key={venue._id} venue={venue} />
        ))
      )}
    </div>
  );
};

export default UserVenues;