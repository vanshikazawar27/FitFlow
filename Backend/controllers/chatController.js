const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const askFitnessQuestion = async (
  req,
  res
) => {
  try {
    const { question } = req.body;

    const completion =
      await client.chat.completions.create({
        model: "google/gemma-3-27b-it",
        messages: [
          {
            role: "system",
            content:
              "You are an expert fitness coach. Give safe, practical fitness and nutrition advice.",
          },
          {
            role: "user",
            content: question,
          },
        ],
      });

    res.json({
      success: true,
      answer:
        completion.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  askFitnessQuestion,
};