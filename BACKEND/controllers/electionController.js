// controllers/electionController.js
const Election = require("../models/Election");
const Candidate = require("../models/Candidate");

// Create Election (Admin)
exports.createElection = async (req, res) => {
  try {
    const election = await Election.create(req.body);
    res.status(201).json({ message: "Election created", election });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all Elections
exports.getElections = async (req, res) => {
  try {
    const elections = await Election.find().populate("candidates");
    res.json(elections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Election
exports.getElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id).populate("candidates");
    if (!election) return res.status(404).json({ error: "Election not found" });
    res.json(election);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};