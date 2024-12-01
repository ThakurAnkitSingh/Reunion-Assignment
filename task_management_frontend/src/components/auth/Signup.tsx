import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);
    try {
      if (email === "" || password === "") {
        toast.error("Email and password cannot be empty");
        return;
      } else if (password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      } else if (!email.includes("@")) {
        toast.error("Invalid email address");
        return;
      } else if (!email.includes(".")) {
        toast.error("Invalid email address");
        return;
      } else if (password.includes(" ")) {
        toast.error("Password cannot contain spaces");
        return;
      }
      await axios.post("http://localhost:5000/api/auth/signup", { email, password });
      toast.success("Signup successful");
      navigate("/login");
    } catch (err) {
      console.log(err);
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <Card className="w-[400px] shadow-lg border border-gray-200 rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Create an Account</CardTitle>
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
              onClick={handleSignup}
              className={`w-full ${loading ? "opacity-70" : "bg-blue-600 hover:bg-blue-700"} text-white py-3 rounded-lg text-lg font-semibold`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="loader"></span> Signing Up...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>
            <p className="text-sm text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
