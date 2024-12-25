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
import H from "@here/maps-api-for-javascript"

const MeetSpotPage = ({ firebaseID }) => {
  const [showChat, setShowChat] = useState(false);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 25.4358, lng: 81.8463 });
  const [friendLocation, setFriendLocation] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [friendMarker, setFriendMarker] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [friendSearchInput, setFriendSearchInput] = useState('');
  const [locationOption, setLocationOption] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedSection, setSelectedSection] = useState('select');
  const [locationsSet, setLocationsSet] = useState(false); // New state to check if both locations are set
  const [venueType, setVenueType] = useState('');
  const searchInputRef = useRef(null);
  const friendInputRef = useRef(null);


  const handleAccountIconClick = () => {
    setShowModal(true); // Open the modal when the account icon is clicked
  };

  const handleSelectFriend = (friend) => {
    console.log('Selected Friend:', friend);
    setSelectedFriend(friend);
    setShowModal(false);
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
        setMarkerOnMap(location, 'Your Current Location', setUserMarker);

        // Geocode to get address from latitude and longitude
        const geocoder = async (location) => {
          const apiKey = 'Jfigr_wm9GvgO11YqmnP_mcw7ek_kxIG9VY5K0Jhyec'; 
          const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${location.lat},${location.lng}&lang=en-US&apikey=${apiKey}`;

          try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            if (data.items && data.items.length > 0) {
              setSearchInput(data.items[0].address.label); 
            } else {
              alert('Address not found for your current location.');
            }
          } catch (error) {
            console.error('Error with geocoding request:', error);
            alert('Failed to fetch address.');
          }
        };

        setLocationOption('current');
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleMapClick = async (event) => {
    const location = { lat: event.latLng.lat, lng: event.latLng.lng };
    setUserLocation(location);
    setMarkerOnMap(location, 'Selected Location', setUserMarker);

    const apiKey = 'qDTgfdpiiqW3yGmO9kvq7WwXW7yFrOK-lKpMiOd7zp8';
    const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${location.lat},${location.lng}&lang=en-US&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setSearchInput(data.items[0].address.label); // Update user location input
      } else {
        alert('No address found.');
      }
    } catch (error) {
      console.error('Error with geocode request:', error);
      alert('Geocode failed.');
    }
  };

  const handleFriendLocationClick = async (event) => {
    const location = { lat: event.latLng.lat, lng: event.latLng.lng };
    setFriendLocation(location);
    console.log('Inside handle friend click');
    console.log(friendLocation);
    setMarkerOnMap(location, 'Friend Location', setFriendMarker, true);

    const apiKey = 'qDTgfdpiiqW3yGmO9kvq7WwXW7yFrOK-lKpMiOd7zp8';
    const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${location.lat},${location.lng}&lang=en-US&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setFriendSearchInput(data.items[0].address.label); // Update friend location input
      } else {
        alert('No address found.');
      }
    } catch (error) {
      console.error('Error with geocode request:', error);
      alert('Geocode failed.');
    }
  };

  // Helper function to set markers on the map
  const setMarkerOnMap = (location, title, setMarker, isFriend = false) => {
    if (map) {
      const markerIcon = isFriend
        ? './blue-marker.png' // Replace with your own blue marker icon
        : './red-marker.png'; // Replace with your own red marker icon

      const marker = new H.map.Marker(location, {
        icon: new H.map.Icon(markerIcon),
      });

      map.addObject(marker);
      setMarker(marker);
    }
  };

  // Function to set both user and friend locations
  const handleSetLocations = () => {
    console.log(userLocation);
    console.log(friendLocation);
    if (userLocation && selectedFriend && friendLocation && venueType) {
      setLocationsSet(true);
    } else {
      alert('Please set both user and friend locations before proceeding.');
    }
  };

  useEffect(() => {
    const loadHereMapsAPI = () => {
      const script = document.createElement('script');
      script.src = `https://js.api.here.com/v3/3.1/mapsjs-core.js`;
      script.async = true;
      script.defer = true;

      const scriptUI = document.createElement('script');
      scriptUI.src = `https://js.api.here.com/v3/3.1/mapsjs-ui.js`;
      scriptUI.async = true;
      scriptUI.defer = true;

      const scriptEvents = document.createElement('script');
      scriptEvents.src = `https://js.api.here.com/v3/3.1/mapsjs-mapevents.js`;
      scriptEvents.async = true;
      scriptEvents.defer = true;

      script.onload = () => {
        scriptUI.onload = () => {
          scriptEvents.onload = initializeMap;
        };
      };

      script.onerror = () => {
        console.error('Failed to load HERE Maps API.');
      };

      document.body.appendChild(script);
      document.body.appendChild(scriptUI);
      document.body.appendChild(scriptEvents);
    };

    const initializeMap = () => {
      const platform = new H.service.Platform({
        apikey: 'qDTgfdpiiqW3yGmO9kvq7WwXW7yFrOK-lKpMiOd7zp8',
      });

      const defaultLayers = platform.createDefaultLayers();
      const mapInstance = new H.Map(
        document.getElementById('map'),
        defaultLayers.vector.normal.map,
        {
          center: userLocation,
          zoom: 12,
        }
      );

      const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(mapInstance));
      H.ui.UI.createDefault(mapInstance, defaultLayers);

      setMap(mapInstance);

      // Default user marker
      setMarkerOnMap(userLocation, 'Your Location', setUserMarker);

      // Default friend marker
      if (friendLocation) {
        setMarkerOnMap(friendLocation, 'Friend Location', setFriendMarker, true);
      }

      mapInstance.addEventListener('tap', (evt) => {
        const coords = mapInstance.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
        if (locationOption === 'current') {
          handleMapClick({ latLng: { lat: coords.lat, lng: coords.lng } });
        } else if (locationOption === 'friend') {
          handleFriendLocationClick({ latLng: { lat: coords.lat, lng: coords.lng } });
        }
      });
    };

    loadHereMapsAPI();
  }, [userLocation]);

  const renderLeftSection = () => {
    switch (selectedSection) {
      case 'venue':
        return <VenueDisplay userLocation={userLocation} friendLocation={friendLocation} type={venueType} />;
      case 'meet':
        return <MeetingScheduler />;
      default:
        return (
          <div className='flex flex-col space-y-4'>
            <TextField
              label="Search Your Location"
              value={searchInput}  // Ensure this is updated correctly
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

            <TextField
              label="Search Friend Location"
              value={friendSearchInput}  // Ensure this is updated correctly
              onChange={(e) => setFriendSearchInput(e.target.value)}
              fullWidth
              inputRef={friendInputRef}
            />
            <TextField
              label="Enter Venue Type"
              onChange={(e) => setVenueType(e.target.value)}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleSetLocations} sx={{ mt: 2 }}>
              Set Location
            </Button>
          </div>
        );
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
              disabled={!locationsSet}
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
