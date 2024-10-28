import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import ProtectRoute from './components/auth/ProtectRoute';
import Login from "./pages/Login";

let user = false;

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route 
            path="/login" 
            element={
              <ProtectRoute user={!user} redirect='/'>
                <Login />
              </ProtectRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
