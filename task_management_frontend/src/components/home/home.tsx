import React, { useState } from "react";
import Navbar from "../navbar/navbar";
import Dashboard from "../dashboard/Dashboard";
import TaskList from "../tasklist/TaskList";

const Home: React.FC = () => {
  const [currentTab, setCurrentTab] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onTabChange={setCurrentTab} />
      <div className="p-6">
        {currentTab === "Dashboard" && <Dashboard />}
        {currentTab === "TaskList" && <TaskList />}
      </div>
    </div>
  );
};

export default Home;
