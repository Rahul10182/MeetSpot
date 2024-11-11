import React, { useEffect, useState } from 'react';
import { Box,IconButton,TextField, Typography, Grid, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import { useLocation, useNavigate } from 'react-router-dom';
import  ChatBubbleIcon  from '@mui/icons-material/ChatBubble';
import  AccountCircleIcon  from '@mui/icons-material/AccountCircle';


const ShowMeetings = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapUrl, setMapUrl] = useState("");
  const [travelMode, setTravelMode] = useState("WALKING"); // Default mode
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const toggleChat = () => {
    setShowChat((prev) => !prev);
  };

  const { state } = useLocation();
  const coordinates = state?.coordinates;

  useEffect(() => {
    loadGoMapsAPI();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userCoords);
          if (coordinates) {
            fetchRouteData(userCoords, coordinates, travelMode);
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  };

  const fetchRouteData = async (origin, destination, mode) => {
    setLoading(true);
    const apiKey = 'AlzaSyP6exizIh22-UNatVUUC-PtIH_dU7nZf2s';

    let travelMode = mode;
    if (mode === 'CAR') {
      travelMode = 'DRIVING';
    } 

    const url = `https://maps.gomaps.pro/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination[1]},${destination[0]}&mode=${mode.toLowerCase()}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === "OK") {
        setRouteData(response.data);
        setMapUrl(generateMapUrl(origin, destination));
        initializeMap(origin, destination, travelMode);
      } else {
        console.error("Error in response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMapUrl = (userCoords, venueCoords) => {
    if (!userCoords || !venueCoords) return "";

    const apiKey = 'AlzaSyP6exizIh22-UNatVUUC-PtIH_dU7nZf2s';
    const origin = `${userCoords.lat},${userCoords.lng}`;
    const destination = `${venueCoords[1]},${venueCoords[0]}`;

    return `https://maps.gomaps.pro/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`;
  };

  const loadGoMapsAPI = () => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.gomaps.pro/maps/api/js?key=AlzaSyP6exizIh22-UNatVUUC-PtIH_dU7nZf2s&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('GoMaps API loaded successfully.');
        getUserLocation();
      };
      script.onerror = () => {
        console.error('Failed to load GoMaps API.');
      };
      document.body.appendChild(script);
    } else {
      getUserLocation();
    }
  };

  const initializeMap = (origin, destination, mode) => {
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: origin.lat, lng: origin.lng },
      zoom: 14,
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    directionsService.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination[1], lng: destination[0] },
        travelMode: google.maps.TravelMode[mode],
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(response);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      }
    );
  };

  const handleModeChange = (mode) => {
    setTravelMode(mode);
    if (userLocation && coordinates) {
      fetchRouteData(userLocation, coordinates, mode);
    }
  };


  const renderDirections = () => {
    if (loading) return <Typography>Loading Directions...</Typography>;
    if (!routeData || !routeData.routes || !routeData.routes[0]?.legs[0]) {
      return <Typography>No route found or error occurred.</Typography>;
    }

    const { distance, duration } = routeData.routes[0].legs[0];

    return (
      <Box>
        <Typography variant="h6">Directions</Typography>
        <Typography variant="body1">Distance: {distance?.text || "N/A"}</Typography>
        <Typography variant="body1">Duration: {duration?.text || "N/A"}</Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ padding: 1 }}>
    
      <Box
        component="header"
        className="bg-white shadow-md mx-auto flex justify-between items-center"
        sx={{
          width: '80%',
          backgroundColor: '#f089cc',
          height: '60px',
          borderRadius: '30px',
          padding: '0 10px',
          transition: 'background-color 0.3s ease',
          
          mb: 1,
          '&:hover': {
            background: 'linear-gradient(90deg, #ff7eb9, #ff65a3)',
          },
        }}
      >
        <Typography variant="h5" className="text-white font-bold">
          MeetSpot
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              '&:hover': { width: '120px' },
              width: '40px',
              overflow: 'hidden',
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
              mr: 2,
            }}
          >
            <IconButton sx={{ color: '#ff65a3' }}>
              <ChatBubbleIcon />
            </IconButton>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'nowrap',
                color: '#ff65a3',
                fontWeight: 'bold',
                ml: 1,
              }}
            >
              Chat
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              '&:hover': { width: '140px' },
              width: '40px',
              overflow: 'hidden',
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <IconButton sx={{ color: '#ff65a3' }}>
              <AccountCircleIcon />
            </IconButton>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'nowrap',
                color: '#ff65a3',
                fontWeight: 'bold',
                ml: 1,
              }}
            >
              Account
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 3, height: '100%' }}>
            <Box className="flex justify-center bg-gray-300" sx={{ mb: 2 }}>

            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                mb: 2,
              }}
            >
              <DirectionsCarIcon
                fontSize="large"
                color={travelMode === 'DRIVING' ? 'primary' : 'inherit'}
                onClick={() => handleModeChange('DRIVING')}
                sx={{ cursor: 'pointer' }}
              />
              <DirectionsWalkIcon
                fontSize="large"
                color={travelMode === 'WALKING' ? 'primary' : 'inherit'}
                onClick={() => handleModeChange('WALKING')}
                sx={{ cursor: 'pointer' }}
              />
            </Box>

            <Box
              sx={{
                backgroundColor: '#e0f7fa',
                borderRadius: '8px',
                padding: 2,
              }}
            >
              {renderDirections()}
            </Box>
          </Paper>
        </Grid>

        {/* Map Section */}
        <Grid item xs={12} md={8}>
          <Box
            id="map"
            sx={{
              width: '100%',
              height: '600px',
              backgroundColor: '#d0d0d0',
              borderRadius: '8px',
            }}
          >
            Map placeholder
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShowMeetings;
