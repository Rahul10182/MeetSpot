const calculateMidpoint = (user1Location, user2Location) => {
    const lat1 = parseFloat(user1Location.latitude);
    const long1 = parseFloat(user1Location.longitude);
    const lat2 = parseFloat(user2Location.latitude);
    const long2 = parseFloat(user2Location.longitude);

    return {
        latitude: (lat1 + lat2) / 2,
        longitude: (long1 + long2) / 2,
    };
};

export default calculateMidpoint;