const User = require("../models/User");
const Progress = require("../models/Progress")
const {
  calculateCurrentStreak,
  calculateLongestStreak,
} = require("../utils/streakCalculator");
const calculateBadges = require("../utils/badgeCalculator");

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
    const { range } = req.query;

    let filter = {
      user: req.user.id,
    };

    if (
      range &&
      range !== "all"
    ) {
      const now = new Date();

      let startDate =
        new Date();

      switch (range) {
        case "7d":
          startDate.setDate(
            now.getDate() - 7
          );
          break;

        case "30d":
          startDate.setDate(
            now.getDate() - 30
          );
          break;

        case "3m":
          startDate.setMonth(
            now.getMonth() - 3
          );
          break;

        case "6m":
          startDate.setMonth(
            now.getMonth() - 6
          );
          break;

        case "1y":
          startDate.setFullYear(
            now.getFullYear() - 1
          );
          break;

        default:
          startDate = null;
      }

      if (startDate) {
        filter.createdAt = {
          $gte: startDate,
        };
      }
    }

    const progress =
      await Progress.find(filter)
        .sort({
          createdAt: 1,
        });

    res.json(progress);
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

const getStreak = async (
  req,
  res
) => {
  try {
    const progress =
      await Progress.find({
        user: req.user.id,
      });

    const currentStreak =
      calculateCurrentStreak(
        progress
      );

    const longestStreak =
      calculateLongestStreak(
        progress
      );

    res.json({
      currentStreak,
      longestStreak,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getBadges = async (
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

    const user =
      await User.findById(
        req.user.id
      );

    const streak =
      progress.length;

    const goalReached =
      user.goalWeight &&
      user.weight <=
        user.goalWeight;

    const badges =
      calculateBadges(
        progress,
        streak,
        goalReached
      );

    res.json(badges);
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

module.exports = {
  addProgress,
  getProgress,
  getStreak,
  getBadges,
};