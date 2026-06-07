import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function DietPlan() {
  const [dietType, setDietType] = useState("");
  const [budget, setBudget] = useState("");
  const [dietPlan, setDietPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
    } catch (error) {
      console.log(error);
      alert("Failed to generate diet plan");
    } finally {
      setLoading(false);
    }
  };

const calculateCalories = () => {
  if (!weight || !height || !age) {
    alert("Please fill all fields");
    return;
  }

  const bmr =
    10 * Number(weight) +
    6.25 * Number(height) -
    5 * Number(age) +
    5;

  const maintenanceCalories =
    Math.round(bmr * 1.55);

  setCalories(maintenanceCalories);
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

        <div className="mb-6">
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

        <div className="flex gap-4">

          <button
            onClick={generateDietPlan}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            {loading
              ? "Generating..."
              : "Generate Diet Plan"}
          </button>

          <button
            onClick={() =>
              navigate("/diet-history")
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            View Diet History 📚
          </button>

        </div>

      </div>

      {dietPlan && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">
            Latest Diet Plan
          </h2>

          <pre className="whitespace-pre-wrap">
            {dietPlan}
          </pre>
        </div>
      )}

    </div>
  );
}

export default DietPlan;