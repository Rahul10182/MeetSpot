import React, { useEffect, useState } from 'react'
import { Avatar, Box, Typography } from '@mui/material';
import { getuser } from '../../api/UserRequest';


const Conversation = ({ data, currentUser , online}) => {
    const [userData, setUserData] = useState(null);
    const[fname, setName] = useState(null);
    useEffect(() => {
        //fetch the ids which are not user himself means his friends
        // console.log(currentUser);
        // console.log(data.participants);
        const userId = data.participants.find(participant => participant._id !== currentUser);
        // console.log(userId);
        try {
            const getUserData = async () => {
                const { data } = await getuser(userId);
                setUserData(data);
                // console.log(data);
                // console.log("Before Setting "+data.fullName);
                setName(data.fullName);
                // console.log("After Setting FullName "+data.fullName);
                
            }
            getUserData();
        } catch (error) {
            console.log(error);
        }
    }, []);
    return (
        <>
        
        <Box
            display="flex"
            alignItems="center"
            p={1}
            borderRadius={1}
            sx={{
                backgroundColor:'transparent',
                '&:hover': { backgroundColor: '#E2E8F0', cursor: 'pointer' },
            }}
        >
            {online && (
                <Box
                    sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: 'greenyellow',
                        position: 'absolute',
                        marginLeft: -2,
                    }}
                ></Box>
            )}

            <Avatar
                src={userData?.profilePicture || `https://avatar.iran.liara.run/username?username=${fname}`}
                alt="User Profile"
                sx={{ width: 45, height: 45, mr: 2 }}
            />
            <Typography variant="body1" fontWeight="bold">
                {userData?.fullName || 'Unknown'}
            </Typography>
        </Box>
        {/* <hr style={{ width: '85%', border: '0.1 px solid #ecece' }} /> */}
        </>
    );
}

export default Conversation