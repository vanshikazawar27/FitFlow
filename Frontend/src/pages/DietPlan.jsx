import { useEffect, useState } from "react";
import API from "../services/api";

function DietPlan() {
  const [dietType, setDietType] = useState("");
  const [budget, setBudget] = useState("");

  const [dietPlan, setDietPlan] = useState("");

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        "/diet/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const generateDietPlan = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await API.post(
        "/diet/generate",
        {
          dietType,
          budget,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDietPlan(res.data.plan.plan);

      fetchHistory();
    } catch (error) {
      console.log(error);
      alert("Failed to generate diet plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6">
        AI Diet Planner 🍎
      </h1>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="mb-4">
          <label className="block mb-2">
            Diet Type
          </label>

          <select
            value={dietType}
            onChange={(e) =>
              setDietType(e.target.value)
            }
            className="border p-2 w-full rounded"
          >
            <option value="">
              Select Diet
            </option>

            <option value="Vegetarian">
              Vegetarian
            </option>

            <option value="Non-Vegetarian">
              Non-Vegetarian
            </option>

            <option value="Vegan">
              Vegan
            </option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            Monthly Budget
          </label>

          <input
            type="text"
            value={budget}
            onChange={(e) =>
              setBudget(e.target.value)
            }
            placeholder="₹3000"
            className="border p-2 w-full rounded"
          />
        </div>

        <button
          onClick={generateDietPlan}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          {loading
            ? "Generating..."
            : "Generate Diet Plan"}
        </button>
      </div>

      {dietPlan && (
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Latest Diet Plan
          </h2>

          <pre className="whitespace-pre-wrap">
            {dietPlan}
          </pre>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">
          Diet History
        </h2>

        {history.map((plan) => (
          <div
            key={plan._id}
            className="bg-white p-6 rounded-xl shadow mb-4"
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
        ))}
      </div>
    </div>
  );
}

export default DietPlan;