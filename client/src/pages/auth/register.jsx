import React, { useState } from 'react';
import { useFirebase } from '../../context/Firebase';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";

function AuthRegister() {
  const firebase = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== conPassword) {
      setError("Passwords do not match");
      return;
    }

    firebase.signupUserWithEmailAndPassword(email, password)
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const handleGoogleSignUp = () => {
    firebase.signUpWithGoogle()
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="w-full max-w-md space-y-8 mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center">
        Create a new account
      </h2>
      <p className="text-sm text-gray-600 text-center">
        Already have an account?{" "}
        <a href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Login
        </a>
      </p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <label htmlFor="Email" className="sr-only">Email</label>
            <input
              id="Email"
              name="Email"
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your Email"
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
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div>
            <label htmlFor="conPassword" className="sr-only">Confirm Password</label>
            <input
              id="conPassword"
              name="conPassword"
              type="password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Re-enter your password"
              onChange={(e) => setConPassword(e.target.value)}
              value={conPassword}
            />
          </div>
        </div>

        {error && <p className="mt-4 text-center text-red-500 text-sm">{error}</p>}

        <div className="space-y-4">
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Sign Up
          </button>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="group relative w-full flex justify-center items-center py-2 px-4 border-transparent text-sm font-semibold rounded-full text-black bg-white border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <FcGoogle className="text-xl mr-2" /> Sign Up with Google
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthRegister;