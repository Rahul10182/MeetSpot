import { User } from "../models/userModel.js";
import axios from "axios";
import Venue from "../models/venueModel.js"
import calculateMidpoint from '../utils/midpointUtil.js';
import { getDistance } from "../utils/getDistance.js"

const GO_MAPS_API_KEY = "AlzaSyk6pT6UN3zX7mvm6vOtGmO3TtIN9iKR-rH";


export const getVenueSuggestions = async (req, res) => {
    try {
        const { user1Location, user2Location, type } = req.body;

        if (!user1Location || !user2Location) {
            return res.status(400).json({
                message: 'Both user locations must be provided.',
                success: false,
            });
        }

        // Calculate the midpoint
        const midpoint = calculateMidpoint(
            user1Location,
            user2Location
        );

        //Find Distance Between The users
        const distanceResult = await getDistance(
            user1Location.latitude, user1Location.longitude,
            user2Location.latitude, user2Location.longitude
        );

        if (!distanceResult) {
            return res.status(500).json({
                message: 'Error calculating the distance between users.',
                success: false,
            });
        }

        const d = distanceResult.distance;  // distance in meters

        let venues = [];
        let venueTypes = [];

        if (type) {
            // If type is provided, use it directly
            const response = await axios.get("https://maps.gomaps.pro/maps/api/place/nearbysearch/json", {
                params: {
                    location: `${midpoint.latitude},${midpoint.longitude}`,
                    radius: 2000,  // Increased radius
                    type,  // Directly use the provided type
                    key: GO_MAPS_API_KEY
                }
            });

            console.log("Google Places API Response:", response.data);  // Debugging log

            venues = response.data.results.map(place => ({
                venueId: place.place_id,
                name: place.name,
                type,
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
                address: place.vicinity
            }));

        } else {
            // If no type is provided, use types from the database
            const nearbyVenues = await Venue.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [midpoint.longitude, midpoint.latitude],
                            1 / 3963.2  
                        ]
                    }
                }
            }).lean();

            venueTypes = [...new Set(nearbyVenues.map(venue => venue.type))];

            if (venueTypes.length === 0) {
                return res.status(400).json({
                    message: "No venue types found in the database",
                    success: false
                });
            }

            // For each type from the database, find venues via Google Places API
            for (const venueType of venueTypes) {
                const response = await axios.get("https://maps.gomaps.pro/maps/api/place/nearbysearch/json", {
                    params: {
                        location: `${midpoint.latitude},${midpoint.longitude}`,
                        radius: 2000,  // search radius
                        type: venueType,  // Use venue type from the database
                        key: GO_MAPS_API_KEY
                    }
                });

                // console.log(`Response for type ${venueType}:`, response.data);  //Debugg

                const venuesForType = response.data.results.map(place => ({
                    venueId: place.place_id,
                    name: place.name,
                    type: venueType,  // Use the type from the database
                    latitude: place.geometry.location.lat,
                    longitude: place.geometry.location.lng,
                    address: place.vicinity
                }));

                venues = venues.concat(venuesForType);
            }
        }


        // time taken by each user
        const venueWithDurations = await Promise.all(venues.map(async (venue) => {
            //user 1 time to reach veue
            const user1 = await getDistance(user1Location.latitude, user1Location.longitude, venue.latitude, venue.longitude);
            const user1Duration = user1.duration;
            const user2 = await getDistance(user2Location.latitude, user2Location.longitude, venue.latitude, venue.longitude);
            const user2Duration = user2.duration;

            return {
                ...venue,
                user1Duration,
                user2Duration,
                diffDuration: Math.abs(user1Duration - user2Duration)
            };
        }));

        // sort by total time taken
        const sortedVenues = venueWithDurations.sort((a, b) => Math.abs(a.diffDuration - b.diffDuration));

        res.status(200).json({
            message: "Venue suggestions are:",
            midpoint,
            venues: sortedVenues,
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to search for venues.", success: false });
    }
};


// Store the selected venue in user's profile
export const selectVenue = async (req, res) => {
    const { userId, venueId, isNew, name, type, latitude, longitude, address } = req.body;

    try {
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        let venue;

        if (isNew) {
            // Create a new venue if it is searched from api 
            venue = new Venue({
                name,
                type,
                location: {  // Correct GeoJSON format
                    type: 'Point',
                    coordinates: [longitude, latitude]  
                },
                address
            });
            await venue.save();
        } else {
            // if old venue already in database 
            venue = await Venue.findById(venueId);
            if (!venue) {
                return res.status(404).json({
                    message: 'Venue not found',
                    success: false
                });
            }
        }

        //venue already visited
        if (user.profile.venues.includes(venue._id)) {
            return res.status(400).json({
                message: 'Venue already selected',
                success: false
            });
        }

        // Add the venue to the user's profile
        user.profile.venues.push(venue._id);
        await user.save();

        res.status(201).json({
            message: "Venue selected successfully",
            venue: {
                venueId: venue._id,
                name: venue.name,
                type: venue.type,
                latitude: venue.location.coordinates[1],  
                longitude: venue.location.coordinates[0], 
                address: venue.address
            },
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to select venue", success: false });
    }
};
