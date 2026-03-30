// src/pages/ElectionDetails.tsx

import { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams } from "react-router-dom";

interface Candidate {
  _id: string;
  name: string;
  party: string;
  age: number;
  voteCount: number;
}

interface Election {
  _id: string;
  title: string;
  description: string;
  candidates: Candidate[];
}

export default function ElectionDetails() {
  // Type params
  const { id } = useParams<{ id: string }>();

  const [election, setElection] =
    useState<Election | null>(null);

  // Fetch election details
  useEffect(() => {
    const fetchElection = async () => {
      try {
        const res = await API.get<Election>(
          `/elections/${id}`
        );
        setElection(res.data);
      } catch (err) {
        console.error(
          "Error fetching election",
          err
        );
      }
    };

    if (id) {
      fetchElection();
    }
  }, [id]);

  // Vote function
  const vote = async (candidateId: string) => {
    try {
      await API.post("/votes", {
        electionId: id,
        candidateId,
      });

      alert("Vote cast successfully!");

      // Refresh election after vote
      if (id) {
        const res = await API.get<Election>(
          `/elections/${id}`
        );
        setElection(res.data);
      }

    } catch (err: any) {
      alert(
        err.response?.data?.error ||
        "Error casting vote"
      );
    }
  };

  if (!election) {
    return (
      <p className="p-6">
        Loading...
      </p>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {election.title}
      </h2>

      <p className="mb-4">
        {election.description}
      </p>

      <h3 className="text-xl font-semibold mb-2">
        Candidates
      </h3>

      {election.candidates.length === 0 ? (
        <p>No candidates available</p>
      ) : (
        election.candidates.map(
          (candidate) => (
            <div
              key={candidate._id}
              className="bg-white p-3 mb-2 rounded shadow flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold">
                  {candidate.name}
                </h4>

                <p>
                  Party: {candidate.party}
                </p>

                <p>
                  Age: {candidate.age}
                </p>

                <p>
                  Votes:{" "}
                  {candidate.voteCount}
                </p>
              </div>

              <button
                onClick={() =>
                  vote(candidate._id)
                }
                className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
              >
                Vote
              </button>
            </div>
          )
        )
      )}
    </div>
  );
}