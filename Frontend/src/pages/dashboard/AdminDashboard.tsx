// src/pages/dashboard/AdminDashboard.tsx
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
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

// Random candidate data
const candidateNames = [
  "Alice Johnson",
  "Bob Smith",
  "Charlie Brown",
  "Diana Prince",
  "Ethan Hunt",
];

const parties = [
  "Democratic",
  "Republican",
  "Independent",
  "Green Party",
  "Libertarian",
];

// Helper to generate random candidates
const generateCandidates = () => {
  const num = Math.floor(Math.random() * 3) + 2; // 2-4 candidates
  const candidates = [];
  for (let i = 0; i < num; i++) {
    const name = candidateNames[Math.floor(Math.random() * candidateNames.length)];
    const party = parties[Math.floor(Math.random() * parties.length)];
    candidates.push({ name, party });
  }
  return candidates;
};

export default function AdminDashboard() {
  const [elections, setElections] = useState<Election[]>([]);
  const [newElection, setNewElection] = useState<NewElection>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  // Fetch elections
  const fetchElections = async () => {
    try {
      const res = await API.get<Election[]>("/elections");
      setElections(res.data);
    } catch (err) {
      console.error("Error fetching elections");
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewElection({
      ...newElection,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await API.post("/elections", newElection);
      alert("Election created successfully");
      setNewElection({ title: "", description: "", startDate: "", endDate: "" });
      fetchElections();
    } catch (err: any) {
      alert(err.response?.data?.error || "Error creating election");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Create Election Form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Create New Election</h3>

        <input
          name="title"
          placeholder="Title"
          value={newElection.title}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded"
          required
        />

        <input
          name="description"
          placeholder="Description"
          value={newElection.description}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded"
          required
        />

        <input
          name="startDate"
          type="date"
          value={newElection.startDate}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded"
          required
        />

        <input
          name="endDate"
          type="date"
          value={newElection.endDate}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Create Election
        </button>
      </form>

      {/* Existing Elections */}
      <h3 className="font-semibold mb-2">Existing Elections</h3>

      {elections.map((election) => (
        <div key={election._id} className="bg-white p-3 mb-2 rounded shadow">
          <h4 className="font-semibold">{election.title}</h4>
          <p>{election.description}</p>
          <p className="text-sm text-gray-500">
            {election.startDate} → {election.endDate}
          </p>

          {/* Random candidates */}
          <div className="mt-2">
            <h5 className="font-semibold">Candidates:</h5>
            <ul className="list-disc pl-5">
              {generateCandidates().map((c, idx) => (
                <li key={idx}>
                  {c.name} ({c.party})
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}