import React, { useEffect, useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box, Grid, CircularProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ScheduledMeetings = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExpired, setShowExpired] = useState(false); // State to track the toggle
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);


  const handleToggle = () => {
    setShowMore(!showMore);
  };


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
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress color="primary" /></Box>;
  }

  if (!venues || venues.length === 0) {
    return <Typography variant="h6" align="center" sx={{ width: '100%' }}>No Scheduled Meetings Found</Typography>;
  }

  // Helper function to check if the venue is expired or upcoming
  const isExpired = (venueTime) => {
    const venueDate = new Date(venueTime);
    return venueDate < new Date();
  };

  const handleTakeAction = (venue) => {
    if (!venue?.location?.coordinates) {
      alert("Venue location is incomplete. Please check.");
      return;
    }
    console.log("on Scheduled meeting page");
    console.log(venue.location.coordinates);
    navigate('/show-meet', {
      state: {
        coordinates: venue.location.coordinates,
      },
    });
  };

  // Filter venues based on the state
  const filteredVenues = venues.filter((venue) =>
    showExpired ? isExpired(venue.time) : !isExpired(venue.time)
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#C2185B' }}>
        Scheduled Meetings
      </Typography>

      {/* Buttons to toggle between expired and upcoming venues */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <div className=' bg-pink-300 h-12 w-48 justify-center rounded-xl items-center flex '>
        <Button
          variant="contained"
          onClick={() => setShowExpired(false)}
          sx={{
            backgroundColor: '#D07C85',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#C2185B',
            },
            borderRadius: '20px' // margin to separate buttons
          }}
        >
          coming
        </Button>
        <Button
          variant="contained"
          onClick={() => setShowExpired(true)}
          sx={{
            backgroundColor: '#D07C85',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#C2185B',
            },
            borderRadius: '20px'
          }}
        >
          Passed
        </Button>
        </div>
      </Box>

      {/* Render venues based on the selected button */}
      <Grid container spacing={4}>
        {filteredVenues.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ width: '100%', color: '#666' }}>
            <br></br>
            No {showExpired ? 'Passed' : 'Scheduled'} Meetings Found
          </Typography>
        ) : (
          filteredVenues.map((venue, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{
                maxWidth: '100%',
                borderRadius: 3,
                boxShadow: 3,
                transition: '0.3s',
                '&:hover': {
                  boxShadow: 20,
                  transform: 'scale(1.05)',
                  transition: 'transform 0.3s',
                },
                backgroundColor: '#D1D5DB',
                p: 2,
              }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={venue.photo || "https://via.placeholder.com/300x150"}
                  alt={`Venue of ${venue.place}`}
                  sx={{
                    borderRadius: 3,
                    objectFit: 'cover',
                    backgroundColor: '#D1D5DB'
                  }}
                />
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6"
                      component="div"
                      gutterBottom
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        height: showMore ? 'auto' : '1.2em',  // Toggle height based on showMore state
                        overflow: 'hidden',  // Hide overflow if not showing full address
                        textOverflow: 'ellipsis',  // Medium-sized text for the address
                      }}>
                    {venue.address || "Unknown Place"}
                  </Typography>
                  {!showMore && (
                    <Button onClick={handleToggle} sx={{ color: '#1976D2' }}>
                      More
                    </Button>
                  )}
                  {showMore && (
                    <Button onClick={handleToggle} sx={{ color: '#1976D2' }}>
                      Less
                    </Button>
                  )}

                  <Typography variant="body2"
                      color="text.secondary"
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '1rem',  // Medium text for the date and time
                        color: '#C2185B',  // Dark pink color for meeting date/time text
                      }}
>
                    <AccessTimeIcon fontSize="medium" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {venue.time || "Time not available"}
                  </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    onClick={() => handleTakeAction(venue)}
                    sx={{
                      borderRadius: 25,
                      textTransform: 'none',
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 8,
                      },
                    }}
                  >
                    Take Action
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default ScheduledMeetings;
