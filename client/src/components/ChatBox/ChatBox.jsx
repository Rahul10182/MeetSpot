import React, { useEffect, useState, useRef } from 'react'
import { getuser } from '../../api/UserRequest';
import { getMessages, sendMessage } from '../../api/MessageRequest';
import { format } from 'timeago.js';
import InputEmoji from 'react-input-emoji';
import "./ChatBox.css";
import { Button } from '@mui/material';


const ChatBox = ({ chat, currentUser, setSendMessage, recieveMessage }) => {
    const [userData, setUserData] = useState(null);
    const [fname, setName] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const scroll = useRef();


    //recieve message
    useEffect(() => {
        if (recieveMessage !== null && recieveMessage.chatId === chat._id) {
            setMessages([...messages, recieveMessage]);
        }
    }, [recieveMessage]);



    //fetch the header of chat means the user with whom the user is chatting
    useEffect(() => {
        if (chat !== null) {
            // console.log(currentUser);
            const userId = chat.participants.find(participant => participant._id !== currentUser);

            const getUserData = async () => {
                try {
                    const response = await getuser(userId);
                    setUserData(response.data);
                    // console.log("before Setting"+response.data.fullName);
                    setName(response.data.fullName);
                    // console.log("after Setting"+response.data.fullName);
                } catch (error) {
                    console.log(error);
                }
            };

            getUserData();
        }
    }, [chat, currentUser]);

    //fecthing messages of the chat
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await getMessages(chat._id);
                setMessages(response.data);
                console.log(response.data);
                // console.log(currentUser);
            } catch (error) {
                console.log(error);
            }
        };
        if (chat !== null) fetchMessages();
    }, [chat]);

    const handleChange = (newMessage) => {
        setNewMessage(newMessage);
    }

    const handleSend = async (e) => {
        e.preventDefault();

        const message = {
            chatId: chat._id,
            senderId: currentUser,
            content: newMessage,
        };

        setNewMessage("");

        try {
            const { data } = await sendMessage({ message });
            setMessages([...messages, data]);
        } catch (error) {
            console.error(error);
        }

        const recieverId = chat.participants.find(participant => participant._id !== currentUser);
        // console.log(recieverId);
        setSendMessage({ ...message, recieverId: recieverId._id });
    };

    //always scroll to the last message
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            <div className="ChatBox-container">
                {chat ? (
                    <>
                        <div className="chat-header">
                            <div className="follower">
                            <div className="flex items-center space-x-3">
                                <div>
                                    <img 
                                        src={userData?.profilePicture ? userData.profilePicture : `https://avatar.iran.liara.run/username?username=${fname}`} 
                                        alt="User Profile"
                                        className="followerImage rounded-full"
                                        style={{ width: '50px', height: '50px' }}
                                    />
                                </div>

                                <div className="name text-sm font-medium text-gray-800">
                                    <span>{userData?.fullName}</span>
                                </div>
                            </div>
                            </div>
                            <hr style={{ width: '85%', border: '0.1 px solid #ecece' }} />
                        </div>

                        {/* Chat Box Messages */}
                        <div className="chat-body">
                            {messages.map((message) => (
                                <div
                                    key={message._id}  // Make sure `message.id` is a unique identifier
                                    ref={scroll}
                                    className={
                                        message.sender === currentUser
                                          ? "message own"
                                          : "message other"
                                      }
                                    >
                                    <span>{message.content}</span>
                                    <span>{format(message.createdAt)}</span>
                                </div>
                            ))}
                        </div>
                        {/* chat-sender */}
                        <div className="chat-sender">
                            <div>+ </div>
                            <InputEmoji
                                value={newMessage}
                                onChange={handleChange}
                            />
                            <Button
                                variant="contained"
                                sx={{
                                background: 'linear-gradient(45deg, #f50057, #9c27b0)', // Gradient from Pink 500 to Purple 500
                                color: 'white',
                                borderRadius: '30px',
                                padding: '10px 20px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #f73378, #7b1fa2)', // Slightly darker on hover
                                },
                                transition: 'all 0.3s ease-in-out',
                                }}
                                onClick={handleSend}
                            >
                                Send
                            </Button>

                        </div>
                    </>
                ) : (
                    <span className='chatbox-empty-message'>Tap on a chat to start conversation...</span>
                )}

            </div>
        </>
    )
}

export default ChatBox