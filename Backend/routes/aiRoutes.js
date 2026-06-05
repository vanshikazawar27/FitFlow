const express = require("express");

const {
  generateWorkoutPlan,
  getWorkoutPlans,
} = require("../controllers/aiController");

const protect = require("../middleware/auth");

const router = express.Router();

// Generate AI Workout Plan
router.post(
  "/workout-plan",
  protect,
  generateWorkoutPlan
);

// Get Saved Workout Plans
router.get(
  "/workout-plans",
  protect,
  getWorkoutPlans
);

module.exports = router;