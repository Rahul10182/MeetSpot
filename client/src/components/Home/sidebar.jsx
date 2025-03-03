import React from "react";
import { Home, People, Chat, Event, Settings, Help ,LocationOn } from "@mui/icons-material";
import MeetPage from "../../pages/Meeting Page/MeetPage";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setActivePage }) => {

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };
  return (
    <div className="h-screen w-16 bg-pink-400 flex flex-col justify-between items-center pt-4 pb-2 text-white">

          <button
            onClick={handleClick}
            className="mt-2 text-white font-bold text-4xl rounded-lg shadow-md transition-all duration-200"
          >
            M
          </button>
      {/* Top Section */}
      <div className="flex flex-col items-center space-y-5">
        <SidebarIcon icon={<Home />} tooltip="Home" onClick={() => setActivePage("home")} />
        <SidebarIcon icon={<People />} tooltip="Meet" onClick={() => setActivePage("meet")}/>
        <SidebarIcon icon={<Chat />} tooltip="Chat" onClick={() => setActivePage("chat")} />
        <SidebarIcon icon={<Event />} tooltip="Events" onClick={() => setActivePage("events")} />
        <SidebarIcon icon={<LocationOn />} tooltip="FamousEvent" onClick={() => setActivePage("famousEvent")} />
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center space-y-5">
        <SidebarIcon icon={<Settings />} tooltip="Settings" onClick={() => setActivePage("profile")} />
        <SidebarIcon icon={<Help />} tooltip="Help" onClick={() => setActivePage("contact")} />
      </div>
    </div>
  );
};

const SidebarIcon = ({ icon, tooltip, onClick }) => {
  return (
    <div className="relative group">
      <div className="p-3 rounded-lg hover:bg-pink-700 cursor-pointer" onClick={onClick}>
        {icon}
      </div>
      <span className="absolute left-20 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {tooltip}
      </span>
    </div>
  );
};

export default Sidebar;
