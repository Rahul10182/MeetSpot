import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { userChats } from '../../api/ChatRequest'
import Conversation from '../../components/Conversations/Conversation'
import HomeIcon from '@mui/icons-material/Home';
import {Box, Typography, Paper, List, ListItemButton, Avatar, Divider, IconButton,} from '@mui/material';
import ChatBox from '../../components/ChatBox/ChatBox';
import io from 'socket.io-client';

const Chatt = () => {
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [sendMessage, setSendMessage] = useState(null);
    const [recieveMessage, setRecieveMessage] = useState(null);
    const socket = useRef();

    //take the user from the local storage
    const user = JSON.parse(localStorage.getItem("user"));
    //console.log(user);
    const firebaseId = user ? user.firebaseID : null;
    //console.log(firebaseId);


    //socket connection to the server
    useEffect(() => {
        // Establish socket connection
        socket.current = io("http://localhost:8800");

        if (user && user.id) {
            // console.log("Sending user ID:", user.id);
            socket.current.emit("new-user-add", user.id); // Send user ID to server
        }

        // Listen for updates to the online users list
        socket.current.on("get-users", (users) => {
            setOnlineUsers(users);
            // console.log("Online Users:", users);
        });

        // Cleanup function to remove listeners on component unmount
        return () => {
            if (socket.current) {
                socket.current.disconnect(); // Disconnect socket on unmount
            }
        };
    }, [user.id]);

    //send message to the socket server 
    useEffect(() => {
        if(sendMessage !== null) {
            console.log("Sending message:", sendMessage);
            socket.current.emit("send-message", sendMessage);
        }
    },[sendMessage]);

    //recieve message from the socketserver
    useEffect(() => {
        if (socket.current) {
            socket.current.on("recieve-message", (data) => {
                console.log("Received message:", data);
                setRecieveMessage(data);
            });
        }
    }, []);

    useEffect(() => {
        // fetch all user chats
        const fetchChats = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const firebaseId = user ? user.firebaseID : null;

                if (!firebaseId) {
                    console.error("Firebase ID is missing");
                    return;
                }

                const response = await userChats(firebaseId);


                if (!Array.isArray(response.data)) {
                    console.error("Chats data is not an array or is missing.");
                    return;
                }

                // Filter out duplicate chats
                const uniqueChats = response.data.filter((chat, index, self) => {
                    const participantKey = chat.participants
                        .map(participant => participant._id)
                        .sort() // Sort to ensure the same key for both orders
                        .join('-'); // Combine into a single string as a unique key

                    // Find the first chat with this key
                    return (
                        index ===
                        self.findIndex(
                            otherChat =>
                                otherChat.participants
                                    .map(participant => participant._id)
                                    .sort()
                                    .join('-') === participantKey
                        )
                    );
                });

                // Update the chats state with unique chats
                setChats(uniqueChats);
                console.log("API Response:", uniqueChats);

                // console.log("Unique Chats:", uniqueChats);
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };

        fetchChats();
    }, []);

    const checkOnlineStatus = (chat) => {
        const chatMember = chat.participants.find((member) => member._id !== user.id);
        const online = onlineUsers.find((user) => user.userId === chatMember._id);
        return online ? true : false;
    };
    return (
        <Box display="flex" height="100vh" bgcolor="background.paper">
            {/* Sidebar */}
            <Paper
                elevation={3}
                sx={{
                    width: '25%',
                    padding: 2,
                    backgroundColor: 'grey.100',
                    overflowY: 'auto',
                }}
            >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Chats
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                    {chats.map((chat,index) => (
                        <ListItemButton
                            key={chat.id || `chat-${index}`}
                            onClick={() => setCurrentChat(chat)}
                            sx={{
                                borderRadius: 2,
                                '&:hover': { backgroundColor: 'grey.200' },
                            }}
                        >
                            <Conversation
                                data={chat}
                                currentUser={user.id}
                                online={checkOnlineStatus(chat)}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Paper>

            {/* Chat Section */}
            <Box flex={1} padding={3} display="flex" flexDirection="column">

                <ChatBox
                    chat={currentChat}
                    currentUser={user.id}
                    setSendMessage={setSendMessage}
                    recieveMessage={recieveMessage}
                />
            </Box>
        </Box>
    );
}

export default Chatt;