import { useNavigate } from "react-router-dom";
export default function Logout({ setIsLoggedIn }) {
    const navigate=useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        
        console.log("Token after logout:", localStorage.getItem("token"));
        navigate("/");
    };

    return (
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2">
            Logout
        </button>
    );
}