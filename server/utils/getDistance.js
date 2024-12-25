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

// Function to calculate distance using Here Maps API
export const getDistance = async (lat1, lon1, lat2, lon2) => {
    try {
        console.log("Calculating distance between:", lat1, lon1, "and", lat2, lon2);

        // Create the payload for the request
        const requestBody = {
            origins: [{ lat: lat1, lng: lon1 }],
            destinations: [{ lat: lat2, lng: lon2 }],
            travelMode: "car"
        };

        // Make the POST request to HERE Maps Matrix Routing API
        const response = await client.post(
            "https://router.hereapi.com/v8/matrix",
            requestBody,
            {
                params: {
                    apiKey: HERE_API_KEY
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        // Log the API response
        console.log("Here Maps API response:", response.data);

        // Extract distances from the response
        const data = response.data;

        if (data.matrix && data.matrix.distances) {
            const distance = data.matrix.distances[0][0]; // First origin to first destination
            return {
                distance, // Distance in meters
                duration: data.matrix.travelTimes ? data.matrix.travelTimes[0][0] : null, // Duration in seconds, if available
            };
        } else {
            throw new Error("Invalid response from HERE Maps API.");
        }
    } catch (error) {
        console.error("Error calculating distance:", error.message);
        throw new Error("Error calculating distance.");
    }
};