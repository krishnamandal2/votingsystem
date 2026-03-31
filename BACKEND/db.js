
require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');

const mongoURL = process.env.MONGODB_URL_LOCAL

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));


const db = mongoose.connection;


db.on('connected', () => console.log('🔗 MongoDB connected'));
db.on('error', (err) => console.error('⚠️ MongoDB connection error:', err));
db.on('disconnected', () => console.log('⚡ MongoDB disconnected'));


process.on('SIGINT', async () => {
  await db.close();
  console.log('💤 MongoDB connection closed due to app termination');
  process.exit(0);
});


module.exports = db;