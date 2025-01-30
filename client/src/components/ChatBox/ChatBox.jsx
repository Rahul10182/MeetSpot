import React, { useEffect, useState, useRef } from 'react';
import { getuser } from '../../api/UserRequest';
import { getMessages, sendMessage } from '../../api/MessageRequest';
import { format } from 'timeago.js';
import InputEmoji from 'react-input-emoji';
import { Button } from '@mui/material';

const ChatBox = ({ chat, currentUser, setSendMessage, recieveMessage }) => {
    const [userData, setUserData] = useState(null);
    const [fname, setName] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const scroll = useRef();

    // Handle received message
    useEffect(() => {
        if (recieveMessage !== null && recieveMessage.chatId === chat._id) {
            setMessages([...messages, recieveMessage]);
        }
    }, [recieveMessage]);

    // Fetch chat header data (user details)
    useEffect(() => {
        if (chat !== null) {
            const userId = chat.participants.find(participant => participant._id !== currentUser);

            const getUserData = async () => {
                try {
                    const response = await getuser(userId);
                    setUserData(response.data);
                    setName(response.data.fullName);
                } catch (error) {
                    console.log(error);
                }
            };

            getUserData();
        }
    }, [chat, currentUser]);

    // Fetch chat messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await getMessages(chat._id);
                setMessages(response.data);
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
        setSendMessage({ ...message, recieverId: recieverId._id });
    };

    // Scroll to the last message
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="ChatBox-container">
            {chat ? (
                <>
                    <div className="chat-header mb-4 ">
                        <div className="follower flex items-center space-x-4">
                            <img
                                src={userData?.profilePicture ? userData.profilePicture : `https://avatar.iran.liara.run/username?username=${fname}`}
                                alt="User Profile"
                                className="followerImage rounded-full shadow-md border-2 border-gray-300"
                                style={{ width: '50px', height: '50px' }}
                            />
                            <div className="name text-sm font-semibold text-gray-800">
                                <span>{userData?.fullName}</span>
                            </div>
                        </div>
                    </div>


                    {/* Chat Box Messages */}
                    <div className="chat-body overflow-y-auto rounded-2xl max-h-[calc(100vh-200px)] p-4 shadow-inner">
                        {messages.map((message) => (
                            <div
                                key={message._id}
                                ref={scroll}
                                className={`message p-3 my-2 rounded-lg max-w-max ${message.sender === currentUser
                                    ? "bg-blue-400 text-white self-end ml-auto shadow-lg"
                                    : "bg-slate-300 text-gray-800 self-start mr-auto shadow-md"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="block text-sm">{message.content}</span>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-800">{format(message.createdAt)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Chat Sender */}
                    <div className="chat-sender flex items-center space-x-3 p-4 border-t border-gray-200 bg-white shadow-md rounded-b-lg">
                        <div className="text-xl text-gray-500">+</div>
                        <InputEmoji
                            value={newMessage}
                            onChange={handleChange}
                            className="flex-1 border border-gray-300 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full py-2 px-6 font-semibold text-lg shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
                        >
                            Send
                        </button>
                    </div>
                </>
            ) : (
                <span className="chatbox-empty-message text-gray-400 text-lg">Tap on a chat to start conversation...</span>
            )}
        </div>
    )
}

export default ChatBox;
