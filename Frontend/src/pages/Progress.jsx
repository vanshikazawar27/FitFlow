import { useEffect, useState } from "react";
import API from "../services/api";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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
  const [weight, setWeight] = useState("");
  const [data, setData] = useState([]);
  const [range, setRange] = useState("7d");
  const [user, setUser] = useState(null);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState([]);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");

      const progressRes = await API.get(
        `/progress?range=${range}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(progressRes.data);

      const profileRes = await API.get(
        "/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(profileRes.data);

      const streakRes = await API.get(
        "/progress/streak",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStreak(
        streakRes.data.currentStreak || 0
      );

      const badgeRes = await API.get(
        "/progress/badges",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBadges(badgeRes.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [range]);

  const addWeight = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/progress",
        { weight },
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

  const chartData = data.map((item) => ({
    date: new Date(
      item.createdAt
    ).toLocaleDateString(),
    weight: item.weight,
  }));

  const currentWeight =
    data.length > 0
      ? data[data.length - 1].weight
      : 0;

  const startingWeight =
    data.length > 0
      ? data[0].weight
      : 0;

  const totalEntries = data.length;

  const weightChange = (
    startingWeight - currentWeight
  ).toFixed(1);

  const goalWeight =
    user?.goalWeight || 0;

  let progressPercent = 0;

  if (
    goalWeight > 0 &&
    startingWeight > 0 &&
    currentWeight > 0 &&
    startingWeight !== goalWeight
  ) {
    progressPercent = Math.round(
      ((startingWeight -
        currentWeight) /
        (startingWeight -
          goalWeight)) *
        100
    );

    progressPercent = Math.max(
      0,
      Math.min(progressPercent, 100)
    );
  }

  let fitnessScore = 0;

  if (
    user?.height &&
    currentWeight
  ) {
    const bmi =
      currentWeight /
      Math.pow(
        user.height / 100,
        2
      );

    if (
      bmi >= 18.5 &&
      bmi <= 24.9
    ) {
      fitnessScore += 30;
    } else if (
      bmi >= 17 &&
      bmi <= 29
    ) {
      fitnessScore += 20;
    } else {
      fitnessScore += 10;
    }
  }

  fitnessScore += Math.min(
    progressPercent * 0.4,
    40
  );

  fitnessScore += Math.min(
    totalEntries * 2,
    30
  );

  fitnessScore =
    Math.round(fitnessScore);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6">
        Progress Tracker 📈
      </h1>

      {/* Weight Entry */}
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
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
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
              Number(weightChange) >= 0
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

      {/* Fitness Score */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-bold mb-4">
          Fitness Score 🏆
        </h2>

        <div className="flex items-center gap-8">
          <div
            style={{
              width: 120,
              height: 120,
            }}
          >
            <CircularProgressbar
              value={fitnessScore}
              text={`${fitnessScore}`}
            />
          </div>

          <div>
            <p className="text-2xl font-bold">
              {fitnessScore >= 80
                ? "Excellent 🔥"
                : fitnessScore >= 60
                ? "Good 💪"
                : "Needs Improvement ⚡"}
            </p>

            <p className="text-gray-500 mt-2">
              Based on BMI,
              goal progress and
              consistency.
            </p>
          </div>
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

      {/* Achievements */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-bold mb-4">
          Achievements 🏆
        </h2>

        {badges.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {badges.map(
              (
                badge,
                index
              ) => (
                <div
                  key={index}
                  className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold"
                >
                  {badge}
                </div>
              )
            )}
          </div>
        ) : (
          <p>
            No achievements
            unlocked yet.
          </p>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-bold mb-4">
          Weight Progress
        </h2>

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
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Streak */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-gray-500">
          Current Streak
        </h3>

        <p className="text-3xl font-bold text-red-600">
          🔥 {streak} Days
        </p>
      </div>
    </div>
  );
}

export default Progress;