import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";


import DownloadReport from "../components/DownloadReport";
import AnimatedCard from "../components/AnimatedCard";

import {
  calculateBMI,
  getBMIStatus,
} from "../utils/calculateBMI";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-96 text-xl font-semibold text-slate-400">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <span className="text-3xl">⚡</span>
          <span>Loading FitFlow Dashboard...</span>
        </div>
      </div>
    );
  }

  const bmi = calculateBMI(user.weight, user.height);
  const status = getBMIStatus(Number(bmi));

  // Determine BMI progress percentage for radial/bar indicator (e.g. 10 to 40 range)
  const bmiVal = Number(bmi) || 20;
  const bmiPercent = Math.min(Math.max(((bmiVal - 15) / 25) * 100, 10), 100);

  return (
    <div className="space-y-8 animate-[fadeIn_0.4s_ease-out]">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#151D30] to-slate-900 p-8 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#06B6D4]/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[#A3E635] text-sm font-bold tracking-wider uppercase">Your Personal Hub</span>
            <h1 className="text-4xl font-extrabold text-white mt-1">FitFlow Fitness Dashboard</h1>
            <p className="text-slate-400 mt-2 max-w-xl">
              Track your health indexes, review workout consistency, and generate AI plans tailored perfectly to your constraints.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <DownloadReport />
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* BMI Card */}
        <AnimatedCard className="bg-[#0F172A]/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200 shadow-md">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-400 text-sm font-semibold">Body Mass Index</span>
            <span className="text-2xl">⚖️</span>
          </div>
          <p className="text-4xl font-extrabold text-[#06B6D4]">{bmi}</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-[#06B6D4]/10 text-[#06B6D4]">
            {status}
          </span>
          <div className="mt-4 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#06B6D4] h-1.5 rounded-full" style={{ width: `${bmiPercent}%` }} />
          </div>
        </AnimatedCard>

        {/* Current Weight Card */}
        <AnimatedCard className="bg-[#0F172A]/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200 shadow-md">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-400 text-sm font-semibold">Current Weight</span>
            <span className="text-2xl">⚖️</span>
          </div>
          <p className="text-4xl font-extrabold text-[#A3E635]">{user.weight || "--"} kg</p>
          <p className="text-xs text-slate-400 mt-2">
            Goal target: <span className="font-semibold text-white">{user.goalWeight || "Not Set"} kg</span>
          </p>
          <div className="mt-4 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#A3E635] h-1.5 rounded-full" style={{ width: "65%" }} />
          </div>
        </AnimatedCard>

        {/* Frequency & Experience */}
        <AnimatedCard className="bg-[#0F172A]/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200 shadow-md">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-400 text-sm font-semibold">Weekly Target</span>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-4xl font-extrabold text-white">{user.daysPerWeek || 0} Days</p>
          <p className="text-xs text-slate-400 mt-2">
            Skill Level: <span className="font-semibold text-[#A3E635]">{user.experience || "Not Set"}</span>
          </p>
          <div className="mt-4 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${((user.daysPerWeek || 0) / 7) * 100}%` }} />
          </div>
        </AnimatedCard>

        {/* Age & Height Card */}
        <AnimatedCard className="bg-[#0F172A]/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-200 shadow-md">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-400 text-sm font-semibold">Physical Profile</span>
            <span className="text-2xl">👤</span>
          </div>
          <p className="text-4xl font-extrabold text-white">{user.height || "--"} cm</p>
          <p className="text-xs text-slate-400 mt-2">
            Age: <span className="font-semibold text-white">{user.age || "--"} y/o</span> | Gender: <span className="font-semibold text-white">{user.gender || "--"}</span>
          </p>
          <div className="mt-4 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-slate-700 h-1.5 rounded-full" style={{ width: "100%" }} />
          </div>
        </AnimatedCard>
      </div>

      {/* Interactive Feature Cards */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">AI Co-Pilots & Trackers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Workouts Card */}
          <AnimatedCard className="bg-[#0F172A]/50 border border-slate-800 rounded-2xl p-6 hover:border-[#06B6D4]/30 hover:bg-[#06B6D4]/5 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <span className="text-3xl block mb-4">🏋️‍♂️</span>
              <h4 className="text-lg font-bold text-white group-hover:text-[#06B6D4] transition-colors">AI Workout Generator</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Receive customized workouts targetting strength, HIIT, or flexibility based on your metrics.
              </p>
            </div>
            <button
              onClick={() => navigate("/workout-plan")}
              className="mt-6 w-full bg-[#06B6D4] hover:bg-[#0891b2] text-slate-950 font-bold py-2.5 rounded-xl transition-all duration-200"
            >
              Get Workout Plan
            </button>
          </AnimatedCard>

          {/* Diet Card */}
          <AnimatedCard className="bg-[#0F172A]/50 border border-slate-800 rounded-2xl p-6 hover:border-[#A3E635]/30 hover:bg-[#A3E635]/5 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <span className="text-3xl block mb-4">🥗</span>
              <h4 className="text-lg font-bold text-white group-hover:text-[#A3E635] transition-colors">AI Diet Planner</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Generate budget-focused and nutrition-dense meal configurations matched to your goals.
              </p>
            </div>
            <button
              onClick={() => navigate("/diet-plan")}
              className="mt-6 w-full bg-[#A3E635] hover:bg-[#bbf055] text-slate-950 font-bold py-2.5 rounded-xl transition-all duration-200"
            >
              Get Diet Plan
            </button>
          </AnimatedCard>

          {/* Chat Card */}
          <AnimatedCard className="bg-[#0F172A]/50 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 hover:bg-indigo-550/5 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <span className="text-3xl block mb-4">🤖</span>
              <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">AI Fitness Coach</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Discuss exercise forms, nutrition hacks, or get motivation logs directly from your AI trainer.
              </p>
            </div>
            <button
              onClick={() => navigate("/fitness-chat")}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all duration-200"
            >
              Chat With Coach
            </button>
          </AnimatedCard>

          {/* Progress Card */}
          <AnimatedCard className="bg-[#0F172A]/50 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 hover:bg-emerald-550/5 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <span className="text-3xl block mb-4">📈</span>
              <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Progress Tracker</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Log weights daily, view trend timelines, unlock badges, and analyze future projections.
              </p>
            </div>
            <button
              onClick={() => navigate("/progress")}
              className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-all duration-200"
            >
              Analyze Progress
            </button>
          </AnimatedCard>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;