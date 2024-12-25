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
    const markersRef = useRef([]); 
    const [searchQuery, setSearchQuery] = useState("");
    const [autocompleteResults, setAutocompleteResults] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      const initializeMap = () => {
          console.debug("Initializing HERE Map...");
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
  
          const mapEvents = new H.mapevents.MapEvents(map);
          new H.mapevents.Behavior(mapEvents);
          H.ui.UI.createDefault(map, defaultLayers);
  
          map.addEventListener("tap", (evt) => {
              const coords = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
              console.debug("Map tapped at:", coords);
              updateMarker(map, coords);
              setSelectedLocation(coords);
              reverseGeocode(coords);
          });
  
          mapInstance.current = map;
  
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                  ({ coords }) => {
                      const userCoords = { lat: coords.latitude, lng: coords.longitude };
                      console.debug("User's location:", userCoords);
                      updateMarker(map, userCoords, "red");
                      map.setCenter(userCoords);
                  },
                  (err) => console.error("Error retrieving location:", err)
              );
          }
      };
  
      const loadHereMapsScripts = () => {
          const script = document.createElement("script");
          script.src = "https://js.api.here.com/v3/3.1/mapsjs.bundle.js";
          script.async = true;
          script.onload = initializeMap;
          script.onerror = () => setError("Failed to load map resources.");
          document.body.appendChild(script);
      };
  
      loadHereMapsScripts();
  
      return () => {
          if (mapInstance.current) mapInstance.current.dispose();
      };
  }, []);


  const updateMarker = (map, coords, color = "green") => {
    console.log("Updating marker with coordinates:", coords);

    // Ensure markersRef.current is an array
    if (!markersRef.current) {
        markersRef.current = [];  // Initialize it if undefined
    }

    console.log("Current markersRef:", markersRef.current);
    console.log("markersRef length:", markersRef.current.length);

    // First, remove old markers only if new markers need to be added
    if (markersRef.current.length > 0) {
        markersRef.current.forEach((marker, index) => {
            if (marker instanceof H.map.Marker) {
                console.log("Attempting to remove marker:", marker);
                try {
                    if (map.getObjects().includes(marker)) {
                        map.removeObject(marker);  // Remove marker from the map
                        console.log("Removed marker:", marker);
                    } else {
                        console.warn("Marker not found in the map:", marker);
                    }
                } catch (error) {
                    console.error("Failed to remove marker:", marker, error);
                }
            }
        });
        markersRef.current = [];
        console.log("markersRef cleared:", markersRef.current);
    }

    // Define the icon based on the color
    const iconUrl =
        color === "green"
            ? "https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png"
            : "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png";

    // Create a new icon for the marker
    console.log("Marker icon:", iconUrl);
    const markerIcon = new H.map.Icon(iconUrl);
    console.log("Marker icon:", markerIcon);

    // Create the new marker with the provided coordinates
    const newMarker = new H.map.Marker(coords, { icon: markerIcon });
    console.log("New marker:", newMarker);

    // Add the new marker to the map
    try {
        map.addObject(newMarker);
        console.log("New marker added to the map:", newMarker);
    } catch (error) {
        console.error("Error adding new marker to the map:", error);
    }

    // Track the newly added marker by storing it in markersRef
    markersRef.current.push(newMarker);
    console.log("Updated markersRef:", markersRef.current);
};



    const reverseGeocode = async (coords) => {
        console.debug("Reverse geocoding for coordinates:", coords);
        try {
            const response = await fetch(
                `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${coords.lat},${coords.lng}&lang=en-US&apiKey=${YOUR_HERE_API_KEY}`
            );
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const address = data.items[0].address.label;
                setSearchQuery(address);
                console.debug("Reverse geocode result:", address);
            }
        } catch (reverseGeoError) {
            console.error("Error reverse geocoding:", reverseGeoError);
            setError("Failed to reverse geocode.");
        }
    };

    const handleSearchChange = async (event) => {
        setSearchQuery(event.target.value);
        console.log(event.target.value)

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
            console.log("response of fetching on handle search change",response)
            console.log(data);
            if (data.items) {
                setAutocompleteResults(data.items);
                console.log("Autocomplete results:", autocompleteResults);
                console.debug("Autocomplete data:", data.items);
                console.log("data.items", data.items);
                // handleSelectLocation(data.items[0]);
            } else {
                setAutocompleteResults([]);
            }
        } catch (autoCompleteError) {
            console.error("Error fetching autocomplete data:", autoCompleteError);
            setError("Failed to fetch autocomplete results.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectLocation = async (location) => {
        console.log("Selected location:", location);
        try {
            const lookupResponse = await fetch(
                `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(location.address.label)}&apiKey=${YOUR_HERE_API_KEY}`
            );
            const lookupData = await lookupResponse.json();
            console.log("Lookup data:", lookupData);
    
            if (lookupData.items[0]?.position) {
                const coords = { lat: lookupData.items[0].position.lat, lng: lookupData.items[0].position.lng };
                console.log("Precise location:", coords);
    
                // Update the marker on the map immediately
                setSearchQuery(location.title);
                setSelectedLocation(coords);
                setAutocompleteResults([]);
                if (mapInstance.current) {
                    updateMarker(mapInstance.current, coords); // Pass the map and coordinates
                    mapInstance.current.setCenter(coords); // Center the map on the new location
                } else {
                    console.error("Map instance is not available.");
                }
    
                // Update state for the selected location and clear autocomplete results
                 // Save the selected coordinates in state (optional)
                
            } else {
                console.error("No position data found for this location:", lookupData);
                setError("Failed to fetch precise location data.");
            }
        } catch (lookupError) {
            console.error("Error selecting location:", lookupError);
            setError("Failed to retrieve selected location details.");
        }
    };
    
    

    const handleMyLocationClick = () => {
        console.debug("My Location clicked!");

        // Clear any existing markers
        markersRef.current.forEach(marker => {
            mapInstance.current.removeObject(marker);
        });
        markersRef.current = []; // Clear the markers array

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const userCoords = { lat: latitude, lng: longitude };
                    console.debug("User's current location:", userCoords);
                    updateMarker(mapInstance.current, userCoords);
                    mapInstance.current.setCenter(userCoords);
                },
                (geoError) => {
                    console.error("Error retrieving user location:", geoError);
                    alert("Unable to retrieve your location.");
                }
            );
        } else {
            console.error("Geolocation not supported by this browser.");
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
                                    <InputAdornment position="start" >
                                        <MyLocationIcon onClick={handleMyLocationClick} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {loading && <CircularProgress />}
                        {error && <Alert severity="error">{error}</Alert>}
                        <List>
                            {autocompleteResults.map((result, index) => (
                                
                                <ListItem key={index} button onClick={() => handleSelectLocation(result)}>
                                    <ListItemText primary={result.title} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                    
                </Grid>
            </Grid>
        </div>
    );
};

export default MapComponent;