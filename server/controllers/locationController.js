import { Location } from "../models/locationModel.js";
import mongoose from "mongoose";

// Create a new location
export const createLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        const newLocation = new Location({
            latitude,
            longitude
        });

        await newLocation.save();
        res.status(201).json(newLocation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an existing location
export const updateLocation = async (req, res) => {
    try {
        const { locationId } = req.params;
        const { latitude, longitude } = req.body;

        const location = await Location.findById(locationId);
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        // Update location details
        location.latitude = latitude;
        location.longitude = longitude;
        await location.save();

        res.status(200).json({ message: "Location updated", location });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a location
export const deleteLocation = async (req, res) => {
    try {
        const { locationId } = req.params;

        const location = await Location.findByIdAndDelete(locationId);
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        res.status(200).json({ message: "Location deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all locations
export const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
