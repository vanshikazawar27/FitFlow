import { useState } from "react";
import API from "../services/api";

function FitnessChat() {
  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const askQuestion = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const res = await API.post(
        "/chat/ask",
        {
          question,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnswer(res.data.answer);
    } catch (error) {
      console.log(error);
      alert("Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6">
        AI Fitness Coach 🤖
      </h1>

      <textarea
        rows="4"
        value={question}
        onChange={(e) =>
          setQuestion(e.target.value)
        }
        placeholder="Ask any fitness question..."
        className="w-full border p-3 rounded-lg"
      />

      <button
        onClick={askQuestion}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4"
      >
        {loading
          ? "Thinking..."
          : "Ask AI"}
      </button>

      {answer && (
        <div className="bg-white p-6 rounded-xl shadow mt-6">
          <h2 className="text-2xl font-bold mb-4">
            AI Response
          </h2>

          <p className="whitespace-pre-wrap">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default FitnessChat;