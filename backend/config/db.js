const mongoose = require('mongoose');

/**
 * connectDB
 * Connects to MongoDB using the DB_URL from .env.
 * Call this function from server.js when DB_URL is provided.
 */
const connectDB = async () => {
  try {
    if (!process.env.DB_URL) {
      console.warn('DB_URL is not set in .env — skipping database connection.');
      return;
    }

    const conn = await mongoose.connect(process.env.DB_URL);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
