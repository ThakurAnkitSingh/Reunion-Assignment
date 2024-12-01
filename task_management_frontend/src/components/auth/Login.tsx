import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", response?.data?.token);
      toast.success("Login successful");
      navigate("/home");
    } catch (err) {
      console.log(err);
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <Card className="w-[400px] shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Welcome Back!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="focus:ring focus:ring-blue-300 rounded-lg p-3 text-lg"
            />
            <Input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="focus:ring focus:ring-blue-300 rounded-lg p-3 text-lg"
            />
            <Button
              onClick={handleLogin}
              className={`w-full ${
                loading ? "opacity-70" : "bg-blue-600 hover:bg-blue-700"
              } text-white py-3 rounded-lg text-lg font-semibold`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="loader"></span> Logging In...
                </span>
              ) : (
                "Login"
              )}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
