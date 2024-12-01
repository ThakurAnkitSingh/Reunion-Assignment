import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/home/home";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import TaskList from "./components/tasklist/TaskList";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/tasklist" element={<TaskList />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
