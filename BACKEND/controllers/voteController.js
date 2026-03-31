// controllers/voteController.js
const User = require("../models/User");
const Candidate = require("../models/Candidate");
const Election = require("../models/Election");

exports.castVote = async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;
    const user = await User.findById(req.user._id);

    
    if (user.hasVoted.includes(electionId)) {
      return res.status(400).json({ error: "You have already voted in this election" });
    }

  
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });
    candidate.voteCount += 1;
    await candidate.save();

   
    user.hasVoted.push(electionId);
    await user.save();

    res.json({ message: "Vote cast successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};