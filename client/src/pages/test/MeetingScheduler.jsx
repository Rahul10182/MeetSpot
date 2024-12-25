import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const MeetingScheduler = () => {
  const [selectedTime, setSelectedTime] = useState(null);

  const handleTimeChange = (newValue) => {
    setSelectedTime(newValue);
  };

  const finalizeMeeting = () => {
    if (selectedTime) {
      alert(`Meeting scheduled at ${selectedTime.toLocaleTimeString()}`);
    } else {
      alert('Please select a time for the meeting');
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2, padding: 2 }}>
      <Typography variant="h6" align="center">Schedule Meeting</Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
          label="Select Meeting Time"
          value={selectedTime}
          onChange={handleTimeChange}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </LocalizationProvider>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={finalizeMeeting}
        sx={{ mt: 2 }}
      >
        Finalize Meeting
      </Button>
    </Box>
  );
};

export default MeetingScheduler;