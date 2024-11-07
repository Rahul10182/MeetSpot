import React from 'react';
import { TextField, MenuItem, Typography, Box, Button } from '@mui/material';

const EventPlannerForm = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center p-6">
      <Box className="bg-white shadow-xl rounded-xl w-full max-w-md p-10 space-y-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
        
        <Typography variant="h5" component="h2" className="text-center font-extrabold text-gray-800 mb-4">
          Event Planner
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          label="Event Name"
          placeholder="Enter event name"
          className="mb-4"
          InputProps={{
            className: "bg-gray-50"
          }}
        />

        <div className="flex gap-4 mb-4">
          <TextField
            select
            fullWidth
            variant="outlined"
            label="Event Type"
            defaultValue="Music"
            className="w-1/2 bg-gray-50"
          >
            <MenuItem value="Music">Music</MenuItem>
            <MenuItem value="Party">Party</MenuItem>
            <MenuItem value="Cultrual">Cultural Fest</MenuItem>
            <MenuItem value="Technical">Tecnical Fest</MenuItem>
            <MenuItem value="Other">any other</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            variant="outlined"
            label="Status"
            defaultValue="Planning"
            className="w-1/2 bg-gray-50"
          >
            <MenuItem value="Planning">Planning</MenuItem>
            <MenuItem value="Confirmed">Confirmed</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </div>

        <TextField
          fullWidth
          variant="outlined"
          label="Location"
          placeholder="Enter event location"
          className="mb-4"
          InputProps={{
            className: "bg-gray-50"
          }}
        />

        <TextField
          fullWidth
          variant="outlined"
          label="Photo URL"
          placeholder="Enter URL for event photo"
          className="mb-4"
          InputProps={{
            className: "bg-gray-50"
          }}
        />

        <TextField
          fullWidth
          variant="outlined"
          label="Event Description"
          placeholder="Enter event description"
          multiline
          rows={4}
          className="mb-4"
          InputProps={{
            className: "bg-gray-50"
          }}
        />

        <div className="flex gap-4 mb-4">
          <TextField
            fullWidth
            variant="outlined"
            label="Begin Date"
            placeholder="MM/DD/YYYY"
            className="w-1/2 bg-gray-50"
            InputProps={{
              className: "bg-gray-50"
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Begin Time"
            placeholder="HH:MM AM/PM"
            className="w-1/2 bg-gray-50"
            InputProps={{
              className: "bg-gray-50"
            }}
          />
        </div>

        <div className="flex gap-4 mb-4">
          <TextField
            fullWidth
            variant="outlined"
            label="End Date"
            placeholder="MM/DD/YYYY"
            className="w-1/2 bg-gray-50"
            InputProps={{
              className: "bg-gray-50"
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="End Time"
            placeholder="HH:MM AM/PM"
            className="w-1/2 bg-gray-50"
            InputProps={{
              className: "bg-gray-50"
            }}
          />
        </div>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          className="mt-6 transition-all duration-300 transform hover:bg-blue-600"
          style={{ padding: "12px 0", fontWeight: "bold" }}
        >
          Submit
        </Button>
      </Box>
    </div>
  );
};

export default EventPlannerForm;
