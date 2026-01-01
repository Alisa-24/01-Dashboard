import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { isAuthenticated } from "./lib/auth";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated() ? <Navigate to="/" replace /> : <Login />
        }
      />

      <Route
        path="/"
        element={
          isAuthenticated() ? <Profile /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;
