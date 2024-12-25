import React, { useState } from 'react';
import { Grid, Paper, Box, Typography, IconButton } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocationSetter from './LocationSetter';
import VenueDisplay from './VenueDisplay';
import MeetingScheduler from './MeetingScheduler';

const Header = () => {
    const [selectedSection, setSelectedSection] = useState('select');
    const [showChat, setShowChat] = useState(false);

    const toggleChat = () => {
        setShowChat((prev) => !prev);
    };

    const renderLeftSection = () => {
        switch (selectedSection) {
            case 'venue':
                return <VenueDisplay />;
            case 'meet':
                return <MeetingScheduler />;
            default:
                return <LocationSetter />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Navbar */}
            <Box
                component="header"
                className="bg-white shadow-md mx-auto flex justify-between items-center px-4 py-2 mt-4 mb-4"
                sx={{
                    width: '80%',
                    backgroundColor: '#f089cc',
                    height: '60px',
                    borderRadius: '30px',
                    padding: '0 20px',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                        background: 'linear-gradient(90deg, #ff7eb9, #ff65a3)',
                    },
                }}
            >
                <Typography variant="h5" className="text-white font-bold">
                    MeetSpot
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {[
                        { label: 'Location', icon: <AddLocationIcon />, section: 'select' },
                        { label: 'Venue', icon: <WhereToVoteIcon />, section: 'venue' },
                        { label: 'Meet', icon: <GroupsIcon />, section: 'meet' },
                        { label: 'Chat', icon: <ChatBubbleIcon />, action: toggleChat },
                        { label: 'Account', icon: <AccountCircleIcon /> },
                    ].map(({ label, icon, section, action }, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 0.3s ease',
                                '&:hover': { width: '120px' },
                                width: '40px',
                                overflow: 'hidden',
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                                marginRight: '10px',
                            }}
                        >
                            <IconButton
                                onClick={action || (() => setSelectedSection(section))}
                                sx={{ color: '#ff65a3' }}
                            >
                                {icon}
                            </IconButton>
                            <Typography variant="body1" sx={{ whiteSpace: 'nowrap', color: '#ff65a3', fontWeight: 'bold', ml: '5px' }}>
                                {label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Left Section - Dynamic content */}
            <Grid item xs={12} md={4}>
                <Paper className="shadow-md p-4">
                    {renderLeftSection()}
                </Paper>
            </Grid>

            {/* Optional Chat Section */}
            {showChat && (
                <Grid item xs={12} md={8}>
                    {/* Replace with your Chat component */}
                    <Paper className="shadow-md p-4">Chat Section</Paper>
                </Grid>
            )}
        </div>
    );
};

export default Header;