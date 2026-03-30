// routes/electionRoutes.js
const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const { createElection, getElections, getElection } = require("../controllers/electionController");

router.post("/", authMiddleware, adminMiddleware, createElection); // Admin only
router.get("/", authMiddleware, getElections);
router.get("/:id", authMiddleware, getElection);

module.exports = router;