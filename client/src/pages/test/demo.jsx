import React, { useEffect, useRef, useState } from "react";
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
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";

const YOUR_HERE_API_KEY = "Lhu8fRXCXhzlnW8i_5Mszi2otgOMuli4nBmfaEx2CVI";

const MapComponent = () => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef([]); // Track markers
    const [searchQuery, setSearchQuery] = useState("");
    const [autocompleteResults, setAutocompleteResults] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeMap = () => {
            const platform = new H.service.Platform({ apikey: YOUR_HERE_API_KEY });
            const defaultLayers = platform.createDefaultLayers();

            const map = new H.Map(
                mapRef.current,
                defaultLayers.vector.normal.map,
                {
                    center: { lat: 25.494698, lng: 81.868438 },
                    zoom: 10,
                    pixelRatio: window.devicePixelRatio || 1,
                }
            );

            // Enable map interactions
            const mapEvents = new H.mapevents.MapEvents(map);
            new H.mapevents.Behavior(mapEvents);
            H.ui.UI.createDefault(map, defaultLayers);

            // Add click event for map
            map.addEventListener("tap", (evt) => {
                const coords = map.screenToGeo(
                    evt.currentPointer.viewportX,
                    evt.currentPointer.viewportY
                );
                updateMarker(map, coords);
                setSelectedLocation(coords);
                reverseGeocode(coords);
            });

            // Center on user location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    ({ coords }) => {
                        const userCoords = { lat: coords.latitude, lng: coords.longitude };
                        updateMarker(map, userCoords);
                        map.setCenter(userCoords);
                    },
                    (err) => console.error("Error retrieving location:", err)
                );
            }

            mapInstance.current = map;
        };

        const loadHereMapsScripts = () => {
            const scripts = [
                "https://js.api.here.com/v3/3.1/mapsjs-core.js",
                "https://js.api.here.com/v3/3.1/mapsjs-service.js",
                "https://js.api.here.com/v3/3.1/mapsjs-ui.js",
                "https://js.api.here.com/v3/3.1/mapsjs-mapevents.js",
            ];

            let loadedCount = 0;
            const onLoadScript = () => {
                loadedCount++;
                if (loadedCount === scripts.length) initializeMap();
            };

            scripts.forEach((src) => {
                const script = document.createElement("script");
                script.src = src;
                script.async = true;
                script.onload = onLoadScript;
                script.onerror = () => setError("Failed to load map resources.");
                document.body.appendChild(script);
            });
        };

        loadHereMapsScripts();

        return () => {
            // Cleanup
            if (mapInstance.current) {
                mapInstance.current.dispose();
                markersRef.current.forEach(marker => {
                    mapInstance.current.removeObject(marker); // Remove each marker on cleanup
                });
                markersRef.current = []; // Clear marker references
            }
        };
    }, []);

    const updateMarker = (map, coords) => {
        // Remove existing markers first
        markersRef.current.forEach(marker => map.removeObject(marker));
        markersRef.current = []; // Clear previous markers

        // Add new marker
        const marker = new H.map.Marker(coords);
        map.addObject(marker);
        markersRef.current.push(marker); // Store marker reference
    };

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
        } catch (error) {
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
                `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${encodeURIComponent(event.target.value)}&apiKey=${YOUR_HERE_API_KEY}&countryCode=IN`
            );
            const data = await response.json();

            if (data.items) {
                setAutocompleteResults(data.items);
            } else {
                setAutocompleteResults([]);
            }
        } catch (error) {
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
                const coords = {
                    lat: data.position.lat,
                    lng: data.position.lng,
                };
                setSearchQuery(location.title);
                setAutocompleteResults([]);
                updateMarker(mapInstance.current, coords);
                setSelectedLocation(coords);
            }
        } catch (error) {
            setError("Failed to retrieve selected location details.");
        }
    };

    const handleMyLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    const userCoords = { lat: coords.latitude, lng: coords.longitude };
                    updateMarker(mapInstance.current, userCoords);
                    mapInstance.current.setCenter(userCoords);
                    reverseGeocode(userCoords);
                },
                (error) => {
                    alert("Unable to retrieve your location.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={12} md={9}>
                    <div ref={mapRef} style={{ height: "600px", width: "100%" }} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper elevation={3} style={{ padding: "16px" }}>
                        <TextField
                            label="Search for a location"
                            variant="outlined"
                            fullWidth
                            value={searchQuery}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton onClick={handleMyLocationClick}>
                                            <MyLocationIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {loading && <CircularProgress />}
                        {error && <Alert severity="error">{error}</Alert>}
                        <List>
                            {autocompleteResults.map((result, index) => (
                                <ListItem
                                    key={index}
                                    button="true"
                                    onClick={() => handleSelectLocation(result)}
                                >
                                    <ListItemText primary={result.title} />
                                </ListItem>
                            ))}
                        </List>
                        {selectedLocation && (
                            <button
                                onClick={() =>
                                    alert(
                                        `Location set to: ${searchQuery}\nLatitude: ${selectedLocation.lat}, Longitude: ${selectedLocation.lng}`
                                    )
                                }
                                style={{
                                    marginTop: "16px",
                                    padding: "8px 16px",
                                    background: "#1976d2",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                Set My Location
                            </button>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default MapComponent;
