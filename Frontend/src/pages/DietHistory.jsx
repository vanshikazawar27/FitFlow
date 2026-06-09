import { useEffect, useState } from "react";
import API from "../services/api";
import { cleanAndFormatHistoryText } from "./HistoryPlanFormatter.jsx";

function DietHistory() {
  const [plans, setPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        "/diet/history",
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
          <h5 key={idx} className="text-emerald-600 font-bold text-base mt-4 mb-2">
            {text}
          </h5>
        );
      }
      if (level === "##") {
        return (
          <h4 key={idx} className="text-cyan-600 font-bold text-lg mt-5 mb-3">
            {text}
          </h4>
        );
      }
      return (
        <h3 key={idx} className="text-slate-900 font-extrabold text-xl mt-6 mb-4">
          {text}
        </h3>
      );
    },
    renderBullet: (idx, renderedText) => (
      <div key={idx} className="flex items-start gap-3 pl-4 py-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900">Diet History 🍎</h1>
          <p className="text-slate-500 mt-1">Review previously generated custom meal matrices.</p>
        </div>

        <input
          type="text"
          placeholder="Search diet plans (e.g. vegan, budget)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white border border-slate-200 focus:border-[#A3E635] text-slate-900 px-4 py-2.5 rounded-xl outline-none text-sm w-full md:w-80 transition-all placeholder-slate-400"
        />
      </div>

      {filteredPlans.length === 0 ? (
        <div className="bg-white border border-slate-200/80 p-12 rounded-3xl text-center text-slate-500 text-sm flex flex-col items-center justify-center gap-3">
          <span className="text-3xl">🥗</span>
          <p className="font-semibold text-slate-500">No matching diet plans found</p>
          <p className="text-xs text-slate-500 max-w-xs mt-1">
            Refine your search keywords or generate a new diet configuration from the dashboard generator.
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
                    ? "bg-white border-slate-300 shadow-lg"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  onClick={() => setExpandedPlan(isExpanded ? null : plan._id)}
                  className="p-5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100/20"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center font-bold text-emerald-600">
                      #{filteredPlans.length - index}
                    </span>
                    <div>
                      <h4 className="text-slate-900 font-bold text-base">Custom Meal Plan Matrix</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
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
                      className="bg-white hover:bg-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 hover:border-[#A3E635] text-slate-700 transition-colors"
                    >
                      {copiedId === plan._id ? "Copied! ✓" : "Copy"}
                    </button>
                    <span
                      className={`text-slate-500 transition-transform duration-200 text-lg ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-6 border-t border-slate-200 bg-slate-50 animate-[slideDown_0.2s_ease-out]">
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

export default DietHistory;

