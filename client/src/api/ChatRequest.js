import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api/v1' });

export const userChats = async (firebaseId) => {
    return API.get(`/chat/${firebaseId}`);
};