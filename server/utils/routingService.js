import axios from 'axios';
import axiosRetry from 'axios-retry';

const HERE_API_KEY = "Jfigr_wm9GvgO11YqmnP_mcw7ek_kxIG9VY5K0Jhyec";

// Configure axios with retry logic
const client = axios.create();
axiosRetry(client, {
    retries: 3,
    retryDelay: (retryCount) => {
        // Exponential backoff: 2^retryCount * 1000ms
        return Math.pow(2, retryCount) * 1000;
    },
    retryCondition: (error) => {
        // Retry on rate limit errors (429) and network errors
        return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
               error.response?.status === 429;
    }
});

export const getDuration = async (startLat, startLng, endLat, endLng) => {
    try {
        const response = await client.get(`https://router.hereapi.com/v8/routes`, {
            params: {
                transportMode: 'car',
                origin: `${startLat},${startLng}`,
                destination: `${endLat},${endLng}`,
                return: 'summary',
                apiKey: HERE_API_KEY
            }
        });

        return response.data.routes[0].sections[0].summary.duration;
    } catch (error) {
        console.error('Error fetching duration after retries:', error.message);
        return null;
    }
};