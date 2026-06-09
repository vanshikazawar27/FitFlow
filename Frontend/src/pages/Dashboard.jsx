import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";


import DownloadReport from "../components/DownloadReport";
import AnimatedCard from "../components/AnimatedCard";
import AnimatedContainer from "../components/AnimatedContainer";
import AnimatedItem from "../components/AnimatedItem";

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
      <div className="flex justify-center items-center h-96 text-xl font-semibold text-slate-500">
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
    <AnimatedContainer className="space-y-8">
      {/* Welcome Banner */}
      <AnimatedItem>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 border border-teal-400 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-emerald-100 text-sm font-bold tracking-wider uppercase">Your Personal Hub</span>
              <h1 className="text-4xl font-extrabold text-slate-900 mt-1">FitFlow Fitness Dashboard</h1>
              <p className="text-emerald-50 mt-2 max-w-xl">
                Track your health indexes, review workout consistency, and generate AI plans tailored perfectly to your constraints.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DownloadReport />
            </div>
          </div>
        </div>
      </AnimatedItem>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* BMI Card */}
        <AnimatedItem>
          <AnimatedCard className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-all duration-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-500 text-sm font-semibold">Body Mass Index</span>
              <span className="text-2xl">⚖️</span>
            </div>
            <p className="text-4xl font-extrabold text-cyan-600">{bmi}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700">
              {status}
            </span>
            <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${bmiPercent}%` }} />
            </div>
          </AnimatedCard>
        </AnimatedItem>

        {/* Current Weight Card */}
        <AnimatedItem>
          <AnimatedCard className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-all duration-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-500 text-sm font-semibold">Current Weight</span>
              <span className="text-2xl">⚖️</span>
            </div>
            <p className="text-4xl font-extrabold text-emerald-600">{user.weight || "--"} kg</p>
            <p className="text-xs text-slate-500 mt-2">
              Goal target: <span className="font-semibold text-slate-900">{user.goalWeight || "Not Set"} kg</span>
            </p>
            <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "65%" }} />
            </div>
          </AnimatedCard>
        </AnimatedItem>

        {/* Frequency & Experience */}
        <AnimatedItem>
          <AnimatedCard className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-all duration-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-500 text-sm font-semibold">Weekly Target</span>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-4xl font-extrabold text-slate-900">{user.daysPerWeek || 0} Days</p>
            <p className="text-xs text-slate-500 mt-2">
              Skill Level: <span className="font-semibold text-emerald-600">{user.experience || "Not Set"}</span>
            </p>
            <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${((user.daysPerWeek || 0) / 7) * 100}%` }} />
            </div>
          </AnimatedCard>
        </AnimatedItem>

        {/* Age & Height Card */}
        <AnimatedItem>
          <AnimatedCard className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-all duration-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-500 text-sm font-semibold">Physical Profile</span>
              <span className="text-2xl">👤</span>
            </div>
            <p className="text-4xl font-extrabold text-slate-900">{user.height || "--"} cm</p>
            <p className="text-xs text-slate-500 mt-2">
              Age: <span className="font-semibold text-slate-900">{user.age || "--"} y/o</span> | Gender: <span className="font-semibold text-slate-900">{user.gender || "--"}</span>
            </p>
            <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-slate-300 h-1.5 rounded-full" style={{ width: "100%" }} />
            </div>
          </AnimatedCard>
        </AnimatedItem>
      </div>

      {/* Interactive Feature Cards */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-6">AI Co-Pilots & Trackers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Workouts Card */}
          <AnimatedItem>
            <AnimatedCard className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-cyan-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between group h-full">
              <div>
                <span className="text-3xl block mb-4 group-hover:scale-110 transition-transform">🏋️‍♂️</span>
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">AI Workout Generator</h4>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Receive customized workouts targetting strength, HIIT, or flexibility based on your metrics.
                </p>
              </div>
              <button
                onClick={() => navigate("/workout-plan")}
                className="mt-6 w-full bg-cyan-100 hover:bg-cyan-200 text-cyan-800 font-bold py-2.5 rounded-xl transition-all duration-200"
              >
                Get Workout Plan
              </button>
            </AnimatedCard>
          </AnimatedItem>

          {/* Diet Card */}
          <AnimatedItem>
            <AnimatedCard className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between group h-full">
              <div>
                <span className="text-3xl block mb-4 group-hover:scale-110 transition-transform">🥗</span>
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">AI Diet Planner</h4>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Generate budget-focused and nutrition-dense meal configurations matched to your goals.
                </p>
              </div>
              <button
                onClick={() => navigate("/diet-plan")}
                className="mt-6 w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold py-2.5 rounded-xl transition-all duration-200"
              >
                Get Diet Plan
              </button>
            </AnimatedCard>
          </AnimatedItem>

          {/* Chat Card */}
          <AnimatedItem>
            <AnimatedCard className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between group h-full">
              <div>
                <span className="text-3xl block mb-4 group-hover:scale-110 transition-transform">🤖</span>
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">AI Fitness Coach</h4>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Discuss exercise forms, nutrition hacks, or get motivation logs directly from your AI trainer.
                </p>
              </div>
              <button
                onClick={() => navigate("/fitness-chat")}
                className="mt-6 w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold py-2.5 rounded-xl transition-all duration-200"
              >
                Chat With Coach
              </button>
            </AnimatedCard>
          </AnimatedItem>

          {/* Progress Card */}
          <AnimatedItem>
            <AnimatedCard className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-teal-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between group h-full">
              <div>
                <span className="text-3xl block mb-4 group-hover:scale-110 transition-transform">📈</span>
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">Progress Tracker</h4>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Log weights daily, view trend timelines, unlock badges, and analyze future projections.
                </p>
              </div>
              <button
                onClick={() => navigate("/progress")}
                className="mt-6 w-full bg-teal-100 hover:bg-teal-200 text-teal-800 font-bold py-2.5 rounded-xl transition-all duration-200"
              >
                Analyze Progress
              </button>
            </AnimatedCard>
          </AnimatedItem>

        </div>
      </div>
    </AnimatedContainer>
  );
}

export default Dashboard;