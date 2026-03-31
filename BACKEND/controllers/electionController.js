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
// Update Election (Admin)
exports.updateElection = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      { title, description, startDate, endDate },
      { new: true, runValidators: true }
    );
    
    if (!election) {
      return res.status(404).json({ error: "Election not found" });
    }
    
    res.json({ message: "Election updated successfully", election });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Election (Admin)
exports.deleteElection = async (req, res) => {
  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    
    if (!election) {
      return res.status(404).json({ error: "Election not found" });
    }
    
    // Also delete all associated candidates
    await Candidate.deleteMany({ election: req.params.id });
    
    res.json({ message: "Election deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};