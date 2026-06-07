const OpenAI = require("openai");
const User = require("../models/User");
const DietPlan = require("../models/DietPlan");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const generateDietPlan = async (
  req,
  res
) => {
  try {
    const { dietType, budget } =
      req.body;

    const user = await User.findById(
      req.user.id
    );

    const prompt = `
Create a personalized diet plan.

User Details:

Weight: ${user?.weight} kg
Height: ${user?.height} cm
Age: ${user?.age}

Diet Type: ${dietType}
Monthly Budget: ₹${budget}

Provide:

1. Breakfast
2. Lunch
3.Evening snack
4. Dinner
5. Daily protein intake
6. Daily calorie intake
7. Hydration recommendations
7. Budget-friendly alternatives
8. Health tips

Format clearly with headings.
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

    const plan =
      completion.choices[0].message.content;

    const savedPlan =
      await DietPlan.create({
        user: user._id,
        dietType,
        budget,
        plan,
      });

    res.json({
      success: true,
      plan: savedPlan,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDietPlans = async (
  req,
  res
) => {
  try {
    const plans =
      await DietPlan.find({
        user: req.user.id,
      }).sort({
        createdAt: -1,
      });

    res.json(plans);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  generateDietPlan,
  getDietPlans,
};