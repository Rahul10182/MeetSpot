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
    setMarkerOnMap(location, 'Selected Location', setUserMarker);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setSearchInput(results[0].formatted_address);  // Update user location input
      } else {
        alert('Geocode failed.');
      }
    });
    setLocationOption('map');
  };

  const handleFriendLocationClick = (event) => {
    const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    setFriendLocation(location);
    console.log("Inside handle friend click");
    console.log(friendLocation);
    setMarkerOnMap(location, 'Friend Location', setFriendMarker);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setFriendSearchInput(results[0].formatted_address);  // Update friend location input
      } else {
        alert('Geocode failed.');
      }
    });
  };

  // Helper function to set markers on the map
  const setMarkerOnMap = (location, title, setMarker, isFriend = false) => {
    if (map) {
      // Define custom marker icon based on whether it's a friend or user
      const markerIcon = isFriend
        ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Blue for friend
        : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'; // Red for user
  
      // Create the marker
      const newMarker = new window.google.maps.Marker({
        position: location,
        map: map,
        title: title,
        icon: markerIcon, // Custom icon
      });
  
      // Set the marker (this updates the state or variable with the new marker)
      setMarker(newMarker);
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
    const loadGoMapsAPI = () => {
      if (!window.gomaps) {
        const script = document.createElement('script');
        script.src = `https://maps.gomaps.pro/maps/api/js?key=AlzaSyLMVnq5No06P-AM88ZKZE0jAFEjidcsxfL&libraries=places&async&defer`;
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        document.body.appendChild(script);

        script.onload = () => {
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

      //default user marker
      const marker = new window.google.maps.Marker({
        position: userLocation,
        map: mapInstance,
        title: 'Your Location',
      });
      setMarkerOnMap(userLocation, 'Your Location', setUserMarker);

      //default friendmarker
      const friendMarker = new window.google.maps.Marker({
        position: friendLocation || { lat: 0, lng: 0 }, // Default empty location
        map: mapInstance,
        title: 'Friend Location',
      });
      

      //user search box
      const searchBox = new window.google.maps.places.SearchBox(searchInputRef.current);
      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        const place = places[0];
        const location = place.geometry.location;
        mapInstance.setCenter(location);
        setUserLocation({ lat: location.lat(), lng: location.lng() });
        setSearchInput(place.name);
        setMarkerOnMap(location, place.name, setUserMarker);
      });

      //friend search box
      const friendSearchBox = new window.google.maps.places.SearchBox(friendInputRef.current);
      friendSearchBox.addListener('places_changed', () => {
        const places = friendSearchBox.getPlaces();
        if (places.length === 0) return;
      
        const place = places[0];
        const location = place.geometry.location;
        mapInstance.setCenter(location);
      
        const newFriendLocation = { lat: location.lat(), lng: location.lng() };
        setFriendLocation(newFriendLocation);  // Update the state
        console.log(newFriendLocation); // Log the updated location immediately
        console.log(place.name);
        setFriendSearchInput(place.name);
        setMarkerOnMap(newFriendLocation, 'Friend Location', setFriendMarker, true);
      });


      mapInstance.addListener('click', (event) => {
        if (locationOption === 'current') {
          handleMapClick(event);
        } else if (locationOption === 'friend') {
          handleFriendLocationClick(event);
        }
      });
    };

    loadGoMapsAPI();
  }, [userLocation]);

  const renderLeftSection = () => {
    switch (selectedSection) {
      case 'venue':
        return <VenueDisplay userLocation={userLocation} friendLocation={friendLocation} type={venueType}/>;
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
