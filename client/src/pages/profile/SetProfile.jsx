import { Avatar, Button, Divider, Paper, TextField, Typography } from '@mui/material'
import React from 'react'

const SetProfile = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const name = userData?.fullName;
    const email = userData?.email;
  return (
    <div className=''>
      <Paper elevation={3} className="p-8 ml-48 rounded-lg w-2/3 bg-white">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-4">
                            <Avatar
                                alt={name}
                                src="/static/images/avatar/1.jpg"
                                sx={{ width: 80, height: 80 ,backgroundColor: '#F08D99'}}
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
                            // onClick={handleSaveChanges}
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
                            placeholder={name || "Enter your full name"}
                            // inputRef={fullNameRef}
                        />
                        <TextField
                            label="Phone No"
                            variant="outlined"
                            fullWidth
                            placeholder={"You haven't entered your phone number"}
                            // inputRef={phoneRef}
                        />
                        <TextField
                            label="Gender"
                            variant="outlined"
                            fullWidth
                            placeholder="Select your gender"
                            // inputRef={genderRef}
                        />
                        <TextField
                            label="Country"
                            variant="outlined"
                            fullWidth
                            placeholder="Select your country"
                            // inputRef={countryRef}
                        />
                        <TextField
                            label="Language"
                            variant="outlined"
                            fullWidth
                            placeholder="Enter your preferred language"
                            // inputRef={languageRef}
                        />
                        <TextField
                            label="Time Zone"
                            variant="outlined"
                            fullWidth
                            placeholder="Enter your time zone"
                            // inputRef={timeZoneRef}
                        />
                        <br></br>
                        <br></br>
                    </div>

                    
                </Paper>
    </div>
  )
}

export default SetProfile
