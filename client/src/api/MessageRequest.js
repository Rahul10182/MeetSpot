import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api/v1' });

export const getMessages = async (chatId) => {
    console.log(chatId)
    return API.get(`/message/${chatId}`);
};

export const sendMessage = async (message) => {
    console.log(message);
    return API.post('/message/send',  message );
};