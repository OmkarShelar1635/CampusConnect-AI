import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddEvent from "./admin/AddEvent";
import AddDepartment from "./admin/AddDepartment";
import AddFaculty from "./admin/AddFaculty";
import AddFacility from "./admin/AddFacility";
import AddNotice from "./admin/AddNotice";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
export default function Admin({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("events");


  const logout = () => {
    // clear auth
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // update global login state
    setIsLoggedIn(false);

    toast.success("Logged out successfully 👋");

    // navigate AFTER state updates
    setTimeout(() => {
      navigate("/");
    }, 0);
  };

  const tabs = [
    { id: "events", label: "Events" },
    { id: "departments", label: "Departments" },
    { id: "faculty", label: "Faculty" },
    { id: "facilities", label: "Facilities" },
    { id: "notices", label: "Notices" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100
                  dark:from-slate-900 dark:to-slate-800
                  p-6 text-slate-900 dark:text-slate-100">

      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">
          Admin Dashboard
        </h2>

        <div className="flex gap-3">

          <button
            onClick={() => navigate("/chat")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
             bg-indigo-600 hover:bg-indigo-700
             text-white transition"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg
                     bg-red-500 hover:bg-red-600
                     text-white transition"
          >
            Logout
          </button>

        </div>
      </div>

      {/* 🔹 Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition
  ${activeTab === tab.id
                ? "bg-indigo-600 text-white shadow"
                : `bg-white dark:bg-slate-700
         text-slate-600 dark:text-slate-200
         hover:bg-slate-100 dark:hover:bg-slate-600`
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🔹 Content Card */}
      <div className="bg-white dark:bg-slate-900
                    shadow-xl rounded-2xl p-6
                    border border-slate-200 dark:border-slate-700">

        {activeTab === "events" && <AddEvent />}
        {activeTab === "departments" && <AddDepartment />}
        {activeTab === "faculty" && <AddFaculty />}
        {activeTab === "facilities" && <AddFacility />}
        {activeTab === "notices" && <AddNotice />}

      </div>

    </div>
  );
}