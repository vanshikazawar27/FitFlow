const express = require("express");

const {
  addProgress,
  getProgress,
  getStreak,
} = require(
  "../controllers/progressController"
);

const protect = require(
  "../middleware/auth"
);

const router = express.Router();

router.post(
  "/",
  protect,
  addProgress
);

router.get(
  "/",
  protect,
  getProgress
);

router.get(
  "/streak",
  protect,
  getStreak
);



module.exports = router;