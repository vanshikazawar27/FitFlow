import { useState, useEffect } from "react";
import API from "../services/api";

function Profile() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    goalWeight: "",
    experience: "",
    daysPerWeek: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await API.get("/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data) {
          setFormData({
            age: res.data.age || "",
            gender: res.data.gender || "",
            height: res.data.height || "",
            weight: res.data.weight || "",
            goal: res.data.goal || "",
            goalWeight: res.data.goalWeight || "",
            experience: res.data.experience || "",
            daysPerWeek: res.data.daysPerWeek || "",
          });
        }
      } catch (err) {
        console.log("Failed to load user profile in editing form", err);
      }
    };
    fetchCurrentProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await API.put(
        "/user/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile Updated Successfully!");
    } catch (error) {
      console.log(error);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-[fadeIn_0.4s_ease-out]">
      {/* Title Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-4xl font-extrabold text-slate-900 font-sans">Complete Your Profile 👤</h1>
        <p className="text-slate-500 mt-1">Fine-tune your anatomical and scheduling constraints to optimize AI generations.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xl space-y-8">
        
        {/* Anatomical Parameters Group */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-2 border-[#A3E635] pl-3">Anatomical Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2">Age (years)</label>
              <input
                type="number"
                name="age"
                placeholder="e.g. 26"
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 focus:border-[#A3E635] text-slate-900 px-4 py-3 rounded-xl outline-none transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 focus:border-[#A3E635] text-slate-900 px-4 py-3.5 rounded-xl outline-none transition-all duration-200 cursor-pointer"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2">Height (cm)</label>
              <input
                type="number"
                name="height"
                placeholder="e.g. 175"
                value={formData.height}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 focus:border-[#A3E635] text-slate-900 px-4 py-3 rounded-xl outline-none transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2">Current Weight (kg)</label>
              <input
                type="number"
                name="weight"
                placeholder="e.g. 74"
                value={formData.weight}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 focus:border-[#A3E635] text-slate-900 px-4 py-3 rounded-xl outline-none transition-all duration-200"
                required
              />
            </div>
          </div>
        </div>

        {/* Goals & Schedules Group */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-2 border-[#06B6D4] pl-3">Goals & Routines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2">Target Goal</label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 focus:border-[#A3E635] text-slate-900 px-4 py-3.5 rounded-xl outline-none transition-all duration-200 cursor-pointer"
                required
              >
                <option value="">Select Goal</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Maintain Weight">Maintain Weight</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2">Target Weight (kg)</label>
              <input
                type="number"
                name="goalWeight"
                placeholder="e.g. 68"
                value={formData.goalWeight}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 focus:border-[#A3E635] text-slate-900 px-4 py-3 rounded-xl outline-none transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2">Experience level</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 focus:border-[#A3E635] text-slate-900 px-4 py-3.5 rounded-xl outline-none transition-all duration-200 cursor-pointer"
                required
              >
                <option value="">Select Experience</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2">Workout Days Per Week</label>
              <input
                type="number"
                name="daysPerWeek"
                placeholder="e.g. 4"
                value={formData.daysPerWeek}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 focus:border-[#A3E635] text-slate-900 px-4 py-3 rounded-xl outline-none transition-all duration-200"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold py-4 rounded-xl shadow-[0_4px_20px_rgba(163,230,53,0.25)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              Saving Profile...
            </>
          ) : (
            "Save Profile Configuration"
          )}
        </button>

      </form>
    </div>
  );
}

export default Profile;