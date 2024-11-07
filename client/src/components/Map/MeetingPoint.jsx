import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLocation } from '../../store/location-slice/locationSlice';

// Coordinates for Prayagraj mini college
const prayagrajCollegeCenter = { lat: 25.4358, lng: 81.8463 };

const MeetingPointPage = () => {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.location);
  const [map, setMap] = useState(null);
  const [searchBox, setSearchBox] = useState(null);

  // Load Google Maps API script and initialize map
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.gomaps.pro/maps/api/js?key=AlzaSyk6pT6UN3zX7mvm6vOtGmO3TtIN9iKR-rH&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        document.body.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      const mapOptions = {
        center: prayagrajCollegeCenter,
        zoom: 14,
      };

      const mapInstance = new window.google.maps.Map(document.getElementById('map'), mapOptions);
      setMap(mapInstance);

      // Set up Places search box
      const input = document.getElementById('search-input');
      const searchBoxInstance = new window.google.maps.places.SearchBox(input);
      setSearchBox(searchBoxInstance);

      // Update map center and add a marker when a place is selected
      searchBoxInstance.addListener('places_changed', () => {
        const places = searchBoxInstance.getPlaces();
        if (places.length === 0) return;

        const place = places[0];
        const location = place.geometry.location;

        mapInstance.setCenter(location);
        new window.google.maps.Marker({
          position: location,
          map: mapInstance,
          title: place.name,
        });

        dispatch(setLocation({
          lat: location.lat(),
          lng: location.lng(),
          name: place.name,
        }));
      });
    };

    loadGoogleMapsAPI();
  }, [dispatch]);

  return (
    <div className="flex h-screen">
      {/* Search Sliderbar */}
      <div className="w-1/4 bg-gray-100 p-6 space-y-4">
        <h2 className="text-2xl font-bold">Find a Location</h2>
        <input
          id="search-input"
          type="text"
          placeholder="Search for a location"
          className="w-full p-2 border border-gray-300 rounded"
        />
      <div>
          
      </div>  
      </div>

      {/* Map */}
      <div id="map" className="w-3/4" style={{ height: '100vh', border: '1px solid #ccc' }}></div>
    </div>
  );
};

export default MeetingPointPage;