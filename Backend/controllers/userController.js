const User = require("../models/User");

const updateProfile = async (req, res) => {
  try {
    const {
  age,
  gender,
  height,
  weight,
  goal,
  experience,
  daysPerWeek,
} = req.body;

    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.age = age;
    user.gender = gender;
    user.height = height;
    user.weight = weight;
    user.goal = goal;
    user.experience = experience;
    user.daysPerWeek = daysPerWeek;

    await user.save();

    res.json({
      success: true,
      user,
    });
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