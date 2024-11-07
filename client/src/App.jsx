import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AuthLayout from './components/auth/layout';
import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register'; 
import UnauthPages from './pages/unauth-page'; 
import Home from './pages/Home';
import MeetingPoint from './components/Map/MeetingPoint';
import SettingsPage from './pages/profile/Settings';
import UserDashboard from './pages/profile/ProfileDetail';
import PrivateRoute from './pages/protectedRoute';
import SetProfile from './pages/profile/SetProfile';
import EventPlannerForm from './pages/profile/CreateEvent';

const App = () => {

  const [authenticated,setAuthenticated] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userData = {};
      userData.fullName = user.displayName;
      userData.firebaseID = user.uid;
      userData.email = user.email;
      localStorage.setItem('user', JSON.stringify(userData));

      axios.post('http://localhost:3000/authenticate', userData)
      .then(response => {
        
      })
      .catch(error => {
        
      });
      setAuthenticated(true);
    } else {
      console.log("error");
    }
  });
  return (

    
    <div className="flex flex-col overflow-hidden bg-white">
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<AuthLogin />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>
          <Route element={<PrivateRoute user={user} />}> 
            <Route path="/profile" element={<UserDashboard />} >
              <Route path="dashboard" element = {<SetProfile />} />
              <Route path="createevent" element = {<EventPlannerForm /> } />
            </Route>
          </Route>
          <Route path="/unauth-page" element={<UnauthPages />} />
          <Route path="/" element={<Home/>} />
          <Route path="/meeting-point" element={<MeetingPoint />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
