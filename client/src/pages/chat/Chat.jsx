import React, { useEffect, useRef, useState } from 'react';
import { userChats } from '../../api/ChatRequest';
import Conversation from '../../components/Conversations/Conversation';
import ChatBox from '../../components/ChatBox/ChatBox';
import io from 'socket.io-client';
import {
    Box,
    Grid,
    Typography,
    Paper,
    List,
    ListItemButton,
    Avatar,
    Divider,
    IconButton,
    Badge,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

const Chatt = () => {
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [sendMessage, setSendMessage] = useState(null);
    const [recieveMessage, setRecieveMessage] = useState(null);
    const socket = useRef();

    const user = JSON.parse(localStorage.getItem("user"));
    const firebaseId = user ? user.firebaseID : null;

    useEffect(() => {
        socket.current = io("http://localhost:8800");

        if (user && user.id) {
            socket.current.emit("new-user-add", user.id);
        }

        socket.current.on("get-users", (users) => {
            setOnlineUsers(users);
        });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [user.id]);

    useEffect(() => {
        if (sendMessage !== null) {
            socket.current.emit("send-message", sendMessage);
        }
    }, [sendMessage]);

    useEffect(() => {
        if (socket.current) {
            socket.current.on("recieve-message", (data) => {
                setRecieveMessage(data);
            });
        }
    }, []);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                if (!firebaseId) {
                    console.error("Firebase ID is missing");
                    return;
                }

                const response = await userChats(firebaseId);

                if (!Array.isArray(response.data)) {
                    console.error("Chats data is not an array or is missing.");
                    return;
                }

                const uniqueChats = response.data.filter((chat, index, self) => {
                    const participantKey = chat.participants
                        .map(participant => participant._id)
                        .sort()
                        .join('-');

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

                setChats(uniqueChats);
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
        <Grid container height="100vh">
            {/* Sidebar */}
            <Grid item xs={3} sx={{
                backgroundColor: '#F4F4F6',
                borderRight: '4px solid #E0E0E0',
                overflowY: 'auto',
            }}>
                <Box padding={2}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom className=' flex justify-center text-pink-700'>
                        Chats
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                    {chats.map((chat, index) => (
                        <ListItemButton
                        className="hover"
                        key={chat.id || `chat-${index}`}
                        onClick={() => setCurrentChat(chat)}
                        sx={{
                            borderRadius: 2,
                            mb: 1,
                            '&:hover': { backgroundColor: '#E2E8F0' },
                            padding: 1, // Reduce padding to make buttons shorter
                            minHeight: '48px', // Set a minimum height to reduce overall height
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        >
                        <Conversation
                            data={chat}
                            currentUser={user.id}
                            online={checkOnlineStatus(chat)}
                            style={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none', // Remove any default underline/line styles
                            }}
                        />
                        </ListItemButton>
                    ))}
                    </List>

                </Box>
            </Grid>

            {/* Chat Section */}
            <Grid item xs={9} display="flex" flexDirection="column" bgcolor="white">
                {currentChat ? (
                    <Box flex={1} display="flex" flexDirection="column" padding={3}>
                        <ChatBox
                            chat={currentChat}
                            currentUser={user.id}
                            setSendMessage={setSendMessage}
                            recieveMessage={recieveMessage}
                        />
                    </Box>
                ) : (
                    <Box
                        flex={1}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                        bgcolor="#F4F4F6"
                    >
                        <Typography variant="h5" fontWeight="bold" color="textSecondary">
                            Select a chat to start messaging
                        </Typography>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                backgroundColor: '#E0E7FF',
                                mt: 2,
                                fontSize: 50,
                            }}
                        >
                            💬
                        </Avatar>
                    </Box>
                )}
            </Grid>
        </Grid>
    );
};

export default Chatt;
