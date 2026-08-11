import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout } = useAuth();

  const isAdminPage = location.pathname.startsWith("/admin");

  const handleAdminAction = async () => {
    if (admin && isAdminPage) {
      await logout();
      navigate("/");
    } else if (admin) {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="w-full px-5 py-4 md:px-10 md:py-5 flex justify-between items-center">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <span className="text-white font-syne font-bold text-xl tracking-tight">
          Lead<span className="text-blue-400">Desk</span>
        </span>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {admin && (
          <span className="hidden sm:flex items-center gap-1.5 text-slate-400 text-sm font-inter">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {admin.username || admin.email}
          </span>
        )}
        <button
          id="navbar-admin-btn"
          onClick={handleAdminAction}
          className="gradient-btn text-white cursor-pointer font-inter font-medium text-sm px-4 py-2 rounded-lg shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-200"
        >
          <span>
            {admin && isAdminPage
              ? "Logout"
              : admin
              ? "Dashboard"
              : "Admin Login"}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;