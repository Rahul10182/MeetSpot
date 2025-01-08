import React from "react";
import { Home, People, Chat, Event, Settings, Help } from "@mui/icons-material";

const Sidebar = ({ setActivePage }) => {
  return (
    <div className="h-screen w-16 bg-pink-400 flex flex-col justify-between items-center pt-4 pb-2 text-white">
      {/* Top Section */}
      <div className="flex flex-col items-center space-y-5 mt-20">
        <SidebarIcon icon={<Home />} tooltip="Home" onClick={() => setActivePage("home")} />
        <SidebarIcon icon={<People />} tooltip="Meet" onClick={() => setActivePage("meet")}/>
        <SidebarIcon icon={<Chat />} tooltip="Chat" onClick={() => setActivePage("chat")} />
        <SidebarIcon icon={<Event />} tooltip="Events" onClick={() => setActivePage("events")} />
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
