const OpenAI = require("openai");
const User = require("../models/User");

console.log(process.env.OPENROUTER_API_KEY);

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const generateWorkoutPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const prompt = `
Generate a weekly workout plan.

Goal: ${user.goal}
Experience: ${user.experience}
Days Per Week: ${user.daysPerWeek}

Return a clean day-wise workout schedule.
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

    res.json({
      success: true,
      workoutPlan,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  generateWorkoutPlan,
};