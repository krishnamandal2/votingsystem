// src/components/Navbar.tsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  // Listen for storage changes and update state
  useEffect(() => {
    const updateAuthState = () => {
      const storedToken = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");
      const storedName = localStorage.getItem("name");
      
      setToken(storedToken);
      setRole(storedRole);
      setUserName(storedName);
    };

    updateAuthState();

    // Listen for storage events (when localStorage changes in another tab)
    window.addEventListener("storage", updateAuthState);
    
    // Custom event for when login/register happens in same tab
    const handleAuthChange = () => updateAuthState();
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", updateAuthState);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    
    setToken(null);
    setRole(null);
    setUserName(null);
    
    // Dispatch custom event
    window.dispatchEvent(new Event("authChange"));
    
    navigate("/");
    setIsMobileMenuOpen(false);
    setShowAccountMenu(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (showAccountMenu) setShowAccountMenu(false);
  };

  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu);
  };

  const getDashboardPath = () => {
    if (role === "admin") return "/admin";
    if (role === "voter") return "/voter";
    return "/";
  };

  const getDashboardName = () => {
    if (role === "admin") return "Admin Dashboard";
    if (role === "voter") return "Voter Dashboard";
    return "Dashboard";
  };

  const navLinkClass = (path: string) =>
    `hover:text-gray-200 transition ${
      location.pathname === path ? "font-bold underline" : ""
    }`;

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userName) return "?";
    return userName.charAt(0).toUpperCase();
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-wide hover:scale-105 transform transition">
            🗳️ Voting System
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={navLinkClass("/")}>
              Home
            </Link>
            
            <Link to="/elections" className={navLinkClass("/elections")}>
              All Elections
            </Link>
            
            {!token && (
              <>
                <Link to="/login" className={navLinkClass("/login")}>
                  Login
                </Link>
                <Link to="/register" className={navLinkClass("/register")}>
                  Register
                </Link>
              </>
            )}

            {token && role && (
              <Link to={getDashboardPath()} className={navLinkClass(getDashboardPath())}>
                {getDashboardName()}
              </Link>
            )}

            {token && (
              <div className="relative">
                <button
                  onClick={toggleAccountMenu}
                  className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-3 py-2 transition"
                >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                    {getUserInitials()}
                  </div>
                  <span className="text-sm font-medium">{userName || "User"}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showAccountMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="font-medium text-gray-800">{userName || "User"}</p>
                        <p className="text-xs text-gray-500 capitalize">{role}</p>
                      </div>
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        Account Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {token && (
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                {getUserInitials()}
              </div>
            )}
            <button onClick={toggleMobileMenu} className="focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {userName && (
              <div className="px-3 py-2 border-b border-white border-opacity-20">
                <p className="text-sm text-white text-opacity-80">Signed in as</p>
                <p className="font-medium">{userName}</p>
                <p className="text-xs text-white text-opacity-70 capitalize">{role}</p>
              </div>
            )}
            
            <Link
              to="/"
              className={`block px-3 py-2 rounded-lg ${navLinkClass("/")}`}
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            
            <Link
              to="/elections"
              className={`block px-3 py-2 rounded-lg ${navLinkClass("/elections")}`}
              onClick={toggleMobileMenu}
            >
              All Elections
            </Link>
            
            {!token && (
              <>
                <Link
                  to="/login"
                  className={`block px-3 py-2 rounded-lg ${navLinkClass("/login")}`}
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`block px-3 py-2 rounded-lg ${navLinkClass("/register")}`}
                  onClick={toggleMobileMenu}
                >
                  Register
                </Link>
              </>
            )}

            {token && role && (
              <Link
                to={getDashboardPath()}
                className={`block px-3 py-2 rounded-lg ${navLinkClass(getDashboardPath())}`}
                onClick={toggleMobileMenu}
              >
                {getDashboardName()}
              </Link>
            )}

            {token && (
              <>
                <Link
                  to="/account"
                  className="block px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition"
                  onClick={toggleMobileMenu}
                >
                  Account Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg bg-red-500 bg-opacity-20 hover:bg-opacity-30 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showAccountMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowAccountMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;