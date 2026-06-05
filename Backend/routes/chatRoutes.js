const express = require("express");

const {
  askFitnessQuestion,
} = require(
  "../controllers/chatController"
);

const protect = require(
  "../middleware/auth"
);

const router = express.Router();

router.post(
  "/ask",
  protect,
  askFitnessQuestion
);

module.exports = router;