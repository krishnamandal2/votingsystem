// src/pages/ElectionList.tsx

import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

interface Election {
  _id: string;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
}

export default function ElectionList() {
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
      <h2 className="text-xl font-bold mb-4">
        All Elections
      </h2>

      {elections.length === 0 ? (
        <p>No elections available</p>
      ) : (
        elections.map((election) => (
          <div
            key={election._id}
            className="bg-white p-4 mb-3 rounded shadow"
          >
            <h3 className="font-semibold">
              {election.title}
            </h3>

            <p>
              {election.description}
            </p>

            {/* Optional Dates */}
            {election.startDate &&
              election.endDate && (
                <p className="text-sm text-gray-500">
                  {election.startDate} →{" "}
                  {election.endDate}
                </p>
              )}

            <button
              className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
              onClick={() =>
                navigate(
                  `/election/${election._id}`
                )
              }
            >
              View Candidates
            </button>
          </div>
        ))
      )}
    </div>
  );
}