import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setLocation } from '../../store/location-slice/locationSlice';
import { Box, TextField, Button, Typography, Card, CardContent, CircularProgress } from '@mui/material';
const apiKey = "AlzaSyP6exizIh22-UNatVUUC-PtIH_dU7nZf2s";


const Friend = ({ map }) => {
  const dispatch = useDispatch();
  const userInputRef = useRef(null);
  const friendInputRef = useRef(null);
  const venueTypeRef = useRef(null);
  const [userMarker, setUserMarker] = useState(null);
  const [friendMarker, setFriendMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [friendLocation, setFriendLocation] = useState(null);
  const [venues, setVenues] = useState([]);
  const [openVenueBox, setOpenVenueBox] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [venueMarkers, setVenueMarkers] = useState([]);
  const [directionsRenderers, setDirectionsRenderers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeSection, setActiveSection] = useState('SetLocations');
  const [distances, setDistances] = useState({});
  const [trafficSpots, setTrafficSpots] = useState([]);

  const userData = JSON.parse(localStorage.getItem('user'));
  const firebaseId = userData?.firebaseID;

  useEffect(() => {
    if (!window.google || !map) return;

    const userSearchBox = new window.google.maps.places.SearchBox(userInputRef.current);
    const friendSearchBox = new window.google.maps.places.SearchBox(friendInputRef.current);

    const handlePlaceSelect = (searchBox, setMarker, setLocationState, markerLabel) => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      const location = place.geometry.location;
      map.setCenter(location);

      setMarker((prevMarker) => {
        if (prevMarker) prevMarker.setMap(null);
        const newMarker = new window.google.maps.Marker({
          position: location,
          map,
          title: `${markerLabel}: ${place.name}`,
          label: markerLabel,
        });
        return newMarker;
      });

      const newLocation = {
        latitude: location.lat(),
        longitude: location.lng(),
        name: place.name,
      };
      setLocationState(newLocation);
      dispatch(setLocation(newLocation));
    };

    userSearchBox.addListener('places_changed', () =>
      handlePlaceSelect(userSearchBox, setUserMarker, setUserLocation, 'U')
    );
    friendSearchBox.addListener('places_changed', () =>
      handlePlaceSelect(friendSearchBox, setFriendMarker, setFriendLocation, 'F')
    );

  


  }, [map, dispatch]);

  const clearPreviousRenderers = () => {
    directionsRenderers.forEach((renderer) => renderer.setMap(null));
    setDirectionsRenderers([]);
  };

  const clearVenueMarkers = () => {
    venueMarkers.forEach((marker) => marker.setMap(null));
    setVenueMarkers([]);
  };

  const fetchDistance = async (originLat, originLng, destLat, destLng) => {
    const origin = `${originLat},${originLng}`;
    const destination = `${destLat},${destLng}`;
    const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      return response.data.rows[0].elements[0].distance.text;
    } catch (error) {
      console.error('Error fetching distance:', error);
      return 'N/A';
    }
  };


  

  const handleFindVenue = async () => {
    if (!userLocation || !friendLocation) {
      alert('Please select both locations.');
      return;
    }

    setLoading(true);
    try {
      const venueType = venueTypeRef.current.value;
      const response = await axios.post('http://localhost:3000/api/v1/venue/get', {
        user1Location: userLocation,
        user2Location: friendLocation,
        type: venueType,
      });

      const venuesWithDistances = await Promise.all(
        response.data.venues.map(async (venue) => {
          const userDistance = await fetchDistance(
            userLocation.latitude,
            userLocation.longitude,
            venue.latitude,
            venue.longitude
          );
          const friendDistance = await fetchDistance(
            friendLocation.latitude,
            friendLocation.longitude,
            venue.latitude,
            venue.longitude
          );
          return { ...venue, userDistance, friendDistance };
        })
      );


      // setVenues(response.data.venues);
      setVenues(venuesWithDistances);
      setOpenVenueBox(true);

      clearVenueMarkers();
      const newVenueMarkers = response.data.venues.map((venue) => {
        const marker = new window.google.maps.Marker({
          position: { lat: venue.latitude, lng: venue.longitude },
          map,
          title: venue.name,
        });
        return marker;
      });
      setVenueMarkers(newVenueMarkers);
    } catch (error) {
      alert('Error fetching venues.');
    } finally {
      setLoading(false);
    }
  };


  const addTrafficSpots = (path) => {
    const newSpots = path.map((point) => {
      const marker = new window.google.maps.Marker({
        position: point,
        map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 5,
          fillColor: 'red',
          fillOpacity: 0.8,
          strokeColor: 'red',
        },
      });
      return marker;
    });

    setTrafficSpots((prev) => [...prev, ...newSpots]);
  };



  const addDirectionRenderer = (origin, destination) => {
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
    });
    directionsService.route(
      {
        origin,
        destination,
        travelMode: 'DRIVING',
      },
      (response, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
          const path = response.routes[0].overview_path;
          addTrafficSpots(path);
        } else {
          alert(`Directions request failed: ${status}`);
        }
      }
    );
    setDirectionsRenderers((prev) => [...prev, directionsRenderer]);
  };

  const handleSelectVenue = (venue) => {
    clearPreviousRenderers();
    clearVenueMarkers();

    const venueMarker = new window.google.maps.Marker({
      position: { lat: venue.latitude, lng: venue.longitude },
      map,
      title: venue.name,
    });

    setSelectedVenue(venue);
    setVenueMarkers([venueMarker]);

    const venueLocation = new window.google.maps.LatLng(venue.latitude, venue.longitude);
    const userLocationCoords = new window.google.maps.LatLng(userLocation.latitude, userLocation.longitude);
    const friendLocationCoords = new window.google.maps.LatLng(friendLocation.latitude, friendLocation.longitude);

    addDirectionRenderer(userLocationCoords, venueLocation);
    addDirectionRenderer(friendLocationCoords, venueLocation);

    map.setCenter(venueLocation);

    setVenues([venue]);
  };

  const handleConfirmVenue = async () => {
    if (!selectedVenue) {
      console.error('No venue selected');
      return;
    }
  
    const venuePayload = {
      firebaseId,
      venueId: selectedVenue.id || selectedVenue.venueId,
      isNew: true,
      name: selectedVenue.name,
      type: selectedVenue.type,
      latitude: selectedVenue.latitude,
      longitude: selectedVenue.longitude,
      address: selectedVenue.address,
    };
  
    try {
      const response = await axios.post('http://localhost:3000/api/v1/venue/select', venuePayload);
  
      // Set success message and navigate to FixMeeting section
      setSuccessMessage(
        `Meeting is fixed at this venue: ${selectedVenue.name}. Your distance: ${selectedVenue.userDistance}, Friend's distance: ${selectedVenue.friendDistance}`
      );

      setErrorMessage(''); // Clear any previous error messages
      setActiveSection('FixMeeting'); 
  
      // Remove only the selected card
      setVenues((prevVenues) => prevVenues.filter((v) => v !== selectedVenue));
      setSelectedVenue(null); // Reset the selection
    } catch (error) {
      setErrorMessage('Error confirming the venue.');
      console.error('AxiosError:', error);
      console.error('Response:', error.response?.data);
    }
  };
  

  const handleSidebarClick = (section) => {
    setActiveSection(section);
    if (section === 'FixMeeting') {
      setSuccessMessage('');
    }
  };

  return (
    <Box sx={{  display: 'flex', height: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '25%',
          backgroundColor: '#f5f5f5',
          padding: 2,
          gap: 4,
        }}
      >
        <Button
          variant={activeSection === 'SetLocations' ? 'contained' : 'outlined'}
          onClick={() => handleSidebarClick('SetLocations')}
          sx={{ marginBottom: 1 }}
          className=' focus:outline-none'
        >
          Set Locations
        </Button>
        <Button
          variant={activeSection === 'SelectVenue' ? 'contained' : 'outlined'}
          onClick={() => handleSidebarClick('SelectVenue')}
          sx={{ marginBottom: 1 }}
        >
          Select Venue
        </Button>
        <Button
          variant={activeSection === 'FixMeeting' ? 'contained' : 'outlined'}
          onClick={handleConfirmVenue}
          sx={{ marginBottom: 1 }}
          disabled={!selectedVenue}
        >
          Fix Meeting
        </Button>
      </Box>
    
      <Box sx={{ flex: 1, padding: 2 }}>
        {activeSection === 'SetLocations' && (
          <Box sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom align="center" >
              Set Locations
            </Typography>

            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="h6">Your Location</Typography>
              <TextField
                fullWidth
                label="Search for your location"
                variant="outlined"
                size="small"
                inputRef={userInputRef}
              />
            </Box>

            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="h6">Friend's Location</Typography>
              <TextField
                fullWidth
                label="Search for friend's location"
                variant="outlined"
                size="small"
                inputRef={friendInputRef}
              />
            </Box>

            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="h6">Venue Type</Typography>
              <TextField
                fullWidth
                label="E.g., Cafe, Park, etc."
                variant="outlined"
                size="small"
                inputRef={venueTypeRef}
              />
            </Box>

            <Button
              variant="contained"
              onClick={handleFindVenue}
              sx={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Find Venue'}
            </Button>
            {errorMessage && (
              <Typography color="error" variant="body2" align="center" sx={{ marginTop: 1 }}>
                {errorMessage}
              </Typography>
            )}
          </Box>
        )}

        {activeSection === 'SelectVenue' && openVenueBox && (
          <Box sx={{maxHeight: '400px',
              overflowY: 'auto', 
              padding: 2,         
              border: '1px solid #ccc', }}>
            <Typography variant="h6" gutterBottom align="center">
              Select Venue
            </Typography>

            {venues.length > 0 ? (
              venues.map((venue) => (
                <Card
                  key={venue.id || venue.venueId}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSelectVenue(venue)}
                >
                  <CardContent>
                    <Typography variant="h6">{venue.name}</Typography>
                    <Typography variant="body2">{venue.type}</Typography>
                    <Typography variant="body2">{venue.address}</Typography>
                    <Typography variant="body2">{venue.details}</Typography> {/* Full data */}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary" align="center">
                No venues found.
              </Typography>
            )}
          </Box>
        )}

        {activeSection === 'FixMeeting' && successMessage && (
          <Box sx={{ padding: 2 }}>
            <Typography variant="h6" color="success.main" align="center">
              {successMessage}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Friend;
