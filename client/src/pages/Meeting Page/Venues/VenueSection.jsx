import React from "react";
import { Container, Typography, Box, Button, CircularProgress, Paper } from "@mui/material";
import VenuesFind from "./VenuesFind"; // Ensure this imports your VenuesFind component

const VenuesSection = ({ userLocation, friendLocation, formData, setFormData}) => {
  // Check if both locations are available
  const isLocationAvailable = userLocation && friendLocation;

  return (

    <Container>
      {isLocationAvailable ? (
        <>
          {/* Venues Find Component */}
          <Paper elevation={3} style={{ padding: "24px", width: "100%", marginBottom: "24px" }}>
            <Box>
              <VenuesFind
                userLocation={userLocation}
                friendLocation={friendLocation}
                formData={formData}
                setFormData={setFormData}
              />
            </Box>
          </Paper>
        </>
      ) : (
        // Loading Indicator if locations are unavailable
        <Box className="flex items-center justify-center min-h-screen">
          <Typography variant="h6" gutterBottom>
           
            Try Entering The User And Friend Location...
          </Typography>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
};

export default VenuesSection;