// src/components/Navbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold">
        Voting System
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:text-gray-200">
          Home
        </Link>
        {!token && (
          <>
            <Link to="/login" className="hover:text-gray-200">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-200">
              Register
            </Link>
          </>
        )}

        {token && role === "admin" && (
          <Link to="/admin" className="hover:text-gray-200">
            Dashboard
          </Link>
        )}

        {token && role === "voter" && (
          <Link to="/voter" className="hover:text-gray-200">
            Dashboard
          </Link>
        )}

        {token && (
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;