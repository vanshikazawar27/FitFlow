const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Keep the server running so the frontend can reach the API and we can debug route-level behavior.
    // Auth/register will still fail until MongoDB credentials/connection are fixed.
  }
};

module.exports = connectDB;