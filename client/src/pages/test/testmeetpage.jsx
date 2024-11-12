import React, { useState, useEffect, useRef } from 'react';
import { Modal, IconButton, TextField, Button, Grid, Typography, Paper, Box, InputAdornment } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import MeetingScheduler from './MeetingScheduler';
import VenueDisplay from './VenueDisplay';
import RightSidebar from './RightSlider';
import AccountModal from './AccountModal';

const MeetSpotPage = ({ firebaseID }) => {
  const [showChat, setShowChat] = useState(false);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 25.4358, lng: 81.8463 }); // Default location (Prayagraj)
  const [userMarker, setUserMarker] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [locationOption, setLocationOption] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const searchInputRef = useRef(null); 
  const [selectedSection, setSelectedSection] = useState('select');


  const handleAccountIconClick = () => {
    setShowModal(true); // Open the modal when the account icon is clicked
  };

  const handleSelectFriend = (friend) => {
    console.log('Selected Friend:', friend); // Debug log to verify friend selection
    setSelectedFriend(friend);
    setShowModal(false); // Close the modal after selecting a friend
  };



  // Toggle chat window
  const toggleChat = () => {
    setShowChat(prev => !prev); 
  };

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
        script.src = `https://maps.gomaps.pro/maps/api/js?key=AlzaSyW_ArwSIkDDvuo6b2q_ydRToUA6n-lVp-T&libraries=places&async&defer`;
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

        setSearchInput(place.name);

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

  const renderLeftSection = () => {
    switch (selectedSection) {
      case 'venue':
        return <VenueDisplay />;
      case 'meet':
        return <MeetingScheduler />;
      default:
        return <TextField
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      <Box
        component="header"
        className="bg-white shadow-md mx-auto flex justify-between items-center mt-4 mb-4"
        sx={{
          width: showChat ? '50%' : '80%',
          backgroundColor: '#f089cc',
          height: '60px',
          borderRadius: '30px',
          padding: '0 20px',
          marginLeft: showChat ? 'calc((100vw - 400px - 50%) / 2)' : '10vw',
          marginRight: showChat ? 'calc((100vw - 400px - 50%) / 2)' : '10vw',
          transition: 'width 0.3s ease, margin-left 0.3s ease, margin-right 0.3s ease',
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
              onClick={() => setSelectedSection('select')}
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
              onClick={() => setSelectedSection('venue')}
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
              onClick={() => setSelectedSection('meet')}
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
            <IconButton sx={{ color: '#ff65a3' }} onClick={handleAccountIconClick}>
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
        <Grid item xs={12} md={4} sx={{ height: '87vh' }}>
          <Paper className="shadow-md p-4">
            {renderLeftSection()}
          </Paper>
        </Grid>

        {/* 3/5th of the page */}
        <Grid item xs={12} md={8}>
          <Paper className="shadow-md">
            <div id="map" style={{ height: '87vh', width: '100%' }} />
          </Paper>
        </Grid>

      </Grid>

      {/* Right Sidebar (Chat) */}
      <Grid item xs={4}>
      <RightSidebar showChat={showChat} toggleChat={toggleChat} selectedFriend={selectedFriend} />

        </Grid>

        
      
          <AccountModal firebaseID={firebaseID}
        open={showModal}
        onClose={() => setShowModal(false)}
        onSelectFriend={handleSelectFriend} />
    </div>
  );
};

export default MeetSpotPage;