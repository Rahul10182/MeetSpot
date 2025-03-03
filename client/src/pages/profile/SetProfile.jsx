<<<<<<< HEAD
import { Avatar, Button, Divider, Paper, TextField, Typography, Snackbar } from '@mui/material';
import React, { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SetProfile = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const [name, setName] = useState(userData?.fullName || "");
    const [email] = useState(userData?.email || "");
    const [phone, setPhone] = useState(userData?.phone || "");
    const [gender, setGender] = useState(userData?.gender || "");
    const [photoURL, setPhotoURL] = useState(userData?.photoURL || "");
    const [openToast, setOpenToast] = useState(false);

    const auth = getAuth();  
    const navigate = useNavigate();

    const handleSaveChanges = async () => {
        const user = auth.currentUser;

        if (user) {
            if (name !== user.displayName) {
                await updateProfile(user, { displayName: name })
                    .catch((error) => console.error("Error updating display name: ", error));
            }

            if (photoURL !== user.photoURL) {
                await updateProfile(user, { photoURL: photoURL })
                    .catch((error) => console.error("Error updating photo URL: ", error));
            }

            setOpenToast(true);
            setTimeout(() => {
                navigate("/profile/dashboard");
            }, 2000);
        }
    };

    return (
        <div>
            <Paper elevation={3} className="p-8 rounded-lg bg-white">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-4">
                        <Avatar
                            alt={name}
                            src={photoURL || "/static/images/avatar/1.jpg"}
                            sx={{ width: 80, height: 80, backgroundColor: '#FFB6C1' }}
                        />
                        <div>
                            <Typography variant="h6" className="font-semibold">
                                {name || "User"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {email}
                            </Typography>
                        </div>
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        className="rounded-full"
                        onClick={handleSaveChanges}
                    >
                        Save Changes
                    </Button>
                </div>

                <Divider className="mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField
                        label="Full Name"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Phone No"
                        variant="outlined"
                        fullWidth
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                    />
                    <TextField
                        label="Gender"
                        variant="outlined"
                        fullWidth
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        placeholder="Select your gender"
                    />
                    <TextField
                        label="Country"
                        variant="outlined"
                        fullWidth
                        placeholder="Select your country"
                    />
                    <TextField
                        label="Language"
                        variant="outlined"
                        fullWidth
                        placeholder="Enter your preferred language"
                    />
                    <TextField
                        label="Time Zone"
                        variant="outlined"
                        fullWidth
                        placeholder="Enter your time zone"
                    />
                    <br /><br />
                </div>

            </Paper>

            <Snackbar
                open={openToast}
                autoHideDuration={3000}
                message="Profile updated successfully in backend"
                onClose={() => setOpenToast(false)}
            />
        </div>
    );
}

export default SetProfile;

=======
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
>>>>>>> anshul4
