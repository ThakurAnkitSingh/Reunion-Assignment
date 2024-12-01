import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar: React.FC<{ onTabChange: (tab: string) => void }> = ({
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <div className="flex items-center justify-between bg-gray-800 text-white p-4">
      <div className="flex space-x-4">
        <button
          onClick={() => handleTabClick("Dashboard")}
          className={`px-4 py-2 rounded ${
            activeTab === "Dashboard" ? "bg-gray-600" : "bg-gray-700"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => handleTabClick("TaskList")}
          className={`px-4 py-2 rounded ${
            activeTab === "TaskList" ? "bg-gray-600" : "bg-gray-700"
          }`}
        >
          Task List
        </button>
      </div>
      <button
        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
};

export default Navbar;