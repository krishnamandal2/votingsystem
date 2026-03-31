const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const {
  addCandidate,
  getCandidates,
  getCandidate,
  updateCandidate,
  deleteCandidate
} = require("../controllers/candidateController");


router.post("/:electionId/candidates", authMiddleware, adminMiddleware, addCandidate);
router.get("/:electionId/candidates", authMiddleware, getCandidates);
router.get("/:electionId/candidates/:candidateId", authMiddleware, getCandidate);
router.put("/:electionId/candidates/:candidateId", authMiddleware, adminMiddleware, updateCandidate);
router.delete("/:electionId/candidates/:candidateId", authMiddleware, adminMiddleware, deleteCandidate);

module.exports = router; 