import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AuthLayout from './components/auth/layout';
import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register';
import UnauthPages from './pages/unauth-page';
import Home from './pages/Home';
import MeetingPoint from './pages/MeetingPoint';
import SettingsPage from './pages/profile/Settings';
import UserDashboard from './pages/profile/ProfileDetail';
import PrivateRoute from './pages/protectedRoute';
import SetProfile from './pages/profile/SetProfile';
import EventPlannerForm from './pages/profile/CreateEvent';
import ChatPage from './pages/ChatPage';
import ChatWindow from './components/ChatWindow';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [firebaseId, setFirebaseId] = useState(null);
  
  const auth = getAuth();

  // This useEffect ensures that Firebase Auth is checked and updates the local storage.
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          fullName: user.displayName,
          firebaseID: user.uid,
          email: user.email,
        };

        // Store user details in localStorage
        localStorage.setItem('user', JSON.stringify(userData));

        // Update local state with firebaseId
        setFirebaseId(user.uid);
        setAuthenticated(true);
      } else {
        console.log('User is not authenticated');
        setAuthenticated(false);
      }
    });
  }, [auth]);
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<AuthLogin />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>
          <Route element={<PrivateRoute user={firebaseId} />}>
            <Route path="/profile" element={<UserDashboard />}>
              <Route path="dashboard" element={<SetProfile />} />
              <Route path="createevent" element={<EventPlannerForm />} />
            </Route>
          </Route>
          <Route path="/unauth-page" element={<UnauthPages />} />
          <Route path="/" element={<Home />} />
          <Route path="/meeting-point" element={<MeetingPoint />} />
          <Route path="/chat" element={<ChatPage firebaseId={firebaseId} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
