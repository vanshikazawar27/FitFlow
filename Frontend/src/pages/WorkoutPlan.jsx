import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function WorkoutPlan() {
  const [workoutPlan, setWorkoutPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
    } catch (error) {
      console.log(error);
      alert("Failed to generate workout plan");
    } finally {
      setLoading(false);
    }
  };

  const formatPlanText = (text) => {
    if (!text) return null;
    const rawLines = text.split("\n");

    // Remove Note/Disclaimer sections entirely
    let inSkipBlock = false;
    const lines = rawLines.filter((line) => {
      const t = line.trim().toLowerCase();
      if (/^#+\s*(note|disclaimer|important note|please note)/.test(t) || /^\*\*(note|disclaimer)/.test(t)) {
        inSkipBlock = true;
        return false;
      }
      if (inSkipBlock) {
        // Stop skipping when next heading starts
        if (/^#+\s/.test(line.trim()) && !/^#+\s*(note|disclaimer)/i.test(line.trim())) {
          inSkipBlock = false;
          return true;
        }
        return false;
      }
      return true;
    });
    return (
      <div className="space-y-2 text-slate-700 font-sans leading-relaxed text-sm">
        {lines.map((line, idx) => {
          let cleanLine = line.trim();
          
          if (cleanLine.startsWith("###")) {
            return <h5 key={idx} className="text-emerald-600 font-bold text-base mt-4 mb-2">{cleanLine.replace(/^###\s*/, "")}</h5>;
          }
          if (cleanLine.startsWith("##")) {
            return <h4 key={idx} className="text-cyan-600 font-bold text-lg mt-5 mb-3">{cleanLine.replace(/^##\s*/, "")}</h4>;
          }
          if (cleanLine.startsWith("#")) {
            return <h3 key={idx} className="text-slate-900 font-extrabold text-xl mt-6 mb-4">{cleanLine.replace(/^#\s*/, "")}</h3>;
          }
          
          const isBullet = /^(?:\*|\-)\s+/.test(cleanLine);
          if (isBullet) {
            cleanLine = cleanLine.replace(/^(?:\*|\-)\s+/, "");
          }
          
          const parts = cleanLine.split(/\*\*([^*]+)\*\*/g);
          const renderedText = parts.map((part, i) => {
            if (i % 2 === 1) {
              return <strong key={i} className="text-slate-900 font-bold">{part}</strong>;
            }
            return part;
          });
          
          if (isBullet) {
            return (
              <div key={idx} className="flex items-start gap-3 pl-4 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>{renderedText}</span>
              </div>
            );
          }
          
          return cleanLine ? <p key={idx} className="py-0.5">{renderedText}</p> : <div key={idx} className="h-3" />;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.4s_ease-out]">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900">AI Workout Generator 💪</h1>
          <p className="text-slate-500 mt-1">Receive custom body configurations generated using expert trainer frameworks.</p>
        </div>
        
        <button
          onClick={() => navigate("/workout-history")}
          className="bg-white hover:bg-slate-200 text-slate-900 border border-slate-300 hover:border-[#A3E635] px-5 py-2.5 rounded-xl font-bold transition-all text-sm shadow-md"
        >
          View Workout History 📚
        </button>
      </div>

      {/* Control Dashboard Card */}
      <div className="bg-white border border-slate-200 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-xl">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Build Your Next Routine</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Our AI analyzes your experience level, targets, and days-per-week frequency profile parameters. Click below to generate your personalized workouts instantly.
          </p>
        </div>

        <button
          onClick={generateWorkoutPlan}
          disabled={loading}
          className="relative z-10 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-500 text-slate-950 font-extrabold px-8 py-4 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Workout Plan"
          )}
        </button>
      </div>

      {/* Results Rendering Card */}
      {workoutPlan && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 animate-[fadeIn_0.3s_ease-out]">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span>📋</span> Latest Generated Workout Routine
          </h3>
          
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            {formatPlanText(workoutPlan)}
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkoutPlan;