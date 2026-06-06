import { useEffect, useState } from "react";
import API from "../services/api";

function WorkoutHistory() {
  const [plans, setPlans] = useState([]);

  const fetchPlans = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await API.get(
        "/ai/workout-plans",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPlans(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-6">
        Workout History 📚
      </h1>

      {plans.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow">
          No workout plans found.
        </div>
      ) : (
        plans.map((plan) => (
          <div
            key={plan._id}
            className="bg-white p-6 rounded-xl shadow mb-4"
          >
            <div className="text-sm text-gray-500 mb-3">
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
  );
}

export default WorkoutHistory;