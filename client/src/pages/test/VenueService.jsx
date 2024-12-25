import axios from 'axios';

const apiKey = "AlzaSyW_ArwSIkDDvuo6b2q_ydRToUA6n-lVp-T";

export const fetchDistance = async (originLat, originLng, destLat, destLng) => {
  const origin = `${originLat},${originLng}`;
  const destination = `${destLat},${destLng}`;
  const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    return response.data.rows[0].elements[0].distance.text;
  } catch (error) {
    console.error('Error fetching distance:', error);
    return 'N/A';
  }
};

export const fetchVenues = async (userLocation, friendLocation, venueType) => {
  try {
    console.log(userLocation);
    console.log(friendLocation);
    console.log(venueType);
    const response = await axios.post('http://localhost:3000/api/v1/venue/get', {
      user1Location: userLocation,
      user2Location: friendLocation,
      type: venueType,
    });
    console.log(response.data);
    return response.data.venues;
  } catch (error) {
    console.error('Error fetching venues:', error);
    throw error;
  }
};

export const confirmVenue = async (firebaseId, selectedVenue) => {
  const venuePayload = {
    firebaseId,
    venueId: selectedVenue.id || selectedVenue.venueId,
    isNew: true,
    name: selectedVenue.name,
    type: selectedVenue.type,
    latitude: selectedVenue.latitude,
    longitude: selectedVenue.longitude,
    address: selectedVenue.address,
  };

  try {
    const response = await axios.post('http://localhost:3000/api/v1/venue/select', venuePayload);
    return response.data;
  } catch (error) {
    console.error('Error confirming the venue:', error);
    throw error;
  }
};
