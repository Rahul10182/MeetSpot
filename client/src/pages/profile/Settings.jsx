import React, { useState } from 'react';

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    phoneNumber: '',
    profilePhoto: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePhoto: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add the logic to handle form submission here (e.g., API call)
    console.log("Form data submitted: ", formData);

    // Clear form data or show a success message based on the result
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your full name"
          />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Write a short bio"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Profile Photo */}
        <div className="mb-4">
          <label className="block text-gray-700">Profile Photo</label>
          <input
            type="file"
            name="profilePhoto"
            onChange={handleFileChange}
            className="w-full mt-2 p-2"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
