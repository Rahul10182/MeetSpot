import { User } from "../models/userModel.js";
import axios from "axios";
import Venue from "../models/venueModel.js"
import calculateMidpoint from '../utils/midpointUtil.js';
import { getDistance } from "../utils/getDistance.js"


const GO_MAPS_API_KEY = "AlzaSyXP55cfGepMsoWhHU6gk1g1e_7lxhH8ltC";


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

            // console.log("Google Places API Response:", response.data);  // Debugging log

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
                totalDuration: Math.abs(user1Duration + user2Duration)
            };
        }));

        // sort by total time taken
        const sortedVenues = venueWithDurations.sort((a, b) => Math.abs(a.totalDuration - b.totalDuration));

        res.status(200).json({
            message: "Venue suggestions are:",
            midpoint,
            venues: sortedVenues,
            success: true
        });

    } catch (error) {
      console.error("Error details:", error.message, error.stack);
      res.status(500).json({ 
        message: "Failed to select venue", 
        error: error.message, // Add this to get specific error info
        success: false 
      });
    }
    
};

export const selectVenue = async (req, res) => {
  const {
    firebaseId,
    friendFirebaseId,
    date,
    venueId,
    isNew,
    name,
    type,
    latitude,
    longitude,
    address,
    photo
  } = req.body;

  try {
    console.log({
      firebaseId,
      friendFirebaseId,
      venueId,
      isNew,
      name,
      type,
      latitude,
      longitude,
      address,
      date,
      photo
    });

    // Validate input
    if (!firebaseId || !friendFirebaseId)
      return res.status(400).json({ message: "Firebase IDs are required", success: false });

    if (isNew && (!name || !type || latitude == null || longitude == null || !address))
      return res.status(400).json({ message: "Missing required fields for new venue", success: false });

    if (!isNew && !mongoose.isValidObjectId(venueId))
      return res.status(400).json({ message: "Invalid venue ID", success: false });

    // Find users
    const user = await User.findOne({ fireBaseId:firebaseId });
    const friend = await User.findOne({ fireBaseId: friendFirebaseId });

    if (!user) return res.status(404).json({ message: "User not found", success: false });
    if (!friend) return res.status(404).json({ message: "Friend not found", success: false });

    // Venue creation/retrieval
    let venue;
    if (isNew) {
      venue = new Venue({
        name,
        type,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        address,
        date,
        photo,
        user: user._id,
        friend: friend._id
      });
      await venue.save();
    } else {
      venue = await Venue.findOne({ _id: venueId });
      if (!venue) return res.status(404).json({ message: "Venue not found", success: false });
    }

    // Check if venue already exists in user or friend profile
    if (user.profile?.venues.includes(venue._id) || friend.profile?.venues.includes(venue._id)) {
      return res.status(400).json({ message: "Venue already selected", success: false });
    }

    // Add venue to user and friend's profiles
    user.profile = user.profile || { venues: [] };
    friend.profile = friend.profile || { venues: [] };
    user.profile.venues.push(venue._id);
    friend.profile.venues.push(venue._id);

    await user.save();
    await friend.save();

    return res.status(201).json({
      message: "Venue selected successfully",
      venue: {
        venueId: venue._id,
        name: venue.name,
        type: venue.type,
        latitude: venue.location.coordinates[1],
        longitude: venue.location.coordinates[0],
        address: venue.address,
      },
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to select venue", success: false });
  }
};

// Controller to fetch all venues for a specific user
export const getUserVenues = async (req, res) => {
  try {
    const { firebaseID } = req.params;
    console.log(firebaseID);

    if (!firebaseID) {
      return res.status(400).json({ message: "Firebase ID is required" });
    }

    console.log(`Fetching venues for user with Firebase ID: ${firebaseID}`);

    // Find the user by Firebase ID and populate their venues
    const user = await User.findOne({ fireBaseId: firebaseID })
      .populate({
        path: 'profile.venues', // Populate venues
        populate: { 
          path: 'friend', // Populate friend's data
          model: 'User', // Ensure it's populated from User collection
          select: 'fullName' // Fetch only friend's name
        }
      });

    console.log("User data: ", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract and format venues with friend's name:
    const venuesWithFriends = user.profile.venues.map((venue) => ({
      ...venue.toObject(),
      friendName: venue.friend?.fullName ?? 'Unknown Friend',
    }));
    console.log("Venues with friends: ", venuesWithFriends);

    return res.status(200).json({ venues: venuesWithFriends });

  } catch (error) {
    console.error("Error fetching venues:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

