import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLocation } from '../store/location-slice/locationSlice';
import Friend from '../components/Meet/Friend';
import Navbar from "../components/Homepage/Navbar";

// Coordinates for Prayagraj mini college
const prayagrajCollegeCenter = { lat: 25.4358, lng: 81.8463 };

const MeetingPointPage = () => {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.location);
  const [map, setMap] = useState(null);

  // Load GoMaps API script and initialize map
  useEffect(() => {
    const loadGoMapsAPI = () => {
      if (!window.gomaps) {
        const script = document.createElement('script');
        script.src = `https://maps.gomaps.pro/maps/api/js?key=AlzaSywFl8hTnkxrZmvVDkLTfmgRzbUHXtpQg1F&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        document.body.appendChild(script);
  
        script.onload = () => {
          console.log('GoMaps API loaded successfully.');
          initializeMap();
        };
  
        script.onerror = () => {
          console.error('Failed to load GoMaps API. Verify the API key and URL.');
        };
  
      } else {
        initializeMap();
      }
    };
  
    const initializeMap = () => {
      try {
        const mapOptions = {
          center: prayagrajCollegeCenter,
          zoom: 14,
        };
  
        const mapInstance = new window.google.maps.Map(document.getElementById('map'), mapOptions);
        setMap(mapInstance);
      } catch (error) {
        console.error('Error initializing the map:', error);
      }
    };
  
    loadGoMapsAPI();
  }, []);
  
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar at the top */}
      <Navbar />

      {/* Page Content: Sidebar and Map */}
      <div className="flex flex-grow">
        {/* Sidebar with Friend component */}
        <div className="w-2/5 bg-gray-100 p-6">
          <Friend map={map} />
        </div>

        {/* Map */}
        <div
          id="map"
          className="flex-grow"
          style={{ height: 'calc(100vh - 64px)', border: '1px solid #ccc' }}
        ></div>
      </div>
    </div>
  );
};

export default MeetingPointPage;
