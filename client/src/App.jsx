import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AuthLayout from './components/auth/layout';
import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register';
import UnauthPages from './pages/unauth-page';
import UserDashboard from './pages/profile/ProfileDetail';
import PrivateRoute from './pages/protectedRoute';
import SetProfile from './pages/profile/SetProfile';
import EventPlannerForm from './pages/event/CreatedEvents';
import FriendPage from './pages/profile/friends';
import FriendList from './pages/profile/oldFriend';
import FriendRequest from './pages/profile/reqFriend';
import FriendRequestSent from './pages/profile/FriendReqSent';
import EventsPage from './pages/Eventpage';
import Notifications from './pages/profile/Notifications';

import ShowMeetings from './pages/ShowMeetings';
import ScheduledMeetings from './pages/ScheduledMeetings';
import SearchEvents from './pages/profile/FamousEvent';
import ChatPage from './pages/chat/Chat'
import MeetspotLandingPage from './pages/landing/new';
import HomePage from './pages/home/HomePage';
import Contact from './pages/help_Contact/Contact';
import Chatt from './pages/chat/Chat';
import MainHome from './pages/home/MainHome';
import CreateMeetingPage from './pages/Meeting Page/MeetPage';
import FamousEvent from "./pages/profile/FamousEvent";
import ShowMeetingPage from './pages/Meeting Page/Show Meetings/MainMeeting';
import ShowMeetingDetails from "./pages/Meeting Page/Show Meetings/Meetings"
import NewEvent from './pages/event/NewEvent';
import UpdateEvent from './pages/event/UpdateEvent';
import ManageEvent from './pages/event/ManageEvent';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [firebaseId, setFirebaseId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        var nameis = user.displayName;
        if (!user.displayName) {
          nameis = "user"
        }
        let userData = {
          fullName: nameis,
          firebaseID: user.uid,
          email: user.email,
        };
        setFirebaseId(user.uid);
        console.log("Initial userData:", userData);

        localStorage.setItem('user', JSON.stringify(userData));

        axios.post('http://localhost:3000/api/v1/user/authenticate', userData)
          .then(response => {

            // Extract the user ID from the response
            const userId = response.data?.user?.id; // Safely access the nested id field
            if (userId) {
              userData = { ...userData, id: userId }; // Add id to userData
              localStorage.setItem("user", JSON.stringify(userData)); // Update localStorage with new userData
              console.log("Updated userData stored in localStorage:", userData);
            } else {
              console.warn("User ID not found in the response.");
            }
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

          <Route path = "/" element ={<MeetspotLandingPage/>} />

          <Route element={<PrivateRoute authenticated={authenticated} />}>
            <Route path="/profile" element={<UserDashboard />}>
              <Route path="dashboard" element={<SetProfile />} />
              <Route path ="ScheduledMeetings" element={<ScheduledMeetings/>}></Route>
              <Route path="createevent" element={<EventPlannerForm />} />
              <Route path="Event" element={<EventPlannerForm />} >
                <Route path="create" element={<NewEvent />} />
                <Route path="update/:eventId" element={<UpdateEvent />} />
                <Route path="manage" element={<ManageEvent />} />
              </Route>
              <Route path="show-meet">
                <Route path="user" element={<ShowMeetingPage />} />
                <Route path=":meetingId/user" element={<ShowMeetingDetails />}> </Route>
                <Route path=':meetingId/map/user' element={<ShowMeetings/>}></Route>
                
              </Route>



              <Route path="friends" element={<FriendPage />}>
                <Route path="old" element={<FriendList />} />
                <Route path="new" element={<FriendRequest />} />
                <Route path="sentreq" element={<FriendRequestSent />} />
              </Route>
              <Route path="famousEvents" element={<SearchEvents />}></Route>
              <Route path="notifications" element={<Notifications firebaseID = {firebaseId}/>} />
            </Route>
          
          {/* <Route path='/show-meet' element={<ShowMeetings></ShowMeetings>}></Route> */}
          <Route path="/unauth-page" element={<UnauthPages />} />
          {/* <Route path="/events" element={<EventsPage/>}  /> */}
          {/* <Route path = "/chat" element ={<ChatPage/>} /> */}
          
          
          <Route path = "/" element ={<HomePage/>} >
            <Route path = "events" element ={<EventsPage/>} />
            <Route element={<PrivateRoute authenticated={authenticated} />}>
              <Route path = "home" element ={<MainHome/>} />
            </Route>
            <Route path="create-meeting" element={<CreateMeetingPage />} />
            <Route path = "/famousEvent" element ={<FamousEvent/>} />
            {/* <Route path = "settings" element ={<Profile/>} /> */}
            <Route path = "chat" element ={<Chatt/>} />
            <Route path = "help" element ={<Contact></Contact>} />
            {/* <Route path = "help" element ={<HomePage/>} /> */}
          </Route>
        </Route>
        


      
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
