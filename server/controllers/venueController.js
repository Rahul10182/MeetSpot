
import { User } from "../models/userModel.js";
import axios from "axios";
import Venue from "../models/venueModel.js"

const HERE_API_KEY = "Jfigr_wm9GvgO11YqmnP_mcw7ek_kxIG9VY5K0Jhyec";

const calculateMidpoint = (loc1, loc2) => ({
    latitude: (loc1.latitude + loc2.latitude) / 2,
    longitude: (loc1.longitude + loc2.longitude) / 2,
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getDuration = async (startLat, startLng, endLat, endLng) => {
    const maxRetries = 3;
    let attempts = 0;

    while (attempts < maxRetries) {
        try {
            const response = await axios.get(`https://router.hereapi.com/v8/routes`, {
                params: {
                    transportMode: 'car',
                    origin: `${startLat},${startLng}`,
                    destination: `${endLat},${endLng}`,
                    return: 'summary',
                    apiKey: HERE_API_KEY,
                },
            });

            return response.data.routes[0].sections[0].summary.duration;
        } catch (error) {
            if (error.response && error.response.status === 429 && attempts < maxRetries - 1) {
                const retryAfter = error.response.headers['retry-after'] || 1;
                console.warn(`Rate limited. Retrying after ${retryAfter} seconds...`);
                await delay(retryAfter * 1000);
                attempts++;
            } else {
                console.error('Error fetching duration:', error.message);
                return null;
            }
        }
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

        let venues = [];
        if (type) {
            // Fetch venues of the specified type using HERE Places API
            const response = await axios.get(`https://discover.search.hereapi.com/v1/discover`, {
                params: {
                    at: `${midpoint.latitude},${midpoint.longitude}`,
                    q: type,
                    limit: 20,
                    apiKey: HERE_API_KEY,
                },
            });

            venues = response.data.items.map((place) => ({
                venueId: place.id,
                name: place.title,
                type,
                latitude: place.position.lat,
                longitude: place.position.lng,
                address: place.address.label,
            }));
        } else {
            // Fetch venues from the database
            const nearbyVenues = await Venue.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [midpoint.longitude, midpoint.latitude],
                            1 / 3963.2, // 1 mile radius
                        ],
                    },
                },
            }).lean();

            const venueTypes = [...new Set(nearbyVenues.map((venue) => venue.type))];

            if (venueTypes.length === 0) {
                return res.status(400).json({
                    message: "No venue types found in the database",
                    success: false,
                });
            }

            const venuePromises = venueTypes.map(async (venueType) => {
                const response = await axios.get(`https://discover.search.hereapi.com/v1/discover`, {
                    params: {
                        at: `${midpoint.latitude},${midpoint.longitude}`,
                        q: venueType,
                        limit: 20,
                        apiKey: HERE_API_KEY,
                    },
                });

                return response.data.items.map((place) => ({
                    venueId: place.id,
                    name: place.title,
                    type: venueType,
                    latitude: place.position.lat,
                    longitude: place.position.lng,
                    address: place.address.label,
                }));
            });

            const venueResults = await Promise.all(venuePromises);
            venues = venueResults.flat();
        }

        // Add duration info for each venue
        const venueWithDurations = await Promise.all(
            venues.map(async (venue) => {
                const [user1Duration, user2Duration] = await Promise.all([
                    getDuration(user1Location.latitude, user1Location.longitude, venue.latitude, venue.longitude),
                    getDuration(user2Location.latitude, user2Location.longitude, venue.latitude, venue.longitude),
                ]);

                if (user1Duration === null || user2Duration === null) return null;

                return {
                    ...venue,
                    user1Duration,
                    user2Duration,
                    totalDuration: user1Duration + user2Duration,
                };
            })
        );

        const filteredVenues = venueWithDurations.filter(Boolean);
        const sortedVenues = filteredVenues.sort((a, b) => a.totalDuration - b.totalDuration);

        res.status(200).json({
            message: "Venue suggestions are:",
            midpoint,
            venues: sortedVenues,
            success: true,
        });
    } catch (error) {
        console.error("Error details:", error.message, error.stack);
        res.status(500).json({
            message: "Failed to select venue",
            error: error.message,
            success: false,
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


