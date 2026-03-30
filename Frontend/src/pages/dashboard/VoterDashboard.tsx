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

export default function VoterDashboard() {
  const [elections, setElections] =
    useState<Election[]>([]);

  const navigate = useNavigate();

  // Fetch elections
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await API.get<Election[]>(
          "/elections"
        );
        setElections(res.data);
      } catch (err) {
        console.error(
          "Error fetching elections",
          err
        );
      }
    };

    fetchElections();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Voter Dashboard
      </h2>

      {elections.length === 0 ? (
        <p>No elections available</p>
      ) : (
        elections.map((election) => (
          <div
            key={election._id}
            className="bg-white p-3 mb-2 rounded shadow"
          >
            <h4 className="font-semibold">
              {election.title}
            </h4>

            <p>
              {election.description}
            </p>

            {/* Optional: show dates if available */}
            {election.startDate &&
              election.endDate && (
                <p className="text-sm text-gray-500">
                  {election.startDate} →{" "}
                  {election.endDate}
                </p>
              )}

            <button
              onClick={() =>
                navigate(
                  `/election/${election._id}`
                )
              }
              className="mt-2 bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
            >
              View Candidates & Vote
            </button>
          </div>
        ))
      )}
    </div>
  );
}