import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Left Section: Background gradient with subtle opacity */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-r from-purple-700 via-indigo-800 to-blue-700 opacity-95 w-full lg:w-1/2 px-6 lg:px-12">
        <div className="max-w-md space-y-6 text-center text-white">
          <h1 className="text-3xl lg:text-5xl font-bold tracking-tight">
            Welcome to MeetSpot
          </h1>
          <p className="text-lg lg:text-2xl mt-2">
            Find your connections, explore, and grow with us.
          </p>
        </div>
      </div>
      
      {/* Right Section: Centered content with rounded border and shadow */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 px-6 py-12 sm:px-6 lg:px-8 w-full">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
