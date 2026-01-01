import { logout } from "../lib/auth";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="bg-slate-900 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Profile
        </h1>

        <button
          onClick={handleLogout}
          className="
            w-full
            bg-red-600
            hover:bg-red-700
            active:bg-red-800
            text-white
            font-semibold
            py-2.5
            rounded-lg
            transition
            duration-200
            shadow-md
            hover:shadow-lg
          "
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
