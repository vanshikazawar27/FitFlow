import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Invalid Credentials"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-[#0F172A] rounded-3xl overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.4)] border border-slate-800">
        
        {/* Left Side: Brand Promo (Vitalyze landing style) */}
        <div className="relative hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-emerald-950 via-[#0b0f19] to-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(163,230,53,0.15),transparent_45%)]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-3xl">⚡</span>
              <span className="font-black text-2xl tracking-widest text-[#A3E635]">FITFLOW</span>
            </div>
            
            <h1 className="text-5xl font-extrabold leading-tight text-white mt-12">
              STRONGER <br />
              <span className="bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">EVERY SINGLE DAY.</span>
            </h1>
            <p className="text-slate-400 mt-6 max-w-sm text-lg leading-relaxed">
              Unlock your true potential with hyper-personalized AI workouts, real-time diet planning, and active progress tracking.
            </p>
          </div>

          <div className="relative z-10 mt-8 pt-8 border-t border-slate-800 flex items-center gap-6">
            <div>
              <p className="text-3xl font-extrabold text-[#A3E635]">98%</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Success Rate</p>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div>
              <p className="text-3xl font-extrabold text-[#06B6D4]">150K+</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Happy Members</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-4xl font-extrabold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400 mb-8">Log in to your account to continue your fitness journey.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  onChange={handleChange}
                  className="w-full bg-[#1E293B] border border-slate-700 focus:border-[#A3E635] text-white px-4 py-3.5 rounded-xl outline-none transition-all duration-200 placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full bg-[#1E293B] border border-slate-700 focus:border-[#A3E635] text-white px-4 py-3.5 rounded-xl outline-none transition-all duration-200 placeholder-slate-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#A3E635] hover:bg-[#bbf055] text-slate-950 font-bold py-4 rounded-xl shadow-[0_4px_20px_rgba(163,230,53,0.25)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] mt-4"
              >
                Sign In
              </button>

              <p className="mt-8 text-center text-slate-400 text-sm">
                Don't have an account yet?{" "}
                <Link
                  to="/signup"
                  className="text-[#A3E635] hover:underline font-semibold"
                >
                  Create account
                </Link>
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;