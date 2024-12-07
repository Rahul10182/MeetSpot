import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography, Grid, Paper, Button, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import TaxiAlertIcon from '@mui/icons-material/TaxiAlert';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { useLocation } from 'react-router-dom';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ShowMeetings = ({ coordinates ,friendEmail,venueName}) => {
  const [userLocation, setUserLocation] = useState(null);
  const [routeData, setRouteData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [travelMode, setTravelMode] = useState("WALKING");
  const [map, setMap] = useState(null);
  const [trafficLayer, setTrafficLayer] = useState(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  const { state } = useLocation();
  coordinates = state?.coordinates;
  friendEmail = state?.friendEmail;
  venueName = state?.venueName;
  console.log("venue:name")
  console.log(venueName)
  console.log("Friend Email")
  console.log(friendEmail)

  console.log("venue coordinates : ",coordinates);

  useEffect(() => {
    loadHereMapsAPI(); // Load the HERE Maps API
  }, []);
  
  useEffect(() => {
    if (userLocation && coordinates && routeData.length > 0) {
      initializeMap(userLocation, coordinates, routeData);
    }
  }, [userLocation, coordinates, routeData]); // Re-run when any of these change
  
  
  const getUserLocation = () => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log('User coordinates:', userCoords);
          setUserLocation(userCoords);
  
          if (coordinates) {
            fetchRouteData(userCoords, coordinates, travelMode);
          }
        },
        (error) => {
          console.error('Error getting user location:', error.message);
          alert('Failed to get location');
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
  
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };
  
  const handleModeChange = (mode) => {
    setTravelMode(mode);
    if (userLocation && coordinates) {
      setLoading(true);  // Start loading indicator
      fetchRouteData(userLocation, coordinates, mode);
    }
  };
  
  const fetchRouteData = async (userCoords, venueCoords, travelMode) => {
    try {
      const origin = `${userCoords.lat},${userCoords.lng}`;
      const destination = `${venueCoords[1]},${venueCoords[0]}`; // Correct order (lat, lng)
      const response = await axios.get('https://router.hereapi.com/v8/routes', {
        params: {
          transportMode: travelMode,
          origin: origin,
          destination: destination,
          return: 'summary,polyline',
          alternatives: 3,
          apiKey: 'Lhu8fRXCXhzlnW8i_5Mszi2otgOMuli4nBmfaEx2CVI',
        },
      });
  
      setRouteData(response.data.routes);
      setLoading(false);  // Stop loading when data is fetched
      if (map) {
        updateRouteOnMap(response.data.routes);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      setLoading(false);
    }
  };
  
  const updateRouteOnMap = (routes) => {
    if (!map || routes.length === 0) return;
  
    const selectedRoute = routes[selectedRouteIndex];
    if (!selectedRoute || !selectedRoute.sections) {
      console.error('No valid route found for the selected route.');
      return;
    }
  
    const linestring = H.geo.LineString.fromFlexiblePolyline(
      selectedRoute.sections[0].polyline
    );
    const routeLine = new H.map.Polyline(linestring, {
      style: { strokeColor: 'green', lineWidth: 5 },
    });
  
    map.removeObjects(map.getObjects()); // Remove existing route from the map
    map.addObject(routeLine); // Add new route line
    map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
  
    // Add or update the user's location marker
    const userMarker = new H.map.Marker(userLocation);
    map.addObject(userMarker);
  
    // Add or update the venue's location marker
    if (coordinates) {
      const venueMarker = new H.map.Marker(coordinates);
      map.addObject(venueMarker);
    }
  };
  
  
  
  

  const loadHereMapsAPI = () => {
    if (!window.H) {
      const script = document.createElement('script');
      script.src = `https://js.api.here.com/v3/3.1/mapsjs.bundle.js`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('HERE Maps API loaded successfully.');
        getUserLocation();
      };
      script.onerror = () => {
        console.error('Failed to load HERE Maps API.');
      };
      document.body.appendChild(script);
    } else {
      getUserLocation();
    }
  };
  

  const initializeMap = (origin, destination, routes) => {
    if (!map) {
      const platform = new H.service.Platform({
        apikey: 'Lhu8fRXCXhzlnW8i_5Mszi2otgOMuli4nBmfaEx2CVI',
      });
      const defaultLayers = platform.createDefaultLayers();
  
      const newMap = new H.Map(
        document.getElementById('map'),
        defaultLayers.vector.normal.map,
        {
          center: origin,
          zoom: 14,
        }
      );
  
      const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap));
      const ui = H.ui.UI.createDefault(newMap, defaultLayers);
  
      setMap(newMap); // Set the map state here
    }
  
    // Wait for map to be initialized before adding objects
    if (!map) {
      console.error("Map is not initialized yet.");
      return;
    }
  
    map.removeObjects(map.getObjects());
  
    const selectedRoute = routes[selectedRouteIndex];
  
    if (!selectedRoute || !selectedRoute.sections) {
      console.error('No valid route found for the selected route.');
      return;
    }
  
    const linestring = H.geo.LineString.fromFlexiblePolyline(
      selectedRoute.sections[0].polyline
    );
  
    const routeLine = new H.map.Polyline(linestring, {
      style: { strokeColor: 'green', lineWidth: 5 },
    });
  
    map.addObject(routeLine); // Now it is safe to call addObject
    map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
  
    // Add the user's location marker
    const userMarker = new H.map.Marker(origin);
    map.addObject(userMarker);
    

    // Add the venue's location marker
    // console.log("destination:")
    // const cleanedDestination = destination.filter(value => !isNaN(value));
    // console.log(cleanedDestination)
    // const longitude = cleanedDestination[0];
    // const latitude = cleanedDestination[1];
    // const validDestination = { lat: latitude, lng: longitude };
    // const venueMarker = new H.map.Marker(validDestination);
    // map.addObject(venueMarker);

    // If route data is available, draw the route
    if (routes.length > 0) {
      const selectedRoute = routes[selectedRouteIndex];
      const linestring = H.geo.LineString.fromFlexiblePolyline(
        selectedRoute.sections[0].polyline
      );
      const routeLine = new H.map.Polyline(linestring, {
        style: { strokeColor: 'green', lineWidth: 5 },
      });
      map.addObject(routeLine); // Add the route line to the map
      map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
    }

  };

  const handleRouteChange = (index) => {
    setSelectedRouteIndex(index);
    initializeMap(userLocation, coordinates, routeData);
  };
  
  const formatDuration = (durationInSeconds) => {
    const durationInMinutes = durationInSeconds / 60;
    
    if (durationInMinutes >= 1440) { // 1440 minutes = 24 hours
      const days = Math.floor(durationInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (durationInMinutes >= 60) { // 60 minutes = 1 hour
      const hours = Math.floor(durationInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${Math.round(durationInMinutes)} minute${durationInMinutes > 1 ? 's' : ''}`;
    }
  };
  

  const renderDirections = () => {
    if (loading) return <Typography>Loading Directions...</Typography>;
    if (!routeData.length) return <Typography>No route found or error occurred.</Typography>;
  
    const selectedRoute = routeData[selectedRouteIndex];
    const summary = selectedRoute.sections[0].summary;

    const sendFriendEmail = () => {
      
      const userData = JSON.parse(localStorage.getItem('user'));
      const userName = userData?.fullName;
      const email = userData?.email;
  
      const emailContent = {
        from: userName,
        to: friendEmail,
        subject: "I have reached my destination",
        body: `Hi, this is ${userName}. I have successfully reached ${venueName}.`,
      };
  
      // Backend API call to send email
      fetch("http://localhost:3000/api/v1/mail/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailContent),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Email sent successfully:", data);
          // Optionally show a success message or notification
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          // Optionally show an error message or notification
        });
    };
  
    return (
      <Box>
        <Typography variant="h6">Selected Route</Typography>
        <Typography variant="body1">Distance: {summary?.length / 1000} km</Typography>
        <Typography variant="body1">Duration: {summary?.duration / 60} mins</Typography>
  
        <Typography variant="h6" sx={{ mt: 2 }}>Alternate Routes</Typography>
        <Box
          sx={{
            maxHeight: '300px', // Limit the height to enable scrolling
            overflowY: 'auto', // Allow vertical scrolling
            scrollbarWidth: 'none', // For Firefox
            '&::-webkit-scrollbar': {
              display: 'none', // For Chrome, Safari, and Edge
            },
          }}
        >

        <List>
          {routeData.map((route, index) => (
            <ListItem
              button
              key={index}
              selected={index === selectedRouteIndex}
              onClick={() => handleRouteChange(index)}
            >
              <ListItemText
                primary={`Route ${index + 1}`}
                secondary={`Distance: ${(route.sections[0].summary.length / 1000).toFixed(2)} km, Duration: ${formatDuration(route.sections[0].summary.duration)}`}
                />


            </ListItem>
          ))}
        </List>
              <Button
                variant="contained"
                color="primary"
                onClick={() => sendFriendEmail()} // Pass route details to the email function
                sx={{ mt: 2, width: '50%' }}
              >
                I have reached
              </Button>
        </Box>  
      </Box>
    );
  };
  
  
    return (
      <Box sx={{ padding: 1 }}>
        <Box component="header" className="bg-white shadow-md mx-auto flex justify-between items-center" sx={{ /* styles */ }}>
          <Typography variant="h5" className="text-white font-bold">MeetSpot</Typography>
          {/* Other Header Components */}
        </Box>
    
        <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 3, height: '100%', backgroundColor: '#fff', borderRadius: '8px' }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              mb: 2,
              boxShadow: 2,
            }}>
              <DirectionsCarIcon
                fontSize="large"
                color={travelMode === 'car' ? 'primary' : 'inherit'}
                onClick={() => handleModeChange('car')}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.3s',
                }}
              />
              <DirectionsWalkIcon
                fontSize="large"
                color={travelMode === 'pedestrian' ? 'primary' : 'inherit'}
                onClick={() => handleModeChange('pedestrian')}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.3s',
                }}
              />
              <PedalBikeIcon
                fontSize="large"
                color={travelMode === 'bicycle' ? 'primary' : 'inherit'}
                onClick={() => handleModeChange('bicycle')}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.3s',
                }}
              />
              <TaxiAlertIcon
                fontSize="large"
                color={travelMode === 'taxi' ? 'primary' : 'inherit'}
                onClick={() => handleModeChange('taxi')}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.3s',
                }}
              />
              <DirectionsBusIcon
                fontSize="large"
                color={travelMode === 'bus' ? 'primary' : 'inherit'}
                onClick={() => handleModeChange('bus')}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.3s',
                }}
              />
            </Box>
            <Box sx={{
              backgroundColor: '#e0f7fa',
              borderRadius: '8px',
              padding: 2,
              boxShadow: 1,
            }}>
              {renderDirections()}
            </Box>

          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box id="map" sx={{
            height: '600px',
            width: '100%',
            padding: 3,
            borderRadius: '8px',
            backgroundColor: '#f5f5f5',
            boxShadow: 3,
            transition: 'all 0.3s ease',
            '&:hover': { boxShadow: 6 },
          }}></Box>
        </Grid>
      </Grid>

      </Box>
    );
    
};

export default ShowMeetings;
