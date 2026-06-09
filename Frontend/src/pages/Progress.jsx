import { useEffect, useState } from "react";
import API from "../services/api";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
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

      try {
        const badgeRes = await API.get(
          "/progress/badges",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBadges(badgeRes.data || []);
      } catch (err) {
        console.log("Badges API failed");
        setBadges([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [range]);

  const addWeight = async () => {
    if (!weight) return;
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
  
  const averageWeightLossPerEntry =
    totalEntries > 1
      ? (
          (startingWeight -
            currentWeight) /
          totalEntries
        ).toFixed(2)
      : 0;

  const predictedWeight30Days =
    (
      currentWeight -
      averageWeightLossPerEntry * 4
    ).toFixed(1);

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
    <div className="space-y-8 animate-[fadeIn_0.4s_ease-out]">
      
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900">Progress Tracker 📈</h1>
          <p className="text-slate-500 mt-1">Visualize weight timelines, track fitness indexes, and unlock achievements.</p>
        </div>
        
        {/* Save Weight & Range Selection Panel */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Add weight (kg)..."
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="bg-white border border-slate-300 focus:border-[#A3E635] text-slate-900 px-3 py-2 w-36 rounded-xl outline-none transition-all text-sm"
            />
            <button
              onClick={addWeight}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md"
            >
              Save
            </button>
          </div>
          
          <div className="w-px h-6 bg-slate-850" />
          
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-white border border-slate-300 focus:border-[#A3E635] text-slate-900 px-3 py-2 rounded-xl outline-none text-sm transition-all cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Main timeline graph */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Weight Journey Timeline</h2>
        <div className="w-full h-80 min-h-[320px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={320}>
            <LineChart data={chartData}>

              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A3E635" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#A3E635" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E2E8F0",
                  borderRadius: "12px",
                  color: "#0F172A",
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#A3E635"
                strokeWidth={3}
                dot={{ fill: '#A3E635', r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid of stats panels */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl">
          <span className="text-slate-500 text-xs font-semibold block uppercase tracking-wider">Current Weight</span>
          <p className="text-2xl font-extrabold text-cyan-600 mt-2">{currentWeight} kg</p>
        </div>
        
        <div className="bg-white border border-slate-200 p-5 rounded-2xl">
          <span className="text-slate-500 text-xs font-semibold block uppercase tracking-wider">Starting Weight</span>
          <p className="text-2xl font-extrabold text-purple-400 mt-2">{startingWeight} kg</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl">
          <span className="text-slate-500 text-xs font-semibold block uppercase tracking-wider">Total Progress</span>
          <p className={`text-2xl font-extrabold mt-2 ${Number(weightChange) >= 0 ? "text-emerald-400" : "text-rose-500"}`}>
            {weightChange > 0 ? `-${weightChange}` : Math.abs(weightChange)} kg
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl">
          <span className="text-slate-500 text-xs font-semibold block uppercase tracking-wider">Current Streak</span>
          <p className="text-2xl font-extrabold text-rose-500 mt-2">🔥 {streak} Days</p>
        </div>
      </div>

      {/* Fitness Score and Circular Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Fitness score circular */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Fitness Status Score</h3>
          <div className="w-28 h-28 mb-4">
            <CircularProgressbar
              value={fitnessScore}
              text={`${fitnessScore}%`}
              styles={buildStyles({
                textSize: "20px",
                pathColor: fitnessScore >= 80 ? "#10b981" : fitnessScore >= 60 ? "#a3e635" : "#f59e0b",
                textColor: "#1e293b",
                trailColor: "#E2E8F0",
                pathTransitionDuration: 0.8,
              })}
            />
          </div>
          <p className="text-xl font-bold text-slate-900">
            {fitnessScore >= 80 ? "Excellent 🔥" : fitnessScore >= 60 ? "Good Shape 💪" : "In Progress ⚡"}
          </p>
          <p className="text-xs text-slate-500 mt-2">Combined index of BMI targets, consistency patterns, and log frequency.</p>
        </div>

        {/* Prediction Panel */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">AI Weight Prediction 🔮</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Based on historical data loops and calorie intake parameters, your estimated body metrics projection.
            </p>
          </div>
          
          <div className="my-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Average Weekly Shift</span>
              <span className="font-semibold text-slate-900">{averageWeightLossPerEntry} kg</span>
            </div>
            <div className="flex justify-between text-sm border-t border-slate-200 pt-3">
              <span className="text-emerald-600 font-semibold">Predicted (30 Days)</span>
              <span className="font-bold text-emerald-600">{predictedWeight30Days} kg</span>
            </div>
          </div>
          
          <p className="text-[10px] text-slate-500">Estimates are mathematical trend line coordinates and do not replace professional nutritionist targets.</p>
        </div>

        {/* Goal Progress bar */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Goal Alignment 🎯</h3>
            <p className="text-slate-500 text-xs">Distance tracking to your target configuration.</p>
          </div>
          
          <div className="my-6">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Goal: {goalWeight || "Not Set"} kg</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between text-xs text-slate-500">
            <span>Remaining Target:</span>
            <span className="font-bold text-slate-900">
              {goalWeight ? `${Math.abs(currentWeight - goalWeight).toFixed(1)} kg` : "--"}
            </span>
          </div>
        </div>

      </div>

      {/* Achievements / Badges Container */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Milestones Unlocked 🏆</h2>
        {badges.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {badges.map((badge, index) => (
              <span
                key={index}
                className="bg-emerald-500/10 text-emerald-600 border border-[#A3E635]/20 px-4 py-2 rounded-xl text-sm font-semibold tracking-wide"
              >
                🏅 {badge}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No milestones unlocked yet. Continue logging your weights daily to gain entry achievements!</p>
        )}
      </div>

    </div>
  );
}

export default Progress;