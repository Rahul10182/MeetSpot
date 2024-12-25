import React, { useState, useEffect, useRef } from 'react';

const MapComponent = ({ location, onLocationChange }) => {
  const [map, setMap] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const searchInputRef = useRef(null); // Ref for search input

  const handleMapClick = (event) => {
    const newLocation = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    onLocationChange(newLocation);

    if (userMarker) {
      userMarker.setMap(null);
    }

    const newMarker = new window.google.maps.Marker({
      position: newLocation,
      map: map,
      title: 'Selected Location',
      animation: window.google.maps.Animation.DROP
    });
    setUserMarker(newMarker);
    
    map.panTo(newLocation);
  };

  useEffect(() => {
    if (userMarker) {
      userMarker.setMap(null);
    }
    const loadGoMapsAPI = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        document.body.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 12,
      });
      setMap(mapInstance);

      if (location) {
        const marker = new window.google.maps.Marker({
          position: location,
          map: mapInstance,
          title: 'Your Location',
        });
        setUserMarker(marker);
      }

      const searchBox = new window.google.maps.places.SearchBox(searchInputRef.current);
      mapInstance.controls[window.google.maps.ControlPosition.TOP_LEFT].push(searchInputRef.current);
      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        // Clear existing marker
        if (userMarker) {
          userMarker.setMap(null);
        }

        const bounds = new window.google.maps.LatLngBounds();
        const place = places[0];
        
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };

        // Create new marker
        const newMarker = new window.google.maps.Marker({
          position: newLocation,
          map: mapInstance,
          title: place.name,
          animation: window.google.maps.Animation.DROP
        });
        
        setUserMarker(newMarker);
        onLocationChange(newLocation);

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }

        mapInstance.fitBounds(bounds);
        mapInstance.setZoom(Math.min(mapInstance.getZoom(), 15));
      });

      mapInstance.addListener('click', handleMapClick);
    };

    loadGoMapsAPI();

    return () => {
      if (userMarker) {
        userMarker.setMap(null);
      }
    };
  }, [location]);

  return (
    <div id="map" style={{ height: '87vh', width: '100%' }}>
      <input 
        ref={searchInputRef} 
        type="text" 
        placeholder="Search location" 
        style={{ 
          margin: '10px',
          padding: '10px',
          width: '300px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        }} 
      />
    </div>
  );
};

export default MapComponent;