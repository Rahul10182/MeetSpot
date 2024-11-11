import { User } from "../models/userModel.js";
import Venue from "../models/venueModel.js";
import axios from "axios";
// import {Venue} from "../models/venueModel.js"
import calculateMidpoint from '../utils/midpointUtil.js';
import { getDistance } from "../utils/getDistance.js"

const GO_MAPS_API_KEY = "AlzaSyP6exizIh22-UNatVUUC-PtIH_dU7nZf2s";

// Helper function to fetch photos for a venue
const fetchVenuePhoto = async (placeId) => {
    try {
        const response = await axios.get("https://maps.gomaps.pro/maps/api/place/details/json", {
            params: {
                place_id: placeId,
                key: GO_MAPS_API_KEY,
            }
        });

        const photoReference = response.data.result.photos ? response.data.result.photos[0].photo_reference : null;
        
        if (photoReference) {
            const photoUrl = `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GO_MAPS_API_KEY}`;
            return photoUrl;  // Return the photo URL
        } else {
            return null;  // No photo available for this venue
        }
    } catch (error) {
        console.error("Error fetching venue photo:", error);
        return null;  // If there's an error, return null
    }
};

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
        const midpoint = calculateMidpoint(user1Location, user2Location);

        // Find distance between the users
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

            // Process response and add photos to the venue
            venues = await Promise.all(response.data.results.map(async place => {
                const photoUrl = await fetchVenuePhoto(place.place_id);
                return {
                    venueId: place.place_id,
                    name: place.name,
                    type,
                    latitude: place.geometry.location.lat,
                    longitude: place.geometry.location.lng,
                    address: place.vicinity,
                    photoUrl,  // Add photo URL to the venue
                };
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

                // Process response and add photos to the venue
                const venuesForType = await Promise.all(response.data.results.map(async place => {
                    const photoUrl = await fetchVenuePhoto(place.place_id);
                    return {
                        venueId: place.place_id,
                        name: place.name,
                        type: venueType,  // Use the type from the database
                        latitude: place.geometry.location.lat,
                        longitude: place.geometry.location.lng,
                        address: place.vicinity,
                        photo:photoUrl,  // Add photo URL to the venue
                    };
                }));

                venues = venues.concat(venuesForType);
            }
        }

        // Time taken by each user
        const venueWithDurations = await Promise.all(venues.map(async (venue) => {
            // User 1 time to reach venue
            const user1 = await getDistance(user1Location.latitude, user1Location.longitude, venue.latitude, venue.longitude);
            const user1Duration = user1.duration;
            const user2 = await getDistance(user2Location.latitude, user2Location.longitude, venue.latitude, venue.longitude);
            const user2Duration = user2.duration;

            return {
                ...venue,
                user1Duration,
                user2Duration,
                totalDuration: Math.abs(user1Duration + user2Duration)
            };
        }));

        // Sort by total time taken
        const sortedVenues = venueWithDurations.sort((a, b) => Math.abs(a.totalDuration - b.totalDuration));

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




export const selectVenue = async (req, res) => {
  const { firebaseId, venueId, isNew, name, type, latitude, longitude, address,time,photo } = req.body;

  try {

    console.log(firebaseId);
    console.log(venueId);
    console.log(isNew);
    console.log(name);
    console.log(type);
    console.log(latitude);
    console.log(longitude);
    console.log(address);
    console.log(time);
    console.log(photo);
    // Validate input
    if (!firebaseId) return res.status(400).json({ message: "Firebase ID is required", success: false });
    if (isNew && (!name || !type || !latitude || !longitude)) {
      return res.status(400).json({ message: "Missing required fields for new venue", success: false });
    }

    // Validate latitude and longitude
    if (isNew && (typeof latitude !== 'number' || typeof longitude !== 'number')) {
      return res.status(400).json({ message: "Latitude and Longitude must be numbers", success: false });
    }
    if (!time) {
      return res.status(400).json({ message: "Time is not provided", success: false });
    }

    // Find the user
    const user = await User.findOne({ fireBaseId : firebaseId});
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    let venue;

    if (isNew) {
      // Create a new venue
      venue = new Venue({
        name,
        type,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        address,
        time,
        photo,
      });
      await venue.save();
    } else {
      // Retrieve existing venue
      venue = await Venue.findById(venueId);
      if (!venue) {
        return res.status(404).json({ message: "Venue not found", success: false });
      }
    }

    // Check if venue is already visited
    if (user.profile.venues.includes(venue._id)) {
      return res.status(400).json({ message: "Venue already selected", success: false });
    }

    // Add venue to user's profile
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
        address: venue.address,
        photo:photo,
        time:time
      },
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to select venue", success: false });
  }
};



// Controller to fetch all venues for a specific user
export const getUserVenues = async (req, res) => {
  try {
      const { firebaseID } = req.params; // Get fireBaseId from query params
      console.log(firebaseID);

      // Find the user by fireBaseId and populate their venues
      const fireBaseId = firebaseID
      const user = await User.findOne({ fireBaseId }).populate('profile.venues');

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ venues: user.profile.venues });
  } catch (error) {
      console.error("Error fetching venues:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
};


