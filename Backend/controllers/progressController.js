const Progress = require("../models/Progress");

const addProgress = async (
  req,
  res
) => {
  try {
    const { weight } = req.body;

    const progress =
      await Progress.create({
        user: req.user.id,
        weight,
      });

    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProgress = async (
  req,
  res
) => {
  try {
    const progress =
      await Progress.find({
        user: req.user.id,
      }).sort({
        createdAt: 1,
      });

    res.json(progress);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addProgress,
  getProgress,
};