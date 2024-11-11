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
import UserDashboard from './pages/profile/ProfileDetail';
import PrivateRoute from './pages/protectedRoute';
import SetProfile from './pages/profile/SetProfile';
import EventPlannerForm from './pages/profile/CreateEvent';
import FriendPage from './pages/profile/friends';
import FriendList from './pages/profile/oldFriend';
import FriendRequest from './pages/profile/reqFriend';
import FriendRequestSent from './pages/profile/FriendReqSent';
import ChatPage from './pages/ChatPage';
import EventsPage from './pages/Eventpage';
import MeetSpotPage from './pages/MeetSpotPage';



const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [firebaseId, setFirebaseId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        var nameis = user.displayName;
        if(!user.displayName){
          nameis = "user"
        }
        const userData = {
          fullName: nameis,
          firebaseID: user.uid,
          email: user.email,
        };
        setFirebaseId(user.uid);
        console.log(userData)

        localStorage.setItem('user', JSON.stringify(userData));

        axios.post('http://localhost:3000/api/v1/user/authenticate', userData)
          .then(response => {
          })
          .catch(error => {
            console.error('Error during authentication request:', error);
          });

        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>

          <Route element={<PrivateRoute authenticated={authenticated} />}>
            <Route path="/profile" element={<UserDashboard />}>
              <Route path="dashboard" element={<SetProfile />} />
              <Route path="createevent" element={<EventPlannerForm />} />
              <Route path="friends" element={<FriendPage />}>
                <Route path="old" element={<FriendList />} />
                <Route path="new" element={<FriendRequest />} />
                <Route path="sentreq" element={<FriendRequestSent />} />
                 
              </Route>
            </Route>
          </Route>

          <Route path="/unauth-page" element={<UnauthPages />} />
          <Route path="/" element={<Home />} />
          <Route path="/meeting-point" element={<MeetingPoint />} />
          <Route path="/chat" element={<ChatPage firebaseID={firebaseId} />} />
          <Route path="/events" element={<EventsPage/>}  />
          <Route path="/test" element={<MeetSpotPage/>}  />
          

        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
