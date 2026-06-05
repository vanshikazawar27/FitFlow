const User = require("../models/User");

const updateProfile = async (
  req,
  res
) => {
  try {
    const {
      age,
      gender,
      height,
      weight,
      goal,
      goalWeight,
      experience,
      daysPerWeek,
    } = req.body;

    const user =
      await User.findById(
        req.user.id
      );

    user.age = age;
    user.gender = gender;
    user.height = height;
    user.weight = weight;
    user.goal = goal;
    user.goalWeight = goalWeight;

    user.experience =
      experience;

    user.daysPerWeek =
      daysPerWeek;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  updateProfile,
  getProfile,
};