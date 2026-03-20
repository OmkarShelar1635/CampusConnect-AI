import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
export default function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });

    const register = async () => {
        if (!form.name || !form.email || !form.password) {
            toast.warning("All fields are required");
            return;
        }
        try {
            await axios.post("/api/auth/register", form);
            toast.success("Registered Successfully! Please Login.");
            navigate("/login", {
                state: {
                    email: form.email
                    // don't send password for security
                }
            });
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 px-4">

            {/* Card */}
            <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-slate-200">

                {/* Heading */}
                <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">
                    Create Account 
                </h2>
                <p className="text-slate-500 text-sm text-center mb-6">
                    Join CampusConnect AI to get started
                </p>

                {/* Name */}
                <input
                    required
                    placeholder="Full Name"
                    className="w-full px-4 py-3 mb-4 border rounded-xl outline-none
                   focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   transition placeholder:text-slate-400"
                    onChange={e => setForm({ ...form, name: e.target.value })}
                />

                {/* Email */}
                <input
                    required
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-3 mb-4 border rounded-xl outline-none
                   focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   transition placeholder:text-slate-400"
                    onChange={e => setForm({ ...form, email: e.target.value })}
                />

                {/* Password */}
                <div className="relative mb-4">
                    <input
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full px-4 py-3 pr-12 border rounded-xl outline-none
               focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
               transition placeholder:text-slate-400"
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600 transition"
                    >
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                </div>

                {/* Role Dropdown */}
                <select
                    className="w-full px-4 py-3 mb-6 border rounded-xl outline-none
                   focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   transition text-slate-600"
                    onChange={e => setForm({ ...form, role: e.target.value })}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                {/* Register Button */}
                <button
                    onClick={register}
                    className="w-full py-3 rounded-xl font-semibold text-white
                   bg-gradient-to-r from-indigo-600 to-blue-500
                   hover:from-indigo-700 hover:to-blue-600
                   transition duration-300 shadow-md"
                >
                    Register
                </button>

                {/* Login Link */}
                <p className="text-center text-sm text-slate-600 mt-6">
                    Already have an account?
                    <button
                        onClick={() => navigate("/login")}
                        className="ml-1 text-indigo-600 font-medium hover:underline"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}