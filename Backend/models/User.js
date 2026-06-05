const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      default: null,
    },

    gender: {
      type: String,
      default: "",
    },

    height: {
      type: Number,
      default: null,
    },

    weight: {
      type: Number,
      default: null,
    },

    goal: {
      type: String,
      default: "",
    },
    goalWeight: {
  type: Number,
  default: null,
},
    experience: {
  type: String,
  default: "",
},


daysPerWeek: {
  type: Number,
  default: 3,
},
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema);