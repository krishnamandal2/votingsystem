// src/pages/auth/Register.tsx

import React, { useState } from "react";
import API from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: "voter" | "admin";
  adminCode?: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    role: "voter",
    adminCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (form.role === "admin" && !form.adminCode) {
      setError("Admin code is required for admin registration");
      setLoading(false);
      return;
    }

    try {
      const payload =
        form.role === "admin"
          ? form
          : {
              name: form.name,
              email: form.email,
              password: form.password,
              role: form.role,
            };

      const res = await API.post("/users/register", payload);
      
      // Show success message
      alert(res.data.message);
      
      // Navigate to login page
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <form
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all duration-500 animate-fade-in-up"
        onSubmit={handleSubmit}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-2">Join the voting system today</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg animate-shake">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <div className="space-y-5">
          {/* Name */}
          <div className="relative">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none p-2 peer transition-all"
              placeholder=" "
            />
            <label className="absolute left-2 -top-5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-indigo-600 peer-focus:text-sm">
              Full Name
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none p-2 peer transition-all"
              placeholder=" "
            />
            <label className="absolute left-2 -top-5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-indigo-600 peer-focus:text-sm">
              Email Address
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none p-2 peer transition-all"
              placeholder=" "
            />
            <label className="absolute left-2 -top-5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-indigo-600 peer-focus:text-sm">
              Password
            </label>
          </div>

          {/* Role Selection */}
          <div className="relative">
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none p-2 transition-all appearance-none bg-white cursor-pointer"
              required
            >
              <option value="voter">Voter</option>
              <option value="admin">Admin</option>
            </select>
            <div className="absolute right-2 top-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <label className="absolute left-2 -top-5 text-gray-600 text-sm">
              Account Type
            </label>
          </div>

          {/* Admin Code (conditional) */}
          {form.role === "admin" && (
            <div className="relative animate-fade-in">
              <input
                type="text"
                name="adminCode"
                value={form.adminCode}
                onChange={handleChange}
                required
                className="w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none p-2 peer transition-all"
                placeholder=" "
              />
              <label className="absolute left-2 -top-5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-indigo-600 peer-focus:text-sm">
                Admin Code
              </label>
              <p className="text-xs text-gray-500 mt-1">
                * Contact system administrator for admin code
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline transition"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Info about roles */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-600 text-center">
            ℹ️ Voters can participate in elections. Admin access requires valid admin code.
          </p>
        </div>
      </form>
    </div>
  );
}