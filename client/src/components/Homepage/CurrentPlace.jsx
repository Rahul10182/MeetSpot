import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setLocation } from '../../store/location-slice/locationSlice'; // Adjust the import path as necessary
import { setPlaces } from '../../store/location-slice/placeSlice'; // Adjust the import path as necessary

const CurrentPlace = () => {
  const [manualLatitude, setManualLatitude] = useState('');
  const [manualLongitude, setManualLongitude] = useState('');
  
  // Ensure this is coming from your Redux store
  const places = useSelector((state) => state.places.places) || []; // Default to an empty array
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchPlaces = async () => {
    if (!manualLatitude || !manualLongitude) {
      alert("Please enter both latitude and longitude.");
      return;
    }

    try {
      const response = await axios.get(`https://maps.gomaps.pro/maps/api/place/nearbysearch/json`, {
        params: {
          location: `${manualLatitude},${manualLongitude}`,
          radius: 5000,
          type: 'restaurant',
          key: 'AlzaSyvWPllahp-zPFwKQc1f9mNuKI7kjuBY1-F',
        },
      });

      console.log("API Response:", response.data);
      if (response.data.results) {
        dispatch(setPlaces(response.data.results)); // Dispatch action to set places
      } else {
        alert("No places found.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error fetching places data", error.response.data);
        alert(`Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        console.error("No response received", error.request);
        alert("Error: No response from the server.");
      } else {
        console.error("Error", error.message);
        alert("Error: " + error.message);
      }
    }
  };

  const handlePlaceClick = (place) => {
    // Correctly dispatch location data to Redux store
    if (place.geometry && place.geometry.location) {
      dispatch(setLocation({
        lat: place.geometry.location.lat, // Accessing property directly
        lng: place.geometry.location.lng, // Accessing property directly
        name: place.name || "Unknown Place",
      }));
      
      navigate('/meeting-point'); // Navigate to the meeting point
    } else {
      alert("Location data is not available for this place.");
    }
  };

  return (
    <div className="p-8 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-8">Famous Places Near You</h2>

      <div className="mb-4 flex flex-col items-center justify-center align-middle">
        <input
          type="text"
          placeholder="Latitude"
          value={manualLatitude}
          onChange={(e) => setManualLatitude(e.target.value)}
          className="border p-2 mb-2 w-80 text-center align-middle flex items-center"
        />
        <input
          type="text"
          placeholder="Longitude"
          value={manualLongitude}
          onChange={(e) => setManualLongitude(e.target.value)}
          className="border p-2 mb-4 w-80 text-center align-middle flex items-center"
        />
        <button
          onClick={fetchPlaces}
          className="bg-blue-500 text-white w-80 px-4 py-2 rounded"
        >
          Fetch Places for Manual Location
        </button>
        26.8467
        80.9462
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place, index) => (
          <div
            key={index}
            onClick={() => handlePlaceClick(place)}
            className="bg-white shadow-md rounded-lg overflow-hidden p-4 cursor-pointer hover:shadow-lg"
          >
            <h3 className="text-lg font-bold text-gray-800">{place.name || "Unknown Place"}</h3>
            <p>{place.vicinity || "No address provided"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentPlace;
