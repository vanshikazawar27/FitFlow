const express = require("express");
const protect = require("./middleware/auth");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("FitFlow API Running...");
});

const PORT = process.env.PORT || 5000;

app.get('/api/protected', protect, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});