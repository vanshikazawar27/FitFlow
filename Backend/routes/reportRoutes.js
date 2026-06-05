const express = require("express");

const {
  generateReport,
} = require(
  "../controllers/reportController"
);

const protect = require(
  "../middleware/auth"
);

const router = express.Router();

router.get(
  "/download",
  protect,
  generateReport
);

module.exports = router;