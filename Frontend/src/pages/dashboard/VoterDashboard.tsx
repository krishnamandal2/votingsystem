// src/pages/dashboard/VoterDashboard.tsx

import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

interface Election {
  _id: string;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
}

interface User {
  name: string;
  email: string;
}

export default function VoterDashboard() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const navigate = useNavigate();

  // Check authentication and load user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (name && email) {
      setUser({ name, email });
    }
  }, [navigate]);

  // Fetch elections
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await API.get<Election[]>("/elections");
        setElections(res.data);
      } catch (err) {
        console.error("Error fetching elections", err);
        setError("Failed to load elections. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  // Format dates nicely
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Check if election is active (between start and end date)
  const isElectionActive = (election: Election) => {
    if (!election.startDate || !election.endDate) return true;
    const now = new Date();
    const start = new Date(election.startDate);
    const end = new Date(election.endDate);
    return now >= start && now <= end;
  };

  // Check if election hasn't started yet
  const isElectionUpcoming = (election: Election) => {
    if (!election.startDate) return false;
    const now = new Date();
    const start = new Date(election.startDate);
    return now < start;
  };

  // Check if election has ended
  const isElectionEnded = (election: Election) => {
    if (!election.endDate) return false;
    const now = new Date();
    const end = new Date(election.endDate);
    return now > end;
  };

  const getElectionStatus = (election: Election) => {
    if (isElectionUpcoming(election)) return { text: "Upcoming", color: "bg-yellow-100 text-yellow-800", canVote: false };
    if (isElectionEnded(election)) return { text: "Ended", color: "bg-gray-100 text-gray-600", canVote: false };
    if (isElectionActive(election)) return { text: "Active", color: "bg-green-100 text-green-800", canVote: true };
    return { text: "Unknown", color: "bg-gray-100 text-gray-600", canVote: false };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header/Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Voter Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Info Button */}
              {user && (
                <button
                  onClick={() => setShowAccountModal(true)}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition"
                >
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-gray-700">{user.name}</span>
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        {user && (
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {user.name}! 👋
            </h2>
            <p className="text-green-100">
              Ready to make your voice heard? Check out the active elections below.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Elections Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Available Elections</h3>
            <span className="text-sm text-gray-500">
              {elections.length} election{elections.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {elections.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">🗳️</div>
              <p className="text-gray-500 text-lg">No elections available at the moment.</p>
              <p className="text-gray-400">Check back later for upcoming elections!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {elections.map((election) => {
                const status = getElectionStatus(election);
                return (
                  <div
                    key={election._id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
                  >
                    {/* Status Badge */}
                    <div className="px-4 pt-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {election.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {election.description}
                      </p>

                      {election.startDate && election.endDate && (
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            {formatDate(election.startDate)} - {formatDate(election.endDate)}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => navigate(`/election/${election._id}`)}
                        disabled={!status.canVote}
                        className={`mt-2 w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                          status.canVote
                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {status.canVote ? 'View Candidates & Vote' : status.text === 'Upcoming' ? 'Coming Soon' : 'View Results'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Account Details Modal */}
      {showAccountModal && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Account Details</h3>
                <button
                  onClick={() => setShowAccountModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">Voter</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  <p className="text-gray-900">{user.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Account Type</label>
                  <p className="text-gray-900">Voter</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowAccountModal(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}