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

  const [range, setRange] =
    useState("7d");

  const [user, setUser] =
    useState(null);

  const fetchProgress = async () => {
    try {
      const token =
        localStorage.getItem("token");

      // Progress Data
      const progressRes =
        await API.get(
          `/progress?range=${range}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setData(progressRes.data);

      // User Profile
      const profileRes =
        await API.get(
          "/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setUser(profileRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [range]);

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

  const currentWeight =
    data.length > 0
      ? data[data.length - 1]
          .weight
      : 0;

  const startingWeight =
    data.length > 0
      ? data[0].weight
      : 0;

  const weightChange = (
    startingWeight -
    currentWeight
  ).toFixed(1);

  const totalEntries =
    data.length;

  const goalWeight =
    user?.goalWeight || 0;

  let progressPercent = 0;

  if (
    goalWeight &&
    startingWeight &&
    currentWeight &&
    startingWeight !==
      goalWeight
  ) {
    progressPercent =
      Math.min(
        100,
        Math.max(
          0,
          Math.round(
            ((startingWeight -
              currentWeight) /
              (startingWeight -
                goalWeight)) *
              100
          )
        )
      );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-6">
        Progress Tracker 📈
      </h1>

      {/* Add Weight */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <input
          type="number"
          placeholder="Current Weight"
          value={weight}
          onChange={(e) =>
            setWeight(
              e.target.value
            )
          }
          className="border p-3 rounded mr-4"
        />

        <button
          onClick={addWeight}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Save Weight
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <label className="font-semibold mr-3">
          Time Range:
        </label>

        <select
          value={range}
          onChange={(e) =>
            setRange(
              e.target.value
            )
          }
          className="border p-2 rounded-lg"
        >
          <option value="7d">
            Last 7 Days
          </option>

          <option value="30d">
            Last 30 Days
          </option>

          <option value="3m">
            Last 3 Months
          </option>

          <option value="6m">
            Last 6 Months
          </option>

          <option value="1y">
            Last Year
          </option>

          <option value="all">
            All Time
          </option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Current Weight
          </h3>

          <p className="text-3xl font-bold text-blue-600">
            {currentWeight} kg
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Starting Weight
          </h3>

          <p className="text-3xl font-bold text-purple-600">
            {startingWeight} kg
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Weight Change
          </h3>

          <p
            className={`text-3xl font-bold ${
              Number(
                weightChange
              ) > 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {weightChange} kg
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Entries
          </h3>

          <p className="text-3xl font-bold text-orange-600">
            {totalEntries}
          </p>
        </div>

      </div>

      {/* Goal Progress */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h2 className="text-2xl font-bold mb-4">
          Goal Progress 🎯
        </h2>

        <p className="mb-3">
          Goal Weight:
          <span className="font-bold text-green-600">
            {" "}
            {goalWeight || "Not Set"} kg
          </span>
        </p>

        <div className="w-full bg-gray-200 rounded-full h-8">

          <div
            className="bg-green-600 h-8 rounded-full flex items-center justify-center text-white font-bold"
            style={{
              width: `${progressPercent}%`,
            }}
          >
            {progressPercent}%
          </div>

        </div>

      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-2xl font-bold mb-4">
          Weight Progress
        </h2>

        <ResponsiveContainer
          width="100%"
          height={400}
        >
          <LineChart
            data={chartData}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="weight"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default Progress;