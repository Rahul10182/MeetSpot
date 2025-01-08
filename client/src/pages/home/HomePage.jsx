import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Home/sidebar";
import Navbar from "../../components/Home/Navbar";
import { Outlet, useNavigate } from "react-router-dom";

const HomePage = ({ showChat, handleAccountIconClick }) => {
  const [showM, setShowM] = useState(false);
  const [activePage, setActivePage] = useState("home");

  const navigate = useNavigate();

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      const isNavbarVisible = window.scrollY < 50;
      setShowM(!isNavbarVisible);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigate based on activePage
  useEffect(() => {
    switch (activePage) {
      case "home":
        navigate("/home");
        break;
      case "events":
        navigate("/home/events");
        break;
      case "chat":
        navigate("/home/chat");
        break;
      case "contact":
        navigate("/home/help");
        break;
      case "profile":
        navigate("/profile/dashboard");
        break;
      default:
        navigate("/home");
    }
  }, [activePage, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <div className="w-full">
        <Navbar showChat={showChat} handleAccountIconClick={handleAccountIconClick} />
      </div>

      {/* Main Content Area */}
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-screen w-16 bg-gray-900">
          <Sidebar setActivePage={setActivePage} showM={showM} />
        </div>

        {/* Main Content */}
        <div className="ml-16 flex-1 bg-white p-6">
          <Outlet /> {/* Outlet will render content based on route */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
