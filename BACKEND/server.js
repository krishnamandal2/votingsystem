require('dotenv').config(); 
const express = require('express');
const cors = require('cors');

const db = require('./db');

const userRoutes = require('./routes/userRoutes');
const electionRoutes = require('./routes/electionRoutes');
const voteRoutes = require('./routes/voteRoutes');
// const candidateRoutes = require("./routes/candidateRoutes"); // REMOVE THIS LINE

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/elections', electionRoutes); // This now includes candidate routes
app.use('/api/votes', voteRoutes);
// app.use("/api/elections", candidateRoutes); // REMOVE THIS LINE

app.get('/', (req, res) => {
  res.send('Voting Management System API is running ');
});

db.once('open', () => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});