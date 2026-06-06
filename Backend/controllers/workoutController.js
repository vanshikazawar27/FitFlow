const WorkoutPlan = require(
  "../models/WorkoutPlan"
);

const getWorkoutHistory =
  async (req, res) => {
    try {
      const workouts =
        await WorkoutPlan.find({
          user: req.user.id,
        }).sort({
          createdAt: -1,
        });

      res.json(workouts);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  getWorkoutHistory,
};