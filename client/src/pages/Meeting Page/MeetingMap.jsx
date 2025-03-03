import React, { useEffect, useState } from "react";
import {
    Grid,
    Paper,
    TextField,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Alert,
    IconButton,
    Box,
    Button
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const YOUR_HERE_API_KEY = "Lhu8fRXCXhzlnW8i_5Mszi2otgOMuli4nBmfaEx2CVI";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MeetSpotPage = ({ isFriend, setUserLocation , handleNext}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [autocompleteResults, setAutocompleteResults] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const reverseGeocode = async (coords) => {
        try {
            const response = await fetch(
                `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${coords.lat},${coords.lng}&lang=en-US&apiKey=${YOUR_HERE_API_KEY}`
            );
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                const address = data.items[0].address.label;
                setSearchQuery(address);
            }
        } catch {
            setError("Failed to reverse geocode.");
        }
    };

    const handleSearchChange = async (event) => {
        setSearchQuery(event.target.value);

        if (!event.target.value) {
            setAutocompleteResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${encodeURIComponent(
                    event.target.value
                )}&apiKey=${YOUR_HERE_API_KEY}&countryCode=IN`
            );
            const data = await response.json();
            if (data.items) {
                setAutocompleteResults(data.items);
            } else {
                setAutocompleteResults([]);
            }
        } catch {
            setError("Failed to fetch autocomplete results.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectLocation = async (location) => {
        try {
            const response = await fetch(
                `https://lookup.search.hereapi.com/v1/lookup?id=${location.id}&apiKey=${YOUR_HERE_API_KEY}`
            );
            const data = await response.json();
            if (data.position) {
                const coords = { lat: data.position.lat, lng: data.position.lng };
                setSearchQuery(location.title);
                setAutocompleteResults([]);
                setSelectedLocation(coords);
                setMarkers([coords]);
            }
        } catch {
            setError("Failed to retrieve location details.");
        }
    };

    const handleMyLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    const userCoords = { lat: coords.latitude, lng: coords.longitude };
                    setSelectedLocation(userCoords);
                    setMarkers([userCoords]);
                    reverseGeocode(userCoords);
                },
                () => alert("Unable to retrieve your location.")
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
                setMarkers([coords]);
                setSelectedLocation(coords);
                reverseGeocode(coords);
            },
        });
        return null;
    };

    const CenterMapAtLocation = ({ location }) => {
        const map = useMap();
        useEffect(() => {
            if (location) {
                map.setView([location.lat, location.lng], 14);
            }
        }, [location, map]);
        return null;
    };

    const markerColor = isFriend ? "red" : "blue"; // Change marker color based on isFriend

    const handleSetLocation = () => {
        handleNext();
        setUserLocation(selectedLocation);
    };

    return (
        <Grid container sx={{ height: "100vh", padding: 0 }}>
            <Grid item xs={12} sx={{ position: "relative", height: "100%" }}>
                {/* Map */}
                <MapContainer
                    style={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0, zIndex: 1 }}
                    center={[25.494698, 81.868438]}
                    zoom={10}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapClickHandler />
                    <CenterMapAtLocation location={selectedLocation} />
                    {markers.map((marker, index) => (
                        <Marker
                            key={index}
                            position={marker}
                            icon={L.divIcon({
                                className: `leaflet-div-icon leaflet-div-icon-${markerColor}`,
                                html: `<div style="background-color:${markerColor}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
                            })}
                        />
                    ))}
                </MapContainer>

                {/* Search Box */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 10,
                        width: "90%",
                        maxWidth: "600px",
                    }}
                >
                    <TextField
                        placeholder="Search Or Choose Location From Map"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: !isFriend && ( // Conditionally show the startAdornment
                                <InputAdornment position="start">
                                    <IconButton onClick={handleMyLocationClick}>
                                        <MyLocationIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end" sx={{ display: "flex", gap: 1 }}>
                                    {/* Search Icon */}
                                    <IconButton>
                                        <SearchIcon />
                                    </IconButton>

                                    {/* Set Location Button */}
                                    <Button
                                        variant="contained"
                                        onClick={handleSetLocation}
                                        sx={{
                                            backgroundColor: "#1976d2",
                                            color: "#fff",
                                            "&:hover": {
                                                backgroundColor: "#115293",
                                            },
                                        }}
                                    >
                                        Set Location
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            backgroundColor: "white", // Solid background for the search bar
                            borderRadius: "8px",
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
                        }}
                    />
                    
                    {/* Autocomplete Results */}
                    {autocompleteResults.length > 0 && (
                        <Paper
                            elevation={3}
                            sx={{
                                marginTop: "8px",
                                backgroundColor: "white",
                                borderRadius: "8px",
                                padding: "8px",
                                maxHeight: "300px",
                                overflowY: "auto",
                            }}
                        >
                            <List>
                                {autocompleteResults.map((result, index) => (
                                    <ListItem
                                        key={index}
                                        button
                                        onClick={() => handleSelectLocation(result)}
                                        sx={{
                                            "&:hover": { backgroundColor: "rgba(0, 0, 255, 0.1)" }, // Light blue on hover
                                        }}
                                    >
                                        <ListItemText primary={result.title} />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Box>


                {/* Toast Container */}
                <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        closeOnClick
                        pauseOnHover
                        draggable
                        theme="colored"
                    />
            </Grid>
        </Grid>
    );
};

export default MeetSpotPage;
