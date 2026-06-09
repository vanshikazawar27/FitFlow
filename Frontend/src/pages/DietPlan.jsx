import { useState } from "react";
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900">AI Diet Planner 🍎</h1>
          <p className="text-slate-500 mt-1">Configure your food selections, set target parameters, and receive custom menus.</p>
        </div>
        
        <button
          onClick={() => navigate("/diet-history")}
          className="bg-white hover:bg-slate-200 text-slate-900 border border-slate-300 hover:border-[#A3E635] px-5 py-2.5 rounded-xl font-bold transition-all text-sm shadow-md"
        >
          View Diet History 📚
        </button>
      </div>

      {/* Main Form Dashboard */}
      <div className="grid md:grid-cols-3 gap-8 items-start">
        
        {/* Configurations Column */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Configure Parameters</h3>
          
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-2">Diet Type</label>
            <select
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:border-[#A3E635] text-slate-900 px-4 py-3 rounded-xl outline-none transition-all duration-200 cursor-pointer"
            >
              <option value="">Select Diet</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-2">Monthly Budget</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="₹3000"
              className="w-full bg-white border border-slate-300 focus:border-[#A3E635] text-slate-900 px-4 py-3.5 rounded-xl outline-none transition-all duration-200 placeholder-slate-400 text-sm"
            />
          </div>

          <button
            onClick={generateDietPlan}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-500 text-slate-950 font-bold py-3.5 rounded-xl shadow-[0_4px_20px_rgba(163,230,53,0.25)] transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Planning...
              </>
            ) : (
              "Generate Diet Plan"
            )}
          </button>
        </div>

        {/* Results Viewer Column */}
        <div className="md:col-span-2 space-y-6">
          {dietPlan ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 animate-[fadeIn_0.3s_ease-out]">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span>🥗</span> Custom Meal Matrix
              </h3>
              
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                {formatPlanText(dietPlan)}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/50 border-dashed rounded-3xl p-12 text-center text-slate-500 h-full flex flex-col items-center justify-center gap-2">
              <span className="text-4xl block mb-2">🍽️</span>
              <p className="font-semibold text-slate-500">No Diet Plan Active</p>
              <p className="text-xs max-w-xs leading-relaxed mt-1">Configure your choices in the left parameters box and execute calculations to view schedules.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default DietPlan;