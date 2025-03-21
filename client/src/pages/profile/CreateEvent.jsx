<<<<<<< HEAD
import React, { useState } from 'react';
import { TextField, MenuItem, Typography, Box, Button } from '@mui/material';
import axios from 'axios';

const EventPlannerForm = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const firebaseID = userData?.firebaseID;
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'Music',
    status: 'Planning',
    location: '',
    photoUrl: '',
    description: '',
    beginDate: '',
    beginTime: '',
    endDate: '',
    endTime: '',
    firebaseID
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/eventRegister', formData);
      console.log('Event created successfully:', response.data);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br bg-blue-300 min-h-screen flex items-center justify-center p-6">
      <Box className="bg-white shadow-4xl rounded-xl border-2 w-full max-w-md p-10 space-y-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
        
        <Typography variant="h5" component="h2" className="text-center font-extrabold text-gray-800 mb-4">
          Event Planner
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          label="Event Name"
          placeholder="Enter event name"
          name="eventName"
          value={formData.eventName}
          onChange={handleChange}
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
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className="w-1/2 bg-gray-50"
          >
            <MenuItem value="Music">Music</MenuItem>
            <MenuItem value="Party">Party</MenuItem>
            <MenuItem value="Cultural">Cultural Fest</MenuItem>
            <MenuItem value="Technical">Technical Fest</MenuItem>
            <MenuItem value="Other">Any other</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            variant="outlined"
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
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
          name="location"
          value={formData.location}
          onChange={handleChange}
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
          name="photoUrl"
          value={formData.photoUrl}
          onChange={handleChange}
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
          name="description"
          value={formData.description}
          onChange={handleChange}
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
            name="beginDate"
            value={formData.beginDate}
            onChange={handleChange}
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
            name="beginTime"
            value={formData.beginTime}
            onChange={handleChange}
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
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
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
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
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
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </div>
  );
};

export default EventPlannerForm;
=======
import React, { useState } from 'react';
import { TextField, MenuItem, Typography, Box, Button } from '@mui/material';
import axios from 'axios';

const EventPlannerForm = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const firebaseID = userData?.firebaseID;
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'Music',
    status: 'Planning',
    location: '',
    photoUrl: '',
    description: '',
    beginDate: '',
    beginTime: '',
    endDate: '',
    endTime: '',
    firebaseID,
  });
  console.log(firebaseID);
  console.log(formData);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/event/create', formData);
      console.log('Event created successfully:', response.data);

      // Show success message and hide form
      setShowSuccess(true);

      // Hide success message and show form again after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          eventName: '',
          eventType: 'Music',
          status: 'Planning',
          location: '',
          photoUrl: '',
          description: '',
          beginDate: '',
          beginTime: '',
          endDate: '',
          endTime: '',
          firebaseID,
        });
      }, 5000);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className=" bg-gradient-to-r from-pink-200 to-pink-400 min-h-screen flex items-center justify-center p-6">
      <Box className="bg-white shadow-4xl rounded-xl border-2 w-full max-w-md p-10 space-y-6">
        {showSuccess ? (
          <Typography variant="h6" component="p" className="text-center text-green-600 font-semibold">
            Event Created Successfully!
          </Typography>
        ) : (
          <>
            <Typography variant="h5" component="h2" className="text-center font-extrabold text-gray-800 mb-4">
              Event Planner
            </Typography>

            <TextField
              fullWidth
              variant="outlined"
              label="Event Name"
              placeholder="Enter event name"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              className="mb-4"
            />

            <div className="flex gap-4 mb-4">
              <TextField
                select
                fullWidth
                variant="outlined"
                label="Event Type"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-1/2"
              >
                <MenuItem value="Music">Music</MenuItem>
                <MenuItem value="Party">Party</MenuItem>
                <MenuItem value="Cultural">Cultural Fest</MenuItem>
                <MenuItem value="Technical">Technical Fest</MenuItem>
                <MenuItem value="Other">Any other</MenuItem>
              </TextField>

              <TextField
                select
                fullWidth
                variant="outlined"
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-1/2"
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
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mb-4"
            />

            <TextField
              fullWidth
              variant="outlined"
              label="Photo URL"
              placeholder="Enter URL for event photo"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              className="mb-4"
            />

            <TextField
              fullWidth
              variant="outlined"
              label="Event Description"
              placeholder="Enter event description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              className="mb-4"
            />

            <div className="flex gap-4 mb-4">
              <TextField
                fullWidth
                label="Begin Date"
                type="date"
                name="beginDate"
                value={formData.beginDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                className="w-1/2"
              />
              <TextField
                fullWidth
                label="Begin Time"
                type="time"
                name="beginTime"
                value={formData.beginTime}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                className="w-1/2"
              />
            </div>

            <div className="flex gap-4 mb-4">
              <TextField
                fullWidth
                label="End Date"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                className="w-1/2"
              />
              <TextField
                fullWidth
                label="End Time"
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                className="w-1/2"
              />
            </div>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              className="mt-6"
              style={{ padding: "12px 0", fontWeight: "bold" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </>
        )}
      </Box>
    </div>
  );
};

export default EventPlannerForm; 
>>>>>>> anshul4
