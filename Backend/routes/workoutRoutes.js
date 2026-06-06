const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");

const {
  getWorkoutHistory,
} = require("../controllers/workoutController");

router.get(
  "/history",
  protect,
  getWorkoutHistory
);

module.exports = router;