const Candidate = require("../models/Candidate");
const Election = require("../models/Election");


exports.addCandidate = async (req, res) => {
  try {
    const { name, party } = req.body;
    const { electionId } = req.params;
    
    
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ error: "Election not found" });
    }
    
   
    const candidate = await Candidate.create({
      name,
      party,
      age: req.body.age || 18, 
      election: electionId
    });
    
    
    election.candidates.push(candidate._id);
    await election.save();
    
    res.status(201).json({ message: "Candidate added successfully", candidate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getCandidates = async (req, res) => {
  try {
    const { electionId } = req.params;
    const candidates = await Candidate.find({ election: electionId });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


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


exports.deleteCandidate = async (req, res) => {
  try {
    const { electionId, candidateId } = req.params;
    
    const candidate = await Candidate.findByIdAndDelete(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    
    
    await Election.findByIdAndUpdate(electionId, {
      $pull: { candidates: candidateId }
    });
    
    res.json({ message: "Candidate deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};