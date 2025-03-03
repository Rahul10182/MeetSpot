import React from 'react';
import { Avatar, Button, Divider, Paper, TextField, Typography } from '@mui/material';

const SetProfile = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const name = userData?.fullName;
  const email = userData?.email;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
      {/* Profile Form Container */}
      <Paper elevation={12} className="p-10 rounded-xl max-w-3xl w-full bg-white shadow-xl">
        {/* User Info Section */}
        <div className="flex items-center mb-6 space-x-6">
          <div className="relative">
            <Avatar
              alt={name}
              src="/static/images/avatar/1.jpg"
              sx={{ width: 100, height: 100, backgroundColor: '#F08D99', border: '4px solid white' }}
            />
            {/* Avatar hover effect */}
            <div className="absolute bottom-0 right-0">
              <Button variant="contained" color="primary" sx={{ borderRadius: '50%', padding: 1 }} size="small">
                Edit
              </Button>
            </div>
          </div>
          <div>
            <Typography variant="h4" className="font-bold text-gray-800 mb-1">{name || "User"}</Typography>
            <Typography variant="body2" className="text-gray-600">{email || "No email available"}</Typography>
          </div>
        </div>

        {/* Divider */}
        <Divider className="my-6" />

        {/* Profile Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            placeholder={name || 'Enter your full name'}
            className="bg-gray-50"
          />
          <TextField
            label="Phone No"
            variant="outlined"
            fullWidth
            placeholder={"You haven't entered your phone number"}
            className="bg-gray-50"
          />
          <TextField
            label="Gender"
            variant="outlined"
            fullWidth
            placeholder="Select your gender"
            className="bg-gray-50"
          />
          <TextField
            label="Country"
            variant="outlined"
            fullWidth
            placeholder="Select your country"
            className="bg-gray-50"
          />
          <TextField
            label="Language"
            variant="outlined"
            fullWidth
            placeholder="Enter your preferred language"
            className="bg-gray-50"
          />
          <TextField
            label="Time Zone"
            variant="outlined"
            fullWidth
            placeholder="Enter your time zone"
            className="bg-gray-50"
          />
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-center">
          <Button
            variant="contained"
            color="primary"
            className="w-full sm:w-auto px-8 py-3 text-white font-semibold text-lg rounded-full"
            sx={{ ':hover': { backgroundColor: '#F08D99' } }}
          >
            Save Changes
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default SetProfile;
