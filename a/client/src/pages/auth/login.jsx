import React, { useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useFirebase } from '../../context/Firebase';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

function AuthLogin() {
  const firebase = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const result = await firebase.signInUserEmail(email, password);
        navigate('/');
    } catch (err) {
        console.log(err.message);
    }
  };


  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-semibold text-gray-900 text-center">
        Login to MeetSpot
      </h2>
      <p className="text-sm text-gray-600 text-center">
        Don’t have an account?{" "}
        <a href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
          Sign Up
        </a>
      </p>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            className="w-full py-3 px-4 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-500 transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
          
          
        </div>
      </form>
      <button
           onClick={async (e) => {
            e.preventDefault();
            try {
                const result = await firebase.signUpWithGoogle();
        
                if (result) {
                    navigate('/');
                }         
            } catch (err) {
                console.error("Error signing in:", err); 
                setError(err.message);
            }
        }}
        
        
          
            className="w-full flex items-center justify-center py-3 px-4 text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
          >
            <FcGoogle className="text-lg mr-2" /> 
            <span>Login with Google</span>
          </button>
    </div>
  );
}

export default AuthLogin;
