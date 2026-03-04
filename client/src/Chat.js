import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiMoon, FiSun } from "react-icons/fi";
export default function Chat({ role, setIsLoggedIn }) {

  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const logout = () => {
    // remove auth data
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // update React state (VERY IMPORTANT)
    setIsLoggedIn(false);

    toast.success("Logged out successfully");

    // go to GetStarted page
    // navigate("/");
    setTimeout(() => {
      navigate("/");
    }, 0);
  };
  // 👉 reference for auto-scroll
  const bottomRef = useRef(null);

  useEffect(() => {
    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  // 👉 scroll to latest message whenever chat updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const send = async () => {
    if (!msg.trim() || loading) return;

    const userMessage = msg;  // store before clearing input
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", { message: userMessage });
      setChat(prev => [...prev, { u: userMessage, b: res.data.reply }]);
    } catch (err) {
      setChat(prev => [...prev, { u: userMessage, b: "Error contacting server" }]);
    }

    setLoading(false);
  };

  // 👉 send on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="h-screen flex flex-col
                bg-gradient-to-br from-slate-50 to-indigo-100
                dark:from-slate-900 dark:to-slate-800
                text-slate-900 dark:text-slate-100">

      {/* 🔹 Navbar */}
      <div className="flex justify-between items-center px-6 py-4
                bg-white dark:bg-slate-900
                border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          CampusConnect AI
        </h2>

        <div className="flex gap-3">
          {role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
            >
              Admin Panel
            </button>
          )}

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg border
             border-slate-300 dark:border-slate-600
             bg-white dark:bg-slate-800
             hover:bg-slate-100 dark:hover:bg-slate-700
             transition"
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>
      </div>

      {/* 🔹 Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

        {chat.length === 0 && (
          <div className="text-center text-slate-400 mt-10">
            Ask me about events, faculty, classrooms, or facilities 👇
          </div>
        )}

        {chat.map((c, i) => (
          <div key={i} className="space-y-3">

            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-indigo-600 text-white px-4 py-3 rounded-2xl shadow max-w-[70%]">
                {c.u}
              </div>
            </div>

            {/* Bot Message */}
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-700
                px-4 py-3 rounded-2xl shadow max-w-[70%] border
                border-slate-200 dark:border-slate-600">
                {c.b}
              </div>
            </div>

          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="text-sm text-slate-500 animate-pulse">
            AI is typing...
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* 🔹 Input Area */}
      <div className="bg-white dark:bg-slate-900 border-t
                border-slate-200 dark:border-slate-700 px-6 py-4 flex gap-3">
        <input
          value={msg}
          onChange={e => setMsg(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about events, faculty, facilities..."
          className="flex-1 px-4 py-3 border rounded-xl outline-none
             bg-white dark:bg-slate-800
             border-slate-300 dark:border-slate-600
             focus:ring-2 focus:ring-indigo-500"

        />

        <button
          onClick={send}
          disabled={loading}
          className={`px-6 py-3 rounded-xl text-white font-medium transition
          ${loading
              ? "bg-gray-400"
              : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}