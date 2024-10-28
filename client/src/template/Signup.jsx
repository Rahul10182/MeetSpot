import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { signUp } from '../../services/operations/authAPI';
import { setSignupData } from '../../slices/authSlice';
import { useNavigate } from 'react-router-dom';

const SignupForm = ({ toggleLogin }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        contactNumber: "",
    });

    const { firstName, lastName, email, password, confirmPassword, contactNumber } = formData;

    // Handle input changes
    const handleOnChange = (e) => {
        e.preventDefault();
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    // Handle form submission
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords Do Not Match");
            return;
        }
  
        // Dispatch signup action with formData and navigate
        dispatch(signUp(formData.firstName, formData.lastName, formData.email, formData.password, formData.confirmPassword, formData.contactNumber, navigate));

        // Optionally, set the signup data in the redux store
        dispatch(setSignupData(formData));

        // Reset form after submission
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            contactNumber: "",
        });
    };

    return (
        <div className="max-w-sm mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
            <form onSubmit={handleOnSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <input
                        required
                        type="text"
                        placeholder="First Name"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={firstName}
                        onChange={handleOnChange}
                        name="firstName"
                    />
                    <input
                        required
                        type="text"
                        placeholder="Last Name"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={lastName}
                        onChange={handleOnChange}
                        name="lastName"
                    />
                </div>
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
                    type="text"
                    placeholder="Contact Number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={contactNumber}
                    onChange={handleOnChange}
                    name="contactNumber"
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
                <input
                    required
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={confirmPassword}
                    onChange={handleOnChange}
                    name="confirmPassword"
                />
                <button
                    type="submit"
                    className="w-full p-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                    Sign Up
                </button>
            </form>
            <p className="text-center mt-4">OR</p>
            <button
                className="w-full p-2 mt-2 text-blue-600 hover:underline"
                onClick={toggleLogin}
            >
                Login Instead
            </button>
        </div>
    );
};

export default SignupForm;
