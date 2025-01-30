import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, CardActions, Typography, Button, Grid, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const firebaseID = user ? user.firebaseID : null;
      console.log(firebaseID);

      if (!firebaseID) {
        alert("User not authenticated!");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post("http://localhost:3000/event/getUserEvent", { firebaseID });
        console.log(response);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        alert("Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleUpdate = (eventId) => {
    navigate(`/profile/Event/update/${eventId}`);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:3000/event/delete/${eventId}`);
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
        alert("Event deleted successfully.");
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event.");
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (events.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography variant="h6">No events found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}>
        Manage Events
      </Typography>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {event.eventName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Type: {event.eventType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {event.status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {event.location?.name || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Begins: {new Date(event.beginDate).toLocaleDateString()} at {event.beginTime}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ends: {new Date(event.endDate).toLocaleDateString()} at {event.endTime}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleUpdate(event._id)}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(event._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ManageEvent;
