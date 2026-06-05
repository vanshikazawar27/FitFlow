const express = require("express");

const {
  addProgress,
  getProgress,
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

module.exports = router;