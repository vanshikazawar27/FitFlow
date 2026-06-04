const express = require("express");

const {
  generateWorkoutPlan,
} = require("../controllers/aiController");

const protect = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

router.post(
  "/workout-plan",
  protect,
  generateWorkoutPlan
);

module.exports = router;