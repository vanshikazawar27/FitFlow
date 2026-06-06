import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function WorkoutPlan() {
  const [workoutPlan, setWorkoutPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const generateWorkoutPlan = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await API.post(
        "/ai/workout-plan",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWorkoutPlan(res.data.workoutPlan);
    } catch (error) {
      console.log(error);
      alert("Failed to generate workout plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-6">
        AI Workout Generator 💪
      </h1>

      <div className="flex gap-4 mb-6">

        <button
          onClick={generateWorkoutPlan}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          {loading
            ? "Generating..."
            : "Generate Workout Plan"}
        </button>

        <button
          onClick={() =>
            navigate("/workout-history")
          }
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
        >
          View Workout History 📚
        </button>

      </div>

      {workoutPlan && (
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">
            Latest Workout Plan
          </h2>

          <pre className="whitespace-pre-wrap">
            {workoutPlan}
          </pre>
        </div>
      )}

    </div>
  );
}

export default WorkoutPlan;