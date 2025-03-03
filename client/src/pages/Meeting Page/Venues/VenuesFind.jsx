import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { topVenues, createVenue } from "../../../api/VenueRequest";
import { Button, TextField, Modal, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

var greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const YOUR_HERE_API_KEY = "Lhu8fRXCXhzlnW8i_5Mszi2otgOMuli4nBmfaEx2CVI";
const App = ({ userLocation, friendLocation , formData, setFormData, handleNext, setVenueId}) => {
  const [mode, setMode] = useState("New");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [venueDetails, setVenueDetails] = useState([]);
  const [distanceTime, setDistanceTime] = useState(null);
  
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;

  const midpoint = {
    lat: (userLocation.lat + friendLocation.lat) / 2,
    lng: (userLocation.lng + friendLocation.lng) / 2,
  };

  // Fetch suggestions from Autosuggest API
  const fetchSuggestions = async () => {
    if (mode === "New") {
      try {
        const response = await axios.get(
          `https://autosuggest.search.hereapi.com/v1/autosuggest`,
          {
            params: {
              at: `${midpoint.lat},${midpoint.lng}`,
              q: searchQuery,
              apiKey: YOUR_HERE_API_KEY,
            },
          }
        );
        setSuggestions(response.data.items);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }
  };

  // Fetch venues from Discover API
  const fetchVenues = async (category) => {
    try {
      const response = await axios.get(
        `https://discover.search.hereapi.com/v1/discover`,
        {
          params: {
            at: `${midpoint.lat},${midpoint.lng}`,
            q: category,
            apiKey: YOUR_HERE_API_KEY,
          },
        }
      );
      setVenues(response.data.items);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  // Fetch venues from the backend
  const fetchPastVenues = async () => {
    try {
      const response = await topVenues(userId);
      console.log(response);
    } catch (error) {
      console.error("Error fetching past venues:", error);
    }
  };

  // Fetch details including distance and time from Discover API
  const fetchVenueDetails = async (venue) => {
    try {
      setSelectedVenue(venue);
      const userResponse = await axios.get(
        `https://router.hereapi.com/v8/routes`,
        {
          params: {
            transportMode: "car",
            origin: `${userLocation.lat},${userLocation.lng}`,
            destination: `${venue.position.lat},${venue.position.lng}`,
            apiKey: YOUR_HERE_API_KEY,
            return: "summary"
          },
        }
      );


      const friendResponse = await axios.get(
        `https://router.hereapi.com/v8/routes`,
        {
          params: {
            transportMode: "car",
            origin: `${friendLocation.lat},${friendLocation.lng}`,
            destination: `${venue.position.lat},${venue.position.lng}`,
            apiKey: YOUR_HERE_API_KEY,
            return: "summary"

          },
        }
      );
      console.log(userResponse);
      console.log(friendResponse);
      setDistanceTime({
        user: userResponse.data.routes[0].sections[0].summary,
        friend: friendResponse.data.routes[0].sections[0].summary,
      });
    } catch (error) {
      console.error("Error fetching venue details:", error);
    }
  };

  // Handle toggle change
  const handleToggleChange = (event, newMode) => {
    setMode(newMode);
    setVenues([]);
    setSuggestions([]);
    setSelectedVenue(null);
    if (newMode === "Past") fetchPastVenues();
  };

  const handleSetVenue = async () => {
    console.log("before"+selectedVenue.title);
    if (selectedVenue) {
      console.log("after"+selectedVenue);
      const venueData = {
        name: selectedVenue.title || '',
        type: searchQuery || 'Unknown',
        location: {
          type: 'Point',
          coordinates: [selectedVenue.position.lng, selectedVenue.position.lat],
        },
        address: selectedVenue.address?.label || '',
        photo: selectedVenue.contacts?.[0]?.www?.[0]?.value || 'https://genk.mediacdn.vn/thumb_w/640/2015/1-verily-cropped-1449570463573.jpg',
      };

      
      console.log(venueData);
      try {
        const response = await createVenue(venueData);
        console.log(response);
        console.log(response.data._id);
        setFormData((prevData) => ({
          ...prevData,
          venue: response.data._id,
        }));
        setVenueDetails([...venueDetails, venueData]);
        // setVenueId(response.data._id);
        setSelectedVenue(null); // Close the modal after saving the venue
        handleNext();
      } catch (error) {
        console.error('Failed to create venue:', error);
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/3 p-4 bg-gray-100 overflow-auto">
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleToggleChange}
          className="mb-4"
        >
          <ToggleButton value="New">New</ToggleButton>
          <ToggleButton value="Past">Past</ToggleButton>
        </ToggleButtonGroup>

        {mode === "New" && (
          <>
            <TextField
              label="Search Venues"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && fetchSuggestions()}
            />
            <div className="mt-4">
              {suggestions.map((item) => (
                <Card key={item.id} className="mb-2" onClick={() => fetchVenues(item.title)}>
                  <CardContent>
                    <Typography variant="h6">{item.title}</Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        <Typography variant="h5" className="mt-4">Venues</Typography>
        <div className="mt-2 space-y-2">
          {venues.map((venue) => (
            <Card key={venue.id || venue._id} onClick={() => fetchVenueDetails(venue)}>
              <CardContent>
                <Typography variant="h6">{venue.title || venue.name}</Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Section (Map) */}
      <div className="w-2/3 h-screen">
        <MapContainer center={midpoint} zoom={13} className="h-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[userLocation.lat, userLocation.lng]} icon={redIcon}>
            <Popup>User Location</Popup>
          </Marker>
          <Marker position={[friendLocation.lat, friendLocation.lng]} icon={greenIcon}>
            <Popup>Friend Location</Popup>
          </Marker>
          {venues.map((venue) => (
            <Marker
              key={venue.id || venue._id}
              position={[
                venue.position?.lat || venue.latitude,
                venue.position?.lng || venue.longitude,
              ]}
              eventHandlers={{
                click: () => fetchVenueDetails(venue),
              }}
            >
              <Popup>{venue.title || venue.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Venue Modal */}
      <Modal open={!!selectedVenue} onClose={() => setSelectedVenue(null)}>
        <div className="p-8 bg-white rounded shadow-xl max-w-md mx-auto mt-16">
          {selectedVenue && (
            <>
              {selectedVenue.image && (
                <img
                  src={selectedVenue.image}
                  alt={selectedVenue.title || selectedVenue.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedVenue.title || selectedVenue.name}
              </h2>
              <p className="text-gray-600">{selectedVenue.address?.label}</p>
              {distanceTime && (
                <div className="mt-4 space-y-2">
                  <p className="text-gray-700">
                    <strong>User:</strong>{" "}
                    {distanceTime.user.length >= 1000
                      ? `${(distanceTime.user.length / 1000).toFixed(2)} km`
                      : `${distanceTime.user.length} m`}
                    , {Math.floor(distanceTime.user.duration / 60)}m{" "}
                    {distanceTime.user.duration % 60}s
                  </p>
                  <p className="text-gray-700">
                    <strong>Friend:</strong>{" "}
                    {distanceTime.friend.length >= 1000
                      ? `${(distanceTime.friend.length / 1000).toFixed(2)} km`
                      : `${distanceTime.friend.length} m`}
                    , {Math.floor(distanceTime.friend.duration / 60)}m{" "}
                    {distanceTime.friend.duration % 60}s
                  </p>
                </div>
              )}
              <button
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                onClick={handleSetVenue}
              >
                Set Venue
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default App;
