import { useEffect, useState } from "react";
import API from "../services/api";
import { cleanAndFormatHistoryText } from "./HistoryPlanFormatter.jsx";

function WorkoutHistory() {
  const [plans, setPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        "/ai/workout-plans",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPlans(res.data);
      if (res.data.length > 0) {
        setExpandedPlan(res.data[0]._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPlans = plans.filter((plan) =>
    plan.plan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderers = {
    renderHeading: (level, idx, cleanLine) => {
      const text = cleanLine.replace(new RegExp(`^${level}\\s*`), "");

      if (level === "###") {
        return (
          <h5 key={idx} className="text-[#A3E635] font-bold text-base mt-4 mb-2">
            {text}
          </h5>
        );
      }
      if (level === "##") {
        return (
          <h4 key={idx} className="text-[#06B6D4] font-bold text-lg mt-5 mb-3">
            {text}
          </h4>
        );
      }
      return (
        <h3 key={idx} className="text-white font-extrabold text-xl mt-6 mb-4">
          {text}
        </h3>
      );
    },
    renderBullet: (idx, renderedText) => (
      <div key={idx} className="flex items-start gap-2.5 pl-4 py-1.5">
        <span className="text-[#A3E635] text-xs mt-1">⚡</span>
        <span>{renderedText}</span>
      </div>
    ),
    renderParagraph: (idx, renderedText) => (
      <p key={idx} className="py-0.5">
        {renderedText}
      </p>
    ),
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.4s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white">Workout History 📚</h1>
          <p className="text-slate-400 mt-1">
            Access and copy your previously generated AI exercise routines.
          </p>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search routines (e.g. chest, intermediate)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#0F172A] border border-slate-800 focus:border-[#A3E635] text-white px-4 py-2.5 rounded-xl outline-none text-sm w-full md:w-80 transition-all placeholder-slate-600"
        />
      </div>

      {filteredPlans.length === 0 ? (
        <div className="bg-[#0F172A]/30 border border-slate-800/80 p-12 rounded-3xl text-center text-slate-500 text-sm flex flex-col items-center justify-center gap-3">
          <span className="text-3xl">🏋️‍♂️</span>
          <p className="font-semibold text-slate-400">No matching routines found</p>
          <p className="text-xs text-slate-500 max-w-xs mt-1">
            Try refining your search keyword or generate a new workout plan from
            the generator dashboard.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPlans.map((plan, index) => {
            const isExpanded = expandedPlan === plan._id;

            return (
              <div
                key={plan._id}
                className={`border transition-all duration-200 rounded-2xl overflow-hidden ${
                  isExpanded
                    ? "bg-[#0F172A] border-slate-700 shadow-lg"
                    : "bg-[#0F172A]/50 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div
                  onClick={() => setExpandedPlan(isExpanded ? null : plan._id)}
                  className="p-5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-900/20"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-[#A3E635]">
                      #{filteredPlans.length - index}
                    </span>
                    <div>
                      <h4 className="text-white font-bold text-base">Workout Session Routine</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        📅 {new Date(plan.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(plan._id, plan.plan);
                      }}
                      className="bg-[#1E293B] hover:bg-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 hover:border-[#A3E635] text-slate-300 transition-colors"
                    >
                      {copiedId === plan._id ? "Copied! ✓" : "Copy"}
                    </button>
                    <span
                      className={`text-slate-400 transition-transform duration-200 text-lg ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-6 border-t border-slate-850 bg-[#0B0F19]/90 animate-[slideDown_0.2s_ease-out]">
                    {cleanAndFormatHistoryText(plan.plan, renderers)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WorkoutHistory;

