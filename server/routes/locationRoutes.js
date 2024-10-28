const express = require('express');
const router = express.Router();
const Location = require('../models/locationModel');
const axios = require('axios');


// Geocoding (Address to Coordinates)
router.post('/geocode', async (req, res) => {
    const { address } = req.body;
    try {
        const response = await axios.get(`https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GO_MAPS_API_KEY}`);
        const locationData = response.data;

        if (locationData.status === "OK") {
            const { lat, lng } = locationData.results[0].geometry.location;
            res.json({ latitude: lat, longitude: lng });
        } else {
            res.status(400).json({ message: locationData.status });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Go Maps Pro' });
    }
});


router.post('/reverse', async (req, res) => {
    const { latitude, longitude } = req.body;
    try {
        const response = await axios.get(`https://maps.gomaps.pro/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GO_MAPS_API_KEY}`);
        const locationData = response.data;

        if (locationData.status === "OK") {
            const address = locationData.results[0].formatted_address;
            res.json({ address });
        } else {
            res.status(400).json({ message: locationData.status });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Go Maps Pro' });
    }
});

// Save Location
router.post('/location', async (req, res) => {
    try {
        const location = new Location(req.body);
        await location.save();
        res.status(201).json(location);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;