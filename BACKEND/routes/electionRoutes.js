// routes/electionRoutes.js
const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const { 
  createElection, 
  getElections, 
  getElection,
  updateElection,
  deleteElection
} = require("../controllers/electionController");
const {
  addCandidate,
  getCandidates,
  deleteCandidate
} = require("../controllers/candidateController");

// Election routes
router.post("/", authMiddleware, adminMiddleware, createElection);
router.get("/", authMiddleware, getElections);
router.get("/:id", authMiddleware, getElection);
router.put("/:id", authMiddleware, adminMiddleware, updateElection);
router.delete("/:id", authMiddleware, adminMiddleware, deleteElection);

// Candidate routes (nested under elections)
router.post("/:electionId/candidates", authMiddleware, adminMiddleware, addCandidate);
router.get("/:electionId/candidates", authMiddleware, getCandidates);
router.delete("/:electionId/candidates/:candidateId", authMiddleware, adminMiddleware, deleteCandidate);

module.exports = router;