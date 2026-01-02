import { logout } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Header({ user }) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);

    setTimeout(() => {
      logout();
      navigate("/login", { replace: true });
    }, 100);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl border-b border-blue-500/20 bg-slate-900/95">
      <div className="flex h-16 items-center justify-between px-6">

        <h1 className="text-2xl font-bold text-white">
          Welcome,{" "}
          <span className="text-blue-400">
            {localStorage.getItem("username") || "User"}
          </span>
        </h1>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-lg
                     bg-linear-to-r from-red-500 to-red-600
                     hover:from-red-600 hover:to-red-700
                     transition-all duration-200 hover:scale-105 active:scale-95
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <span>Logout</span>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </>
          )}
        </button>

      </div>
    </header>
  );
}

export default Header;