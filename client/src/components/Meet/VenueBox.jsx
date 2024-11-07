import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';

const VenueBox = ({ open, onClose, venues }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Venue Suggestions</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {venues.map((venue, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{ marginBottom: 2 }}>
                <CardMedia
                  component="img"
                  alt={venue.name}
                  height="140"
                  image={venue.photo || 'https://via.placeholder.com/150'}
                />
                <CardContent>
                  <Typography variant="h6">{venue.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {venue.address}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VenueBox;
