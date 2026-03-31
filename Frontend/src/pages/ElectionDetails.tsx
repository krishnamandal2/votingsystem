// src/pages/ElectionDetails.tsx

import { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams, useNavigate, Link } from "react-router-dom";

interface Candidate {
  _id: string;
  name: string;
  party: string;
  age: number;
  voteCount: number;
  description?: string;
  imageUrl?: string;
}

interface Election {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  candidates: Candidate[];
}

export default function ElectionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votingInProgress, setVotingInProgress] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState<string | null>(null);

  // Get user data from localStorage
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

  // Fetch election details
  useEffect(() => {
    const fetchElection = async () => {
      try {
        setLoading(true);
        const res = await API.get<Election>(`/elections/${id}`);
        setElection(res.data);
        
        // Check if user has already voted in this election
        try {
          const voteStatusRes = await API.get(`/votes/check/${id}`);
          setHasVoted(voteStatusRes.data.hasVoted);
        } catch (err) {
          console.error("Error checking vote status", err);
        }
        
        setError(null);
      } catch (err: any) {
        console.error("Error fetching election", err);
        setError(err.response?.data?.error || "Failed to load election details");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchElection();
  }, [id]);

  // Vote function
  const vote = async (candidateId: string) => {
    try {
      setVotingInProgress(candidateId);
      await API.post("/votes", { electionId: id, candidateId });
      
      // Refresh election data
      const res = await API.get<Election>(`/elections/${id}`);
      setElection(res.data);
      setHasVoted(true);
      setShowConfirmModal(null);
      
      // Show success message (you can replace with a toast notification)
      alert("✓ Vote cast successfully!");
    } catch (err: any) {
      alert(err.response?.data?.error || "Error casting vote");
    } finally {
      setVotingInProgress(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getElectionStatus = () => {
    if (!election) return null;
    const now = new Date();
    const start = new Date(election.startDate);
    const end = new Date(election.endDate);
    
    if (now < start) {
      return { text: "Not Started Yet", color: "bg-yellow-100 text-yellow-800", canVote: false };
    }
    if (now > end) {
      return { text: "Ended", color: "bg-gray-100 text-gray-600", canVote: false };
    }
    return { text: "Active", color: "bg-green-100 text-green-800", canVote: true };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading election details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Election</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🗳️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Election Not Found</h3>
          <p className="text-gray-600 mb-6">The election you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/voter")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const status = getElectionStatus();
  const canVote = status?.canVote && !hasVoted && user?.role === "voter";
  const totalVotes = election.candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Election Details</h1>
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

        {/* Election Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{election.title}</h1>
                <p className="text-indigo-100">{election.description}</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status?.color} bg-opacity-90`}>
                {status?.text}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium">{formatDate(election.startDate)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">End Date:</span>
                <span className="font-medium">{formatDate(election.endDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Voting Status Message */}
        {hasVoted && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-blue-800">You have already voted in this election</p>
                <p className="text-sm text-blue-600">Your vote has been recorded. Thank you for participating!</p>
              </div>
            </div>
          </div>
        )}

        {!status?.canVote && status?.text === "Not Started Yet" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-yellow-800">Voting hasn't started yet</p>
                <p className="text-sm text-yellow-600">Please check back on the start date to cast your vote.</p>
              </div>
            </div>
          </div>
        )}

        {status?.text === "Ended" && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p className="font-medium text-gray-800">Voting has ended</p>
                <p className="text-sm text-gray-600">This election is now closed. View the final results below.</p>
              </div>
            </div>
          </div>
        )}

        {/* Candidates Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Candidates</h2>
            {totalVotes > 0 && (
              <div className="text-sm text-gray-600">
                Total Votes Cast: <span className="font-semibold text-indigo-600">{totalVotes}</span>
              </div>
            )}
          </div>

          {election.candidates.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-gray-500 text-lg">No candidates available for this election.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {election.candidates.map((candidate) => {
                const votePercentage = totalVotes > 0 
                  ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) 
                  : "0";
                
                return (
                  <div
                    key={candidate._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{candidate.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">Party: {candidate.party}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">👤</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Age:</span>
                          <span className="font-medium">{candidate.age} years</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Votes Received:</span>
                          <span className="font-medium text-indigo-600">{candidate.voteCount}</span>
                        </div>
                        {totalVotes > 0 && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500">Percentage:</span>
                              <span className="font-medium">{votePercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${votePercentage}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {canVote && (
                        <button
                          onClick={() => setShowConfirmModal(candidate._id)}
                          disabled={votingInProgress === candidate._id}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {votingInProgress === candidate._id ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            "Vote"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Confirm Your Vote</h3>
                <button
                  onClick={() => setShowConfirmModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  Are you sure you want to vote for:
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {election.candidates.find(c => c._id === showConfirmModal)?.name}
                </p>
                <p className="text-sm text-red-500 mt-4">
                  ⚠️ This action cannot be undone. You can only vote once per election.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => vote(showConfirmModal)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
                >
                  Confirm Vote
                </button>
                <button
                  onClick={() => setShowConfirmModal(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}