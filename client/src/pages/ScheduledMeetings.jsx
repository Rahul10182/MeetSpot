import React, { useEffect, useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box, Grid } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Meetings = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('user'));
  const firebaseID = userData?.firebaseID;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/venue/allvenues/${firebaseID}`);
        setVenues(response.data.venues || []);
      } catch (error) {
        console.error("Error fetching venues:", error);
        setVenues([]); // Fallback to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [firebaseID]);

  if (loading) {
    return <Typography variant="h6" align="center">Loading Scheduled Meetings...</Typography>;
  }

  if (!venues || venues.length === 0) {
    return <Typography variant="h6" align="center">No Scheduled Meetings Found</Typography>;
  }

  const handleTakeAction = (venue) => {
    if (!venue?.location?.coordinates) {
      alert("Venue location is incomplete. Please check.");
      return;
    }
    console.log("on Scheduled meeting page")
    console.log(venue.location.coordinates);
    navigate('/show-meet', {
      state: {
        coordinates: venue.location.coordinates,
      },
    });
  };


  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Scheduled Meetings
      </Typography>
      <Grid container spacing={4}>
        {venues.map((venue, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <Card sx={{ maxWidth: '100%', borderRadius: 3, boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 20 }, }}>
              <CardMedia
                component="img"
                height="180"
                image={venue.photo || "https://via.placeholder.com/300x150"}
                alt={`Venue of ${venue.place}`}
              />
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {venue.address || "Unknown Place"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Meeting Time: {venue.time || "Time not available"}
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Button variant="contained" color="primary" size="medium" onClick={() => handleTakeAction(venue)}>
                  Take Action
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Meetings;
