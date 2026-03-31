const Candidate = require("../models/Candidate");
const Election = require("../models/Election");

// Add Candidate to Election
exports.addCandidate = async (req, res) => {
  try {
    const { name, party } = req.body;
    const { electionId } = req.params;
    
    // Check if election exists
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ error: "Election not found" });
    }
    
    // Create candidate (age is optional now)
    const candidate = await Candidate.create({
      name,
      party,
      age: req.body.age || 18, // Default age if not provided
      election: electionId
    });
    
    // Add candidate to election's candidates array
    election.candidates.push(candidate._id);
    await election.save();
    
    res.status(201).json({ message: "Candidate added successfully", candidate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all candidates for an election
exports.getCandidates = async (req, res) => {
  try {
    const { electionId } = req.params;
    const candidates = await Candidate.find({ election: electionId });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single candidate
exports.getCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Candidate
exports.updateCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { name, party, age } = req.body;
    
    const candidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { name, party, age },
      { new: true, runValidators: true }
    );
    
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    
    res.json({ message: "Candidate updated successfully", candidate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Candidate
exports.deleteCandidate = async (req, res) => {
  try {
    const { electionId, candidateId } = req.params;
    
    const candidate = await Candidate.findByIdAndDelete(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    
    // Remove candidate from election's candidates array
    await Election.findByIdAndUpdate(electionId, {
      $pull: { candidates: candidateId }
    });
    
    res.json({ message: "Candidate deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};