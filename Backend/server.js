const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const aiRoutes = require("./routes/aiRoutes");
const dietRoutes = require("./routes/dietRoutes");
const chatRoutes = require("./routes/chatRoutes");
const progressRoutes = require("./routes/progressRoutes");
const reportRoutes = require("./routes/reportRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
//const progressPhotoRoutes = require("./routes/progressPhotoRoutes");

const protect = require("./middleware/auth");

console.log(
  "OPENROUTER:",
  process.env.OPENROUTER_API_KEY
);

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/progress", progressRoutes);
//app.use("/api/progress-photos", progressPhotoRoutes);


app.get("/", (req, res) => {
  res.send("FitFlow API Running...");
});

const path = require("path");

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// Protected Route Test
app.get(
  "/api/protected",
  protect,
  (req, res) => {
    res.json({
      message: "Protected data",
      user: req.user,
    });
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});