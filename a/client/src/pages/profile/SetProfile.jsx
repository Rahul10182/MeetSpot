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
