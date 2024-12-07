import React, { useEffect, useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  CircularProgress,
  CardActions,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ScheduledMeetings = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExpired, setShowExpired] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState({});
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('user'));
  const firebaseID = userData?.firebaseID;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/venue/allvenues/${firebaseID}`
        );
        setVenues(response.data.venues || []);
      } catch (error) {
        console.error('Error fetching venues:', error);
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, [firebaseID]);

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  const getFriendEmail = async (venue) => {
    try {
      if (!venue.friend || !venue.friend._id) {
        console.error('Friend data is missing for venue:', venue);
        return null;
      }
  
      const selectedFriendId = venue.friend._id;
  
      const friendResponse = await axios.post(
        `http://localhost:3000/api/v1/user/getEmail`,
        { selectedFriendId }
      );
  
      const friendEmail = friendResponse.data?.email;
      if (!friendEmail) {
        console.error('Friend email not found');
        return null;
      }
  
      return friendEmail;
    } catch (error) {
      console.error('Error fetching friend email:', error);
      return null;
    }
  };
  
  const sendEmailNotification = async (venue) => {
    try {
      const friendEmail = await getFriendEmail(venue);
      if (!friendEmail) {
        return;
      }
  
      const emailData = {
        userEmail: userData?.email,
        friendEmail,
        venueName: venue.name,
        meetingTime: `${venue.date} ${venue.time}`,
      };
  
      await axios.post('http://localhost:3000/api/v1/mail/send-reminder', {
        emailData,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  

  const isExpired = (venueDate ) => {
    const currentDateTime = new Date();
    const venueDateTime = new Date(`${venueDate}`);
    return venueDateTime < currentDateTime; // True if the meeting time has passed
  };
  
  const filteredVenues = venues.filter((venue) =>
    showExpired ? isExpired(venue.date) : !isExpired(venue.date)
  );
  
  // Automatically update expired venues
  useEffect(() => {
    const interval = setInterval(() => {
      setVenues((prevVenues) =>
        prevVenues.filter((venue) => !isExpired(venue.date))
      );
    }, 60 * 1000); // Check every minute
  
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [venues]);
  
  
  
  const calculateLeaveTime = (venueDate, venueTime) => {
    const venueDateTime = new Date(`${venueDate}T${venueTime}:00`);
    venueDateTime.setMinutes(venueDateTime.getMinutes() - 30);
    return venueDateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleTakeAction = async (venue) => {
    if (!venue?.location?.coordinates) {
      alert('Venue location is incomplete. Please check.');
      return;
    }
  
    try {
      const friendEmail = await getFriendEmail(venue);
      console.log("friend email on last page")
      console.log(friendEmail)
  
      if (!friendEmail) {
        alert('Friend email not found. Cannot proceed.');
        return;
      }
  
      navigate('/show-meet', {
        state: {
          coordinates: venue.location.coordinates,venueName: venue.name,
          friendEmail,
        },
      });
    } catch (error) {
      console.error('Error in handleTakeAction:', error);
    }
  };
  

  const toggleAddress = (venueId) => {
    setShowFullAddress((prevState) => ({
      ...prevState,
      [venueId]: !prevState[venueId],
    }));
  };

  // Automatically send email 2 hours before the meeting
  useEffect(() => {
    const scheduleEmails = () => {
      venues.forEach((venue) => {
        const venueDateTime = new Date(`${venue.date}T${venue.time}:00`);
        const currentTime = new Date();
        const timeDifference = venueDateTime - currentTime;

        // Check if the meeting is in the future and if it's 2 hours away
        if (timeDifference > 0 && timeDifference <= 2 * 60 * 60 * 1000) {
          // Send email 2 hours before the meeting
          setTimeout(() => {
            sendEmailNotification(venue);
          }, timeDifference);
        }
      });
    };

    if (!loading) {
      scheduleEmails();
    }
  }, [loading, venues]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: 'bold', color: '#C2185B' }}
      >
        Scheduled Meetings
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <div className="bg-pink-400 h-16 w-48 justify-center rounded-xl items-center flex">
          <Button
            variant="contained"
            onClick={() => setShowExpired(false)}
            sx={{
              backgroundColor: '#D07C85',
              color: '#fff',
              '&:hover': { backgroundColor: '#C2185B' },
              borderRadius: '20px',
            }}
          >
            Coming
          </Button>
          <Button
            variant="contained"
            onClick={() => setShowExpired(true)}
            sx={{
              backgroundColor: '#D07C85',
              color: '#fff',
              '&:hover': { backgroundColor: '#C2185B' },
              borderRadius: '20px',
            }}
          >
            Passed
          </Button>
        </div>
      </Box>

      <Grid container spacing={4}>
        {filteredVenues.length === 0 ? (
          <Typography
            variant="h6"
            align="center"
            sx={{ width: '100%', color: '#666' }}
          >
            No {showExpired ? 'Passed' : 'Scheduled'} Meetings Found
          </Typography>
        ) : (
          filteredVenues.map((venue) => (
            <Grid item xs={12} sm={6} md={4} key={venue.id} >
              <Card
              
                sx={{
                  maxWidth: '100%',
                  borderRadius: 3,
                  boxShadow: 1,
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: 10,
                    transform: 'scale(1.05)',
                  },
                  backgroundColor: '#F1F5F9',
                  p: 2,
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={venue.photo || 'https://via.placeholder.com/300x150'}
                  alt={`Venue of ${venue.place}`}
                  sx={{ borderRadius: 3, objectFit: 'cover' }}
                />
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">
                    {showFullAddress[venue.id]
                      ? venue.address
                      : `${venue.address.slice(0, 40)}...`}
                    <Button onClick={() => toggleAddress(venue.id)}>Toggle</Button>
                  </Typography>
                  <Typography variant="body2">
                    Date: {venue.date} 
                  </Typography>
                  <Typography variant="body2">
                    Leave at: {calculateLeaveTime(venue.date, venue.time)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Button
                    variant="contained"
                    color={'primary'}
                    onClick={() => handleTakeAction(venue)}
                  >
                     'Go to Venue'
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default ScheduledMeetings;
