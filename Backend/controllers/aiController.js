const OpenAI = require("openai");
const User = require("../models/User");
const WorkoutPlan = require("../models/WorkoutPlan");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Generate Workout Plan
const generateWorkoutPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const prompt = `
Generate a professional weekly workout plan.

User Details:
Goal: ${user.goal}
Age: ${user.age}
Weight: ${user.weight} kg
Height: ${user.height} cm

Return a day-wise workout schedule for 7 days.
`;

    const completion =
      await client.chat.completions.create({
        model: "google/gemma-3-27b-it",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const workoutPlan =
      completion.choices[0].message.content;

    // Save plan to MongoDB
    await WorkoutPlan.create({
      user: user._id,
      plan: workoutPlan,
    });

    res.status(200).json({
      success: true,
      workoutPlan,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Saved Workout Plans
const getWorkoutPlans = async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateWorkoutPlan,
  getWorkoutPlans,
};