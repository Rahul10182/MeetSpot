import React, { useState } from 'react';
import { login } from "../../services/operations/authAPI";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ toggleLogin }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;

    const handleOnSubmit = (e) => {
        e.preventDefault();
        // Dispatching the login function with email, password, and navigation
        dispatch(login(email, password, navigate));
    };

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="max-w-sm mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
            <form onSubmit={handleOnSubmit} className="space-y-4">
                <input
                    required
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={email}
                    onChange={handleOnChange}
                    name="email"
                />
                <input
                    required
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={password}
                    onChange={handleOnChange}
                    name="password"
                />
                <button
                    type="submit"
                    className="w-full p-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                    Login
                </button>
            </form>
            <p className="text-center mt-4">OR</p>
            <button
                className="w-full p-2 mt-2 text-blue-600 hover:underline"
                onClick={toggleLogin}
            >
                Sign Up Instead
            </button>
        </div>
    );
};

export default LoginForm;
