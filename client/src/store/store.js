import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice'; 
import locationReducer from './location-slice/locationSlice';
import placesReducer from "./location-slice/placeSlice"
import  userReducer  from "./user-slice/userSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        location: locationReducer,
        places: placesReducer,
        user: userReducer,
    },
});

export default store;
