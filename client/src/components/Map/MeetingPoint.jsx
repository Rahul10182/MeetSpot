import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setLocation } from '../../store/location-slice/locationSlice';

const MeetingPoint = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Fetch the location data from the Redux store
  const { lat, lng, name } = useSelector((state) => state.location);

  const [apiLoaded, setApiLoaded] = useState(false);

  // Dispatch location data if available in location.state
  useEffect(() => {
    if (location.state?.lat && location.state?.lng && location.state?.name) {
      dispatch(setLocation(location.state));
    }
  }, [location.state, dispatch]);

  // Load Google Maps API
  useEffect(() => {
    const handleAPILoad = () => {
      console.log("Google Maps API loaded.");
      setApiLoaded(true);
    };

    if (!window.google) {
      console.log("Loading Google Maps API script...");
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCJbX_S3RKm2RP8_YbHDEfek6eKGa4s2D4&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = handleAPILoad;
      script.onerror = () => console.error("Failed to load Google Maps API script.");
      document.body.appendChild(script);
    } else {
      console.log("Google Maps API already loaded.");
      setApiLoaded(true);
    }
  }, []);

  // Initialize the map if API is loaded and coordinates are available
  useEffect(() => {
    if (apiLoaded && lat && lng) {
      console.log("Initializing map with coordinates:", { lat, lng });
      
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: parseFloat(lat), lng: parseFloat(lng) },
        zoom: 15,
      });

      new window.google.maps.Marker({
        position: { lat: parseFloat(lat), lng: parseFloat(lng) },
        map: map,
        title: name,
      });
    } else {
      console.log("Map not initialized. API loaded:", apiLoaded, "Coordinates:", { lat, lng });
    }
  }, [apiLoaded, lat, lng, name]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {lat && lng ? (
        <>
          <h2 className="text-xl mb-4">Location: {name}</h2>
          <div
            id="map"
            style={{ width: '100%', height: '80vh', border: '1px solid #ccc' }}
          />
        </>
      ) : (
        <p>Location data not available</p>
      )}
    </div>
  );
};

export default MeetingPoint;
