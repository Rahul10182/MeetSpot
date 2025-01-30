import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Chip,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

// Custom styling for the container
const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: "8px",
  boxShadow: theme.shadows[4],
  padding: theme.spacing(4),
  marginTop: theme.spacing(6),
}));

const MeetingDetailsPage = ({ formData, setFormData }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const firebaseID = user?.firebaseID;

  // Get the current date and time
  const currentDate = new Date();
  const today = currentDate.toISOString().split("T")[0]; // Format YYYY-MM-DD

  // Calculate the minimum time (2 hours from now)
  const minTime = new Date(currentDate.getTime() + 2 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[1]
    .slice(0, 5); // Format HH:MM

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:3000/friend/old", {
          firebaseID,
        });
        setFriends(response.data); // Use the response data directly
      } catch (error) {
        console.error("Failed to fetch friends", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, [firebaseID]);

  const handleFriendSelect = (event) => {
    const friendFirebaseID = event.target.value;
    const selected = friends.find((friend) => friend.firebaseID === friendFirebaseID);
    if (selected) {
      setSelectedFriend(`${selected.name} (${selected.email})`);
      setFormData((prevData) => ({
        ...prevData,
        attendees: [user.id, selected.id], // Add single friend
        createdBy: user.id,
      }));
    }
  };

  return (
    <StyledContainer maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          Meeting Details
        </Typography>
        <Box sx={{ marginTop: 4 }}>
          {/* Meeting Title */}
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Meeting Title
            </Typography>
            <TextField
              label="Enter Meeting Title"
              variant="outlined"
              fullWidth
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </Box>

          {/* Description */}
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Description
            </Typography>
            <TextField
              label="Additional Notes"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </Box>

          {/* Date Selection */}
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Select Date
            </Typography>
            <TextField
              type="date"
              variant="outlined"
              fullWidth
              value={formData.date || ""}
              inputProps={{ min: today }} // Restrict date to today or later
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </Box>

          {/* Time Selection */}
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Select Time
            </Typography>
            <TextField
              type="time"
              variant="outlined"
              fullWidth
              value={formData.time || ""}
              inputProps={{
                min: formData.date === today ? minTime : undefined, // Restrict time if date is today
              }}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
            />
          </Box>

          {/* Friends Selection */}
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Add Friends
            </Typography>
            {loading ? (
              <CircularProgress sx={{ margin: "16px auto", display: "block" }} />
            ) : (
              <FormControl fullWidth>
                <InputLabel id="friend-select-label">Select Friend</InputLabel>
                <Select
                  labelId="friend-select-label"
                  value={selectedFriend}
                  onChange={handleFriendSelect}
                  displayEmpty
                  renderValue={(selected) =>
                    selected ? (
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ marginRight: 1 }}>
                          {selected.charAt(0)}
                        </Avatar>
                        {selected}
                      </Box>
                    ) : (
                      "Select Friend"
                    )
                  }
                >
                  {friends.map((friend) => (
                    <MenuItem key={friend.firebaseID} value={friend.firebaseID}>
                      {friend.name} ({friend.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {selectedFriend && (
              <Chip
                label={selectedFriend}
                variant="outlined"
                sx={{ marginTop: 2 }}
              />
            )}
          </Box>
        </Box>
      </Paper>
    </StyledContainer>
  );
};

export default MeetingDetailsPage;