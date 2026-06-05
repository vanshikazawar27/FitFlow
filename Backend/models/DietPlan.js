const mongoose = require("mongoose");

const dietPlanSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      dietType: {
        type: String,
        default: "",
      },

      budget: {
        type: String,
        default: "",
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
  mongoose.models.DietPlan ||
  mongoose.model(
    "DietPlan",
    dietPlanSchema
  );