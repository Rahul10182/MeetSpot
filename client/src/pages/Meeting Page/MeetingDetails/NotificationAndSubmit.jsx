import React from "react";
import { Box, Container, Paper, Typography, Button } from "@mui/material";

const NotificationEmailPage = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
        <Box sx={{ marginTop: 4 }}>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Send Email</Typography>
            <Button variant="contained" color="primary">
              Send Email
            </Button>
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Send Notification</Typography>
            <Button variant="contained" color="secondary">
              Send Notification
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotificationEmailPage;