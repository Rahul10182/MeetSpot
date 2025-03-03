import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const FriendSearchAndSelect = ({ firebaseID, setFormData }) => {
  const [friends, setFriends] = useState([]); // List of friends
  const [searchQuery, setSearchQuery] = useState(""); // Search input value
  const [selectedFriend, setSelectedFriend] = useState(""); // Selected friend ID
  const [loading, setLoading] = useState(false); // Loading state for API requests

  // Fetch friends based on search query
  const fetchFriends = async (query) => {
    try {
      setLoading(true);
      const response = await axios.post(`/friend/old`, {
        firebaseID: firebaseID, // Current user's ID
        searchQuery: query, // Search term
      });
      setFriends(response.data.friends || []);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
      setFriends([]); // Reset friends if there's an error
    } finally {
      setLoading(false);
    }
  };

  // Handle search query input and debounce API calls
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const delayDebounceFn = setTimeout(() => {
        fetchFriends(searchQuery);
      }, 300); // 300ms debounce

      return () => clearTimeout(delayDebounceFn);
    } else {
      setFriends([]); // Clear friends when query is empty
    }
  }, [searchQuery]);

  // Handle friend selection
  const handleFriendSelect = (friendId) => {
    setSelectedFriend(friendId);
    setFormData((prev) => ({
        ...prev,
        attendees: e.target.value.split(",").map((att) => att.trim()),
      })); 
  };

  return (
    <Box>
      {/* Search Field */}
      <TextField
        label="Search Friend"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Type friend name or email"
      />

      {/* Friend Selection Dropdown */}
      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <InputLabel id="friend-select-label">Select Friend</InputLabel>
        <Select
          labelId="friend-select-label"
          value={selectedFriend}
          onChange={(e) => handleFriendSelect(e.target.value)}
          disabled={loading || friends.length === 0}
        >
          {loading ? (
            <MenuItem disabled>
              <CircularProgress size={24} />
            </MenuItem>
          ) : friends.length > 0 ? (
            friends.map((friend) => (
              <MenuItem key={friend.firebaseID} value={friend.firebaseID}>
                {friend.name} ({friend.email})
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No friends found</MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FriendSearchAndSelect;