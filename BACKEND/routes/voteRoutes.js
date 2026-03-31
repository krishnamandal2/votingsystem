
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const { castVote } = require("../controllers/voteController");

router.post("/", authMiddleware, castVote); // Voter only

module.exports = router;