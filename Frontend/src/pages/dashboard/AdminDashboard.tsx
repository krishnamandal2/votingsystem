// src/pages/dashboard/AdminDashboard.tsx

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

interface Election {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface NewElection {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface Candidate {
  name: string;
  party: string;
  _id?: string;
  votes?: number;
}

interface ElectionWithCandidates extends Election {
  candidates?: Candidate[];
}

export default function AdminDashboard() {
  const [elections, setElections] = useState<ElectionWithCandidates[]>([]);
  const [newElection, setNewElection] = useState<NewElection>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingElection, setEditingElection] = useState<Election | null>(null);
  const [showCandidatesModal, setShowCandidatesModal] = useState(false);
  const [selectedElection, setSelectedElection] = useState<ElectionWithCandidates | null>(null);
  const [newCandidate, setNewCandidate] = useState({ name: "", party: "" });
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (role !== "admin") {
      navigate("/voter", { replace: true });
      return;
    }

    if (name && email) {
      setUser({ name, email });
    }
  }, [navigate]);

  // Fetch elections
  const fetchElections = async () => {
    try {
      setLoading(true);
      const res = await API.get<Election[]>("/elections");
      // Fetch candidates for each election
      const electionsWithCandidates = await Promise.all(
        res.data.map(async (election) => {
          try {
            const candidatesRes = await API.get(`/elections/${election._id}/candidates`);
            return { ...election, candidates: candidatesRes.data };
          } catch {
            return { ...election, candidates: [] };
          }
        })
      );
      setElections(electionsWithCandidates);
      setError(null);
    } catch (err) {
      console.error("Error fetching elections", err);
      setError("Failed to load elections. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  // Handle input change for new election
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewElection({
      ...newElection,
      [e.target.name]: e.target.value,
    });
  };

  // Handle edit election change
  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingElection) {
      setEditingElection({
        ...editingElection,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Handle create election
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await API.post("/elections", newElection);
      setSuccessMessage("Election created successfully!");
      setNewElection({ title: "", description: "", startDate: "", endDate: "" });
      setShowCreateForm(false);
      fetchElections();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error creating election");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Handle update election
  const handleUpdateElection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingElection) return;
    
    try {
      await API.put(`/elections/${editingElection._id}`, {
        title: editingElection.title,
        description: editingElection.description,
        startDate: editingElection.startDate,
        endDate: editingElection.endDate,
      });
      setSuccessMessage("Election updated successfully!");
      setEditingElection(null);
      fetchElections();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error updating election");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Handle delete election
  const handleDeleteElection = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this election? This will also delete all associated candidates and votes.")) {
      try {
        await API.delete(`/elections/${id}`);
        setSuccessMessage("Election deleted successfully!");
        fetchElections();
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err: any) {
        setError(err.response?.data?.error || "Error deleting election");
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  // Handle add candidate
  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedElection) return;
    
    try {
      await API.post(`/elections/${selectedElection._id}/candidates`, newCandidate);
      setSuccessMessage("Candidate added successfully!");
      setNewCandidate({ name: "", party: "" });
      fetchElections();
      // Refresh the modal data
      const updatedElection = elections.find(e => e._id === selectedElection._id);
      if (updatedElection) {
        setSelectedElection(updatedElection);
      }
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error adding candidate");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Handle delete candidate
  const handleDeleteCandidate = async (electionId: string, candidateId: string) => {
    if (window.confirm("Are you sure you want to remove this candidate?")) {
      try {
        await API.delete(`/elections/${electionId}/candidates/${candidateId}`);
        setSuccessMessage("Candidate removed successfully!");
        fetchElections();
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err: any) {
        setError(err.response?.data?.error || "Error removing candidate");
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getElectionStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return { text: "Upcoming", color: "bg-yellow-100 text-yellow-800" };
    if (now > end) return { text: "Ended", color: "bg-gray-100 text-gray-600" };
    return { text: "Active", color: "bg-green-100 text-green-800" };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <button
                  onClick={() => setShowAccountModal(true)}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
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
        {/* Messages */}
        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-600">{successMessage}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Header with Create Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Elections</h2>
            <p className="text-gray-600 mt-1">Create and manage elections, candidates, and view results</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Election</span>
          </button>
        </div>

        {/* Create Election Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Create New Election</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  name="title"
                  placeholder="Enter election title"
                  value={newElection.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  placeholder="Enter election description"
                  value={newElection.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    name="startDate"
                    type="datetime-local"
                    value={newElection.startDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    name="endDate"
                    type="datetime-local"
                    value={newElection.endDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Create Election
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Election Form */}
        {editingElection && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Edit Election</h3>
            <form onSubmit={handleUpdateElection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  name="title"
                  value={editingElection.title}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editingElection.description}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    name="startDate"
                    type="datetime-local"
                    value={editingElection.startDate.slice(0, 16)}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    name="endDate"
                    type="datetime-local"
                    value={editingElection.endDate.slice(0, 16)}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Update Election
                </button>
                <button
                  type="button"
                  onClick={() => setEditingElection(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Elections List */}
        <div className="space-y-4">
          {elections.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">🗳️</div>
              <p className="text-gray-500 text-lg">No elections created yet.</p>
              <p className="text-gray-400">Click the "Create Election" button to get started.</p>
            </div>
          ) : (
            elections.map((election) => {
              const status = getElectionStatus(election.startDate, election.endDate);
              return (
                <div key={election._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{election.title}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {status.text}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{election.description}</p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span>📅 Start: {formatDate(election.startDate)}</span>
                          <span>📅 End: {formatDate(election.endDate)}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedElection(election);
                            setShowCandidatesModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-2"
                          title="Manage Candidates"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setEditingElection(election)}
                          className="text-green-600 hover:text-green-800 p-2"
                          title="Edit Election"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteElection(election._id)}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="Delete Election"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Candidates Preview */}
                    {election.candidates && election.candidates.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-semibold text-gray-700 mb-2">Candidates ({election.candidates.length})</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {election.candidates.slice(0, 4).map((candidate, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span>
                                <span className="font-medium">{candidate.name}</span>
                                <span className="text-gray-500 ml-2">({candidate.party})</span>
                              </span>
                              {candidate.votes !== undefined && (
                                <span className="text-blue-600 font-medium">{candidate.votes} votes</span>
                              )}
                            </div>
                          ))}
                          {election.candidates.length > 4 && (
                            <p className="text-sm text-gray-500 col-span-2">
                              +{election.candidates.length - 4} more candidates
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Account Modal */}
      {showAccountModal && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Admin Account</h3>
                <button
                  onClick={() => setShowAccountModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">Administrator</p>
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
                  <p className="text-gray-900">Administrator</p>
                </div>
              </div>
              
              <div className="mt-6">
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

      {/* Manage Candidates Modal */}
      {showCandidatesModal && selectedElection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Manage Candidates - {selectedElection.title}
                </h3>
                <button
                  onClick={() => {
                    setShowCandidatesModal(false);
                    setSelectedElection(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Add Candidate Form */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Add New Candidate</h4>
                <form onSubmit={handleAddCandidate} className="space-y-3">
                  <input
                    placeholder="Candidate Name"
                    value={newCandidate.name}
                    onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    placeholder="Party/Affiliation"
                    value={newCandidate.party}
                    onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Add Candidate
                  </button>
                </form>
              </div>

              {/* Candidates List */}
              <div>
                <h4 className="font-semibold mb-3">Current Candidates</h4>
                {selectedElection.candidates && selectedElection.candidates.length > 0 ? (
                  <div className="space-y-2">
                    {selectedElection.candidates.map((candidate, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{candidate.name}</p>
                          <p className="text-sm text-gray-500">{candidate.party}</p>
                          {candidate.votes !== undefined && (
                            <p className="text-sm text-blue-600">Votes: {candidate.votes}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteCandidate(selectedElection._id, candidate._id!)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No candidates added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}