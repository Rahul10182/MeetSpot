import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import AuthLayout from './components/auth/layout';
import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register'; // Import the AuthRegister component
import UnauthPages from './pages/unauth-page'; // Import the UnauthPages component
import Home from './pages/Home';
import MeetingPoint from './components/Map/MeetingPoint';
import ProfileDetail from './pages/profile/ProfileDetail';
import SettingsPage from './pages/profile/Settings';

const App = () => {
  return (
    
    <div className="flex flex-col overflow-hidden bg-white">
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>

            <Route path="login" element={<AuthLogin />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfileDetail/>} />
            <Route path="register" element={<AuthRegister />} />

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
