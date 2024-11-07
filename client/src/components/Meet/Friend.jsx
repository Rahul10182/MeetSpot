import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setLocation } from '../../store/location-slice/locationSlice';
import { Box, TextField, Button, Typography, Card, CardContent, CircularProgress } from '@mui/material';

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
        } else {
          alert(`Directions request failed: ${status}`);
        }
      }
    );
    setDirectionsRenderers((prev) => [...prev, directionsRenderer]);
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

      setVenues(response.data.venues);
      setOpenVenueBox(true);

      clearVenueMarkers(); // Clear previous markers
      const newVenueMarkers = response.data.venues.map((venue) =>
        new window.google.maps.Marker({
          position: { lat: venue.latitude, lng: venue.longitude },
          map,
          title: venue.name,
        })
      );
      setVenueMarkers(newVenueMarkers);
    } catch (error) {
      alert('Error fetching venues.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVenue = (venue, marker) => {
    clearPreviousRenderers();
    clearVenueMarkers();

    setSelectedVenue(venue);

    marker.setMap(map);
    setVenueMarkers([marker]);

    const venueLocation = new window.google.maps.LatLng(venue.latitude, venue.longitude);
    const userLocationCoords = new window.google.maps.LatLng(userLocation.latitude, userLocation.longitude);
    const friendLocationCoords = new window.google.maps.LatLng(friendLocation.latitude, friendLocation.longitude);

    addDirectionRenderer(userLocationCoords, venueLocation);
    addDirectionRenderer(friendLocationCoords, venueLocation);

    setVenues([venue]);
  };

  const handleConfirmVenue = async () => {
    try {
      await axios.post('http://localhost:3000/api/v1/venue/select', selectedVenue);
      setSuccessMessage(`Your meeting is scheduled at ${selectedVenue.name}`);
    } catch (error) {
      alert('Error confirming the venue.');
    }
  };

  return (
    <Box sx={{ display: 'flex', padding: 2 }}>
      <Box sx={{ width: openVenueBox ? '50%' : '100%', paddingRight: 2 }}>
        <Typography variant="h5" gutterBottom align="center">
          Set Locations
        </Typography>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">Your Location</Typography>
          <TextField
            inputRef={userInputRef}
            fullWidth
            label="Search for your location"
            variant="outlined"
            size="small"
          />
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">Friend's Location</Typography>
          <TextField
            inputRef={friendInputRef}
            fullWidth
            label="Search for friend's location"
            variant="outlined"
            size="small"
          />
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">Venue Type</Typography>
          <TextField
            inputRef={venueTypeRef}
            fullWidth
            label="E.g., Cafe, Park, etc."
            variant="outlined"
            size="small"
          />
        </Box>

        <Button variant="contained" fullWidth onClick={handleFindVenue}>
          Find Venues
        </Button>
      </Box>

      {openVenueBox && (
        <Box sx={{ width: '50%', paddingLeft: 2, maxHeight: '400px', overflowY: 'auto' }}>
          <Typography variant="h5" gutterBottom align="center">
            Venue Suggestions
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : venues.length === 0 ? (
            <Typography>No venues found</Typography>
          ) : (
            venues.map((venue, index) => (
              <Card
                key={venue.id}
                sx={{ marginBottom: 2, cursor: 'pointer', backgroundColor: 'white' }}
                onClick={() => handleSelectVenue(venue, venueMarkers[index])}
              >
                <CardContent>
                  <Typography variant="h6">{venue.name}</Typography>
                  <Typography>{venue.address}</Typography>
                  {selectedVenue?.id === venue.id && (
                    <Button variant="contained" fullWidth onClick={handleConfirmVenue} sx={{ marginTop: 1 }}>
                      Select This Venue
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}

      {successMessage && (
        <Typography variant="h6" color="success" align="center" sx={{ marginTop: 2 }}>
          {successMessage}
        </Typography>
      )}
    </Box>
  );
};

export default Friend;
