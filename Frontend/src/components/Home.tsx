// src/components/Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col justify-center items-center flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center p-6">
        <h1 className="text-5xl font-bold mb-4">Welcome to Voting Management System</h1>
        <p className="text-lg mb-8">
          Cast your vote securely and view results in real-time.
        </p>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-700 text-center py-4">
        &copy; {new Date().getFullYear()} Voting Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;