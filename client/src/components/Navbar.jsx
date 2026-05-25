import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { logout as logoutAPI } from "../services/authService.js";
import toast from "react-hot-toast";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch {
      // ignore
    }
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-dark-card border-b border-gray-700/50">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-lg font-bold text-white tracking-tight">
          <span className="text-accent">&lt;</span>
          CodeTranslator
          <span className="text-accent">/&gt;</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive("/")
                ? "bg-accent/10 text-accent"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            }`}
          >
            Editor
          </Link>
          <Link
            to="/history"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive("/history")
                ? "bg-accent/10 text-accent"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            }`}
          >
            History
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {user?.picture ? (
          <img src={user.picture} alt="" className="w-7 h-7 rounded-full ring-2 ring-gray-700" />
        ) : (
          <div className="w-7 h-7 rounded-full ring-2 ring-gray-700 bg-accent/20 flex items-center justify-center">
            <span className="text-xs font-bold text-accent">{user?.name?.charAt(0)?.toUpperCase() || "?"}</span>
          </div>
        )}
        <span className="text-sm text-gray-300 hidden sm:block">{user?.name || "User"}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400
                     hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
