import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login({ setIsLoggedIn, setRole }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);



  const login = async () => {
    if (!email || !password) {
      toast.warning("Please fill all fields");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      setIsLoggedIn(true);
      setRole(res.data.role);

      toast.success("Welcome back!");

      navigate("/chat");

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-slate-200">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">
          Welcome Back 
        </h2>
        <p className="text-slate-500 text-sm text-center mb-6">
          Login to continue to CampusConnect AI
        </p>

        {/* Email Input */}
        <input
          required
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-4 border rounded-xl outline-none
                   focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   transition placeholder:text-slate-400"
        />

        {/* Password Input */}
        <div className="relative mb-6">
          <input
            required
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 pr-12 border rounded-xl outline-none
               focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
               transition placeholder:text-slate-400"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600 transition"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        {/* Login Button */}
        <button
          onClick={login}
          className="w-full py-3 rounded-xl font-semibold text-white
                   bg-gradient-to-r from-indigo-600 to-blue-500
                   hover:from-indigo-700 hover:to-blue-600
                   transition duration-300 shadow-md"
        >
          Login
        </button>

        {/* Register Link */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Don’t have an account?
          <button
            onClick={() => navigate("/register")}
            className="ml-1 text-indigo-600 font-medium hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}