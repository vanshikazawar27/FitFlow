import { useEffect, useState } from "react";
import API from "../services/api";

function WorkoutPlan() {
  const [workoutPlan, setWorkoutPlan] = useState("");
  const [savedPlans, setSavedPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch saved workout plans
  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        "/ai/workout-plans",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSavedPlans(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Generate workout plan
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

      // Refresh history
      fetchPlans();
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

      <button
        onClick={generateWorkoutPlan}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
      >
        {loading
          ? "Generating..."
          : "Generate Workout Plan"}
      </button>

      {/* Latest Generated Plan */}

      {workoutPlan && (
        <div className="bg-white shadow rounded-xl p-6 mt-6">
          <h2 className="text-2xl font-bold mb-4">
            Latest Workout Plan
          </h2>

          <pre className="whitespace-pre-wrap">
            {workoutPlan}
          </pre>
        </div>
      )}

      {/* Workout History */}

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Workout History
        </h2>

        {savedPlans.length === 0 ? (
          <div className="bg-white shadow rounded-xl p-6">
            No workout plans generated yet.
          </div>
        ) : (
          savedPlans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white shadow rounded-xl p-6 mb-4"
            >
              <div className="text-sm text-gray-500 mb-2">
                {new Date(
                  plan.createdAt
                ).toLocaleString()}
              </div>

              <pre className="whitespace-pre-wrap">
                {plan.plan}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default WorkoutPlan;