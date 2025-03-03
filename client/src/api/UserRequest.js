import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api/v1' });

export const getUser = async (firebaseId) => {
    firebaseId = firebaseId.firebaseId;
    return API.post('/user/getID', { firebaseId });
};

export const getuser = async (userId) => {
    userId = userId._id;
    return API.get(`/user/getUser/${userId}`);
}