import React, { useState, useEffect, useRef } from 'react';
import { Modal, IconButton, TextField, Button, Grid, Typography, Paper, Box, InputAdornment } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';

const MeetSpotPage = () => {
  const [showChat, setShowChat] = useState(false);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 25.4358, lng: 81.8463 }); // Default location (Prayagraj)
  const [userMarker, setUserMarker] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [locationOption, setLocationOption] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchInputRef = useRef(null); // Ref for search input

  // Toggle chat window
  const toggleChat = () => {
    setShowChat((prev) => !prev);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Set current location
  const setCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };
        setUserLocation(location);
        if (map) {
          map.setCenter(location);
        }

        // Set marker for current location
        if (userMarker) {
          userMarker.setMap(null);
        }
        const newMarker = new window.google.maps.Marker({
          position: location,
          map: map,
          title: 'Your Current Location',
        });
        setUserMarker(newMarker);

        // Geocode to get address from latitude and longitude
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location }, (results, status) => {
          if (status === 'OK' && results[0]) {
            setSearchInput(results[0].formatted_address);
          } else {
            alert("Address not found for your current location.");
          }
        });

        setLocationOption('current');
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleManualLocation = () => {
    const searchBox = new window.google.maps.places.SearchBox(searchInputRef.current);

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      const location = place.geometry.location;

      // Set map center to selected place
      map.setCenter(location);
      setUserLocation({ lat: location.lat(), lng: location.lng() });

      if (userMarker) {
        userMarker.setMap(null);
      }

      const newMarker = new window.google.maps.Marker({
        position: location,
        map: map,
        title: place.name,
      });
      setUserMarker(newMarker);
    });

    setSearchInput('');
    setLocationOption('manual');
    handleCloseModal();
  };

  const handleMapClick = (event) => {
    const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    setUserLocation(location);
    if (userMarker) {
      userMarker.setMap(null);
    }
    const newMarker = new window.google.maps.Marker({
      position: location,
      map: map,
      title: 'Selected Location',
    });
    setUserMarker(newMarker);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setSearchInput(results[0].formatted_address);
      } else {
        alert('Geocode failed.');
      }
    });
    setLocationOption('map');
  };

  useEffect(() => {
    const loadGoMapsAPI = () => {
      if (!window.gomaps) {
        const script = document.createElement('script');
        script.src = `https://maps.gomaps.pro/maps/api/js?key=AlzaSyUsqto5Clnw7F7fPgAqtnAmbhqP9bww0mu&libraries=places&async&defer`;
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        document.body.appendChild(script);

        script.onload = () => {
          console.log('GoMaps API loaded successfully.');
          initializeMap();
        };

        script.onerror = () => {
          console.error('Failed to load GoMaps API.');
        };

      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 12,
      });
      setMap(mapInstance);

      const marker = new window.google.maps.Marker({
        position: userLocation,
        map: mapInstance,
        title: 'Your Location',
      });
      setUserMarker(marker);

      const searchBox = new window.google.maps.places.SearchBox(searchInputRef.current);

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        const place = places[0];
        const location = place.geometry.location;

        mapInstance.setCenter(location);
        setUserLocation({ lat: location.lat(), lng: location.lng() });

        if (userMarker) {
          userMarker.setMap(null);
        }

        const newMarker = new window.google.maps.Marker({
          position: location,
          map: mapInstance,
          title: place.name,
        });
        setUserMarker(newMarker);
      });

      mapInstance.addListener('click', handleMapClick);
    };

    loadGoMapsAPI();
  }, [userLocation]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Box
        component="header"
        className="bg-white shadow-md mx-auto flex justify-between items-center px-4 py-2 mt-4 mb-4"
        sx={{
          width: '80%',
          backgroundColor: '#f089cc',
          height: '60px',
          borderRadius: '30px',
          padding: '0 20px',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(90deg, #ff7eb9, #ff65a3)',
          },
        }}
      >
        <Typography variant="h5" className="text-white font-bold">
          MeetSpot
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Select Location */}
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
              marginRight: '10px',
            }}
          >
            <IconButton
              onClick={toggleChat}
              sx={{ color: '#ff65a3' }}
            >
              <AddLocationIcon />
            </IconButton>
            <Typography variant="body1" sx={{ whiteSpace: 'nowrap', color: '#ff65a3', fontWeight: 'bold', ml: '5px' }}>
              Location
            </Typography>
          </Box>

          {/* Venue Selection */}
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
              marginRight: '10px',
            }}
          >
            <IconButton
              onClick={toggleChat}
              sx={{ color: '#ff65a3' }}
            >
              <WhereToVoteIcon />
            </IconButton>
            <Typography variant="body1" sx={{ whiteSpace: 'nowrap', color: '#ff65a3', fontWeight: 'bold', ml: '5px' }}>
              Venue
            </Typography>
          </Box>

          {/* Schedule Meeting */}
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
              marginRight: '10px',
            }}
          >
            <IconButton
              onClick={toggleChat}
              sx={{ color: '#ff65a3' }}
            >
              <GroupsIcon />
            </IconButton>
            <Typography variant="body1" sx={{ whiteSpace: 'nowrap', color: '#ff65a3', fontWeight: 'bold', ml: '5px' }}>
              Meet
            </Typography>
          </Box>

          {/* The Chat Button */}
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
              marginRight: '10px',
            }}
          >
            <IconButton
              onClick={toggleChat}
              sx={{ color: '#ff65a3' }}
            >
              <ChatBubbleIcon />
            </IconButton>
            <Typography variant="body1" sx={{ whiteSpace: 'nowrap', color: '#ff65a3', fontWeight: 'bold', ml: '5px' }}>
              Chat
            </Typography>
          </Box>
          {/* The Account Icon */}
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
            <Typography variant="body1" sx={{ whiteSpace: 'nowrap', color: '#ff65a3', fontWeight: 'bold', ml: '5px' }}>
              Account
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Layout */}
      <Grid container spacing={3} sx={{ flex: 1 }}>
        {/* 2/5th of the page */}
        <Grid item xs={12} md={4} sx={{height: '87vh'}}>
          <Paper className="shadow-md p-4">

            <TextField
              label="Search Location"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <MyLocationIcon onClick={setCurrentLocation} />
                  </InputAdornment>
                ),
              }}
              inputRef={searchInputRef}
            />
          </Paper>
        </Grid>

        {/* 3/5th of the page */}
        <Grid item xs={12} md={8}>
          <Paper className="shadow-md">
            <div id="map" style={{ height: '87vh', width: '100%' }} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default MeetSpotPage;