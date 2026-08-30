const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(express.json());
app.use(cors());

// ─── Health Check Route ───────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Singaji Feedback System API is running.' });
});

// ─── Server ───────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
