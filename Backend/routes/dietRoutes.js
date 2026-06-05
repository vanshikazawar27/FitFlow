const express = require("express");

const {
  generateDietPlan,
  getDietPlans,
} = require(
  "../controllers/dietController"
);

const protect = require(
  "../middleware/auth"
);

const router = express.Router();

router.post(
  "/generate",
  protect,
  generateDietPlan
);

router.get(
  "/history",
  protect,
  getDietPlans
);

module.exports = router;