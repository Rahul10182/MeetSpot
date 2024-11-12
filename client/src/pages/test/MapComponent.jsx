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
    });
    setUserMarker(newMarker);
  };

  useEffect(() => {
    const loadGoMapsAPI = () => {
      if (!window.gomaps) {
        const script = document.createElement('script');
        script.src = `https://maps.gomaps.pro/maps/api/js?key=YOUR_API_KEY&libraries=places&async&defer`;
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

      const marker = new window.google.maps.Marker({
        position: location,
        map: mapInstance,
        title: 'Your Location',
      });
      setUserMarker(marker);

      const searchBox = new window.google.maps.places.SearchBox(searchInputRef.current);
      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        const place = places[0];
        const newLocation = place.geometry.location;

        mapInstance.setCenter(newLocation);
        onLocationChange({ lat: newLocation.lat(), lng: newLocation.lng() });

        if (userMarker) {
          userMarker.setMap(null);
        }

        const newMarker = new window.google.maps.Marker({
          position: newLocation,
          map: mapInstance,
          title: place.name,
        });
        setUserMarker(newMarker);
      });

      mapInstance.addListener('click', handleMapClick);
    };

    loadGoMapsAPI();

    return () => {
      if (userMarker) {
        userMarker.setMap(null);
      }
    };
  }, [location, userMarker]);

  return (
    <div id="map" style={{ height: '87vh', width: '100%' }}>
      {/* Input for search, using the ref */}
      <input ref={searchInputRef} type="text" placeholder="Search location" style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, padding: '10px' }} />
    </div>
  );
};

export default MapComponent;