import { useEffect, useState } from "react";
import API from "../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Progress() {
  const [weight, setWeight] =
    useState("");

  const [data, setData] =
    useState([]);

  const fetchProgress = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await API.get(
        "/progress",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const addWeight = async () => {
    try {
      const token =
        localStorage.getItem("token");

      await API.post(
        "/progress",
        {
          weight,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWeight("");

      fetchProgress();
    } catch (error) {
      console.log(error);
    }
  };

  const chartData = data.map(
    (item) => ({
      date: new Date(
        item.createdAt
      ).toLocaleDateString(),

      weight: item.weight,
    })
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6">
        Progress Tracker 📈
      </h1>

      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <input
          type="number"
          placeholder="Current Weight"
          value={weight}
          onChange={(e) =>
            setWeight(e.target.value)
          }
          className="border p-3 rounded mr-4"
        />

        <button
          onClick={addWeight}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Save Weight
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <ResponsiveContainer
          width="100%"
          height={400}
        >
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="weight"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Progress;