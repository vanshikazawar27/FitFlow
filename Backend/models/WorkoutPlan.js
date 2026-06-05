const mongoose = require("mongoose");

const workoutPlanSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      plan: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.models.WorkoutPlan ||
  mongoose.model(
    "WorkoutPlan",
    workoutPlanSchema
  );