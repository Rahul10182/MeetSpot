import axios from "axios";

export const getDistance = async (originLat, originLng, destLat, destLng) => {

    const apiKey = "AlzaSyP6exizIh22-UNatVUUC-PtIH_dU7nZf2s";  //do not change it to process.env. apiKey As it is not woring that 
    const origin = `${originLat},${originLng}`;
    const destination = `${destLat},${destLng}`;
    const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
0
        if (data.rows[0].elements[0].status === "OK") {
            return {
                distance: data.rows[0].elements[0].distance.value, // distance in meters
                duration: data.rows[0].elements[0].duration.value//in seconds
            };
        } else {
            throw new Error('Error while finding distance: ' + data.rows[0].elements[0].status);
        }

    } catch (error) {
        console.error('Error making request:', error.message);
        return null;
    }
};
