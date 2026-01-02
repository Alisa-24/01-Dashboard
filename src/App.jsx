import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { isAuthenticated } from "./lib/auth";

function App() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial auth check
    setIsAuth(isAuthenticated());
    setIsLoading(false);

    const handleAuthChange = () => {
      setIsAuth(isAuthenticated());
    };

    // Listen for custom auth change events
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  // Show loading screen to prevent white flash
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuth ? <Navigate to="/" replace /> : <Login />
        }
      />

      <Route
        path="/"
        element={
          isAuth ? (
            <Profile user={{ login: localStorage.getItem("username") }} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="*"
        element={<Navigate to={isAuth ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;