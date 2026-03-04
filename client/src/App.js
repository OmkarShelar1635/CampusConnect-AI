import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "./auth/Register"
import Chat from "./Chat";
import Admin from "./Admin";
import Login from "./auth/Login";
import GetStarted from "./GetStarted";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  useEffect(() => {
    const link =
      document.querySelector("link[rel~='icon']") ||
      document.createElement("link");

    link.rel = "icon";
    link.type = "image/x-icon";
    link.href = process.env.PUBLIC_URL + "/logo.png?v=1"; // cache-buster

    document.head.appendChild(link);
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      setRole(savedRole);
    }
  }, []);

  return (
    <Router>
      <Routes>

        {/* ✅ Public Landing Page */}
        <Route path="/" element={<GetStarted />} />

        {/* ✅ Login Page */}
        <Route
          path="/login"
          element={
            isLoggedIn
              ? <Navigate to="/chat" />
              : <Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
          }
        />
        <Route path="/register" element={<Register />} />
        {/* ✅ Chat Page (Protected) */}
        <Route
          path="/chat"
          element={
            isLoggedIn
              ? <Chat role={role} setIsLoggedIn={setIsLoggedIn} />
              : <Navigate to="/login" />
          }
        />


        {/* ✅ Admin Page (Admin Only) */}
        <Route
          path="/admin"
          element={
            isLoggedIn && role === "admin"
              ? <Admin setIsLoggedIn={setIsLoggedIn} />
              : <Navigate to="/chat" />
          }
        />

      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
}

export default App;