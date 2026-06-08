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
    const lines = text.split("\n");
    return (
      <div className="space-y-2 text-slate-300 font-sans leading-relaxed text-sm">
        {lines.map((line, idx) => {
          let cleanLine = line.trim();
          
          if (cleanLine.startsWith("###")) {
            return <h5 key={idx} className="text-[#A3E635] font-bold text-base mt-4 mb-2">{cleanLine.replace(/^###\s*/, "")}</h5>;
          }
          if (cleanLine.startsWith("##")) {
            return <h4 key={idx} className="text-[#06B6D4] font-bold text-lg mt-5 mb-3">{cleanLine.replace(/^##\s*/, "")}</h4>;
          }
          if (cleanLine.startsWith("#")) {
            return <h3 key={idx} className="text-white font-extrabold text-xl mt-6 mb-4">{cleanLine.replace(/^#\s*/, "")}</h3>;
          }
          
          const isBullet = cleanLine.startsWith("*") || cleanLine.startsWith("-");
          if (isBullet) {
            cleanLine = cleanLine.replace(/^[\*\-]\s*/, "");
          }
          
          const parts = cleanLine.split(/\*\*([^*]+)\*\*/g);
          const renderedText = parts.map((part, i) => {
            if (i % 2 === 1) {
              return <strong key={i} className="text-white font-bold">{part}</strong>;
            }
            return part;
          });
          
          if (isBullet) {
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-4 py-1.5">
                <span className="text-[#A3E635] text-xs mt-1">⚡</span>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white">AI Diet Planner 🍎</h1>
          <p className="text-slate-400 mt-1">Configure your food selections, set target parameters, and receive custom menus.</p>
        </div>
        
        <button
          onClick={() => navigate("/diet-history")}
          className="bg-[#1E293B] hover:bg-slate-800 text-white border border-slate-700 hover:border-[#A3E635] px-5 py-2.5 rounded-xl font-bold transition-all text-sm shadow-md"
        >
          View Diet History 📚
        </button>
      </div>

      {/* Main Form Dashboard */}
      <div className="grid md:grid-cols-3 gap-8 items-start">
        
        {/* Configurations Column */}
        <div className="bg-[#0F172A]/80 border border-slate-800 p-6 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold text-white mb-2">Configure Parameters</h3>
          
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">Diet Type</label>
            <select
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              className="w-full bg-[#1E293B] border border-slate-700 focus:border-[#A3E635] text-white px-4 py-3 rounded-xl outline-none transition-all duration-200 cursor-pointer"
            >
              <option value="">Select Diet</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">Monthly Budget</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="₹3000"
              className="w-full bg-[#1E293B] border border-slate-700 focus:border-[#A3E635] text-white px-4 py-3.5 rounded-xl outline-none transition-all duration-200 placeholder-slate-600 text-sm"
            />
          </div>

          <button
            onClick={generateDietPlan}
            disabled={loading}
            className="w-full bg-[#A3E635] hover:bg-[#bbf055] disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold py-3.5 rounded-xl shadow-[0_4px_20px_rgba(163,230,53,0.25)] transition-all duration-200 flex items-center justify-center gap-2"
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
            <div className="bg-[#0F172A]/40 border border-slate-800 rounded-3xl p-6 md:p-8 animate-[fadeIn_0.3s_ease-out]">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🥗</span> Custom Meal Matrix
              </h3>
              
              <div className="bg-[#0B0F19] border border-slate-850 p-6 rounded-2xl">
                {formatPlanText(dietPlan)}
              </div>
            </div>
          ) : (
            <div className="bg-[#0F172A]/20 border border-slate-800/50 border-dashed rounded-3xl p-12 text-center text-slate-500 h-full flex flex-col items-center justify-center gap-2">
              <span className="text-4xl block mb-2">🍽️</span>
              <p className="font-semibold text-slate-400">No Diet Plan Active</p>
              <p className="text-xs max-w-xs leading-relaxed mt-1">Configure your choices in the left parameters box and execute calculations to view schedules.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default DietPlan;