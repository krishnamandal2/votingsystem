// src/pages/ElectionList.tsx

import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

interface Election {
  _id: string;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
}

export default function ElectionList() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "upcoming" | "ended">("all");
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  
  const navigate = useNavigate();

  // Get user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (name && email && role) {
      setUser({ name, email, role });
    }
  }, [navigate]);

  // Fetch elections
  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        const res = await API.get<Election[]>("/elections");
        setElections(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching elections", err);
        setError("Failed to load elections. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  const getElectionStatus = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return { text: "Unknown", color: "bg-gray-100 text-gray-600" };
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return { text: "Upcoming", color: "bg-yellow-100 text-yellow-800" };
    if (now > end) return { text: "Ended", color: "bg-gray-100 text-gray-600" };
    return { text: "Active", color: "bg-green-100 text-green-800" };
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter elections based on search and status
  const filteredElections = elections.filter(election => {
    const matchesSearch = election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         election.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const status = getElectionStatus(election.startDate, election.endDate);
    
    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "active") return matchesSearch && status.text === "Active";
    if (statusFilter === "upcoming") return matchesSearch && status.text === "Upcoming";
    if (statusFilter === "ended") return matchesSearch && status.text === "Ended";
    
    return matchesSearch;
  });

  const activeCount = elections.filter(e => getElectionStatus(e.startDate, e.endDate).text === "Active").length;
  const upcomingCount = elections.filter(e => getElectionStatus(e.startDate, e.endDate).text === "Upcoming").length;
  const endedCount = elections.filter(e => getElectionStatus(e.startDate, e.endDate).text === "Ended").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading elections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">All Elections</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-gray-700">{user.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
          
          <Link
            to={user?.role === "admin" ? "/admin" : "/voter"}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/"
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
          </Link>
        </div>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">All Elections</h1>
          <p className="text-indigo-100">Browse and participate in available elections</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Elections</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-2 rounded-lg transition ${
                    statusFilter === "all"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({elections.length})
                </button>
                <button
                  onClick={() => setStatusFilter("active")}
                  className={`px-4 py-2 rounded-lg transition ${
                    statusFilter === "active"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  onClick={() => setStatusFilter("upcoming")}
                  className={`px-4 py-2 rounded-lg transition ${
                    statusFilter === "upcoming"
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Upcoming ({upcomingCount})
                </button>
                <button
                  onClick={() => setStatusFilter("ended")}
                  className={`px-4 py-2 rounded-lg transition ${
                    statusFilter === "ended"
                      ? "bg-gray-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Ended ({endedCount})
                </button>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || statusFilter !== "all") && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Found <span className="font-semibold text-indigo-600">{filteredElections.length}</span> election{filteredElections.length !== 1 ? 's' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
            {statusFilter !== "all" && ` that are ${statusFilter}`}
          </p>
        </div>

        {/* Elections Grid */}
        {filteredElections.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🗳️</div>
            <p className="text-gray-500 text-lg">No elections found</p>
            <p className="text-gray-400 mt-2">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "Check back later for upcoming elections"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredElections.map((election) => {
              const status = getElectionStatus(election.startDate, election.endDate);
              return (
                <div
                  key={election._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Status Bar */}
                  <div className={`h-1 w-full ${status.color.replace('bg-', 'bg-').replace('text-', '')}`}></div>
                  
                  <div className="p-6">
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        {status.text}
                      </span>
                      {election.startDate && (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition">
                      {election.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {election.description}
                    </p>
                    
                    {/* Date Range */}
                    {election.startDate && election.endDate && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Start:</span>
                          <span className="font-medium text-gray-700">{formatDate(election.startDate)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-500">End:</span>
                          <span className="font-medium text-gray-700">{formatDate(election.endDate)}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/election/${election._id}`)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition transform hover:scale-105"
                      >
                        {status.text === "Active" ? "View & Vote" : status.text === "Upcoming" ? "View Details" : "View Results"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}