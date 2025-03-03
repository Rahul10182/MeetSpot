import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api/v1/venue' });

export const topVenues = async (userId) => {
    try {
        const response =  API.get(`/top${userId}`);
        return response;
    } catch (error) {
        console.error('Error creating venue:', error.response?.data || error.message);
        throw error; // Propagate the error to handle it in the calling function
    }
};

export const createVenue = async (venueData) => {
      return API.post('/create', venueData);
  };
