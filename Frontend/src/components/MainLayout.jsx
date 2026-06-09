import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AnimatedButton from "./AnimatedButton";

function MainLayout({ children }) {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await API.get("/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (error) {
        console.log("Failed to fetch user in layout", error);
      }
    };
    fetchUser();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/workout-plan", label: "Workout Plan", icon: "💪" },
    { path: "/diet-plan", label: "Diet Plan", icon: "🍎" },
    { path: "/fitness-chat", label: "Fitness Coach", icon: "🤖" },
    { path: "/progress", label: "Progress Tracker", icon: "📈" },
    { path: "/profile", label: "My Profile", icon: "👤" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} fixed lg:static z-50 h-full shadow-lg lg:shadow-none`}>
        <div>
          {/* Logo */}
          <div className="p-6 flex items-center justify-between border-b border-slate-200">
            <Link to="/dashboard" className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                FITFLOW
              </span>
            </Link>
            <button className="lg:hidden text-slate-500 hover:text-slate-900" onClick={() => setIsSidebarOpen(false)}>
              ✕
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 group ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 shadow-[0_4px_20px_rgba(16,185,129,0.15)] font-bold scale-[1.02] border border-emerald-100"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span className={`text-xl transition-transform duration-200 group-hover:scale-110 ${isActive ? "" : "opacity-80"}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          {user && (
            <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-white border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white text-lg shadow-inner">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.goal || "Fitness Enthusiast"}</p>
              </div>
            </div>
          )}
          <AnimatedButton
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-medium transition-colors duration-200 border border-red-100"
          >
            <span>🚪 Logout</span>
          </AnimatedButton>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <button
            className="lg:hidden text-slate-500 hover:text-slate-900 text-2xl mr-4"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>
          
          <div className="flex-1">
            <span className="text-slate-500 text-sm font-medium">Welcome back,</span>
            <h2 className="text-lg font-bold text-slate-900">{user?.name || "Fitness Partner"} 👋</h2>
          </div>

          <div className="flex items-center gap-6">
            {user && (
              <div className="hidden sm:flex items-center gap-4 text-sm border-l border-slate-200 pl-6">
                <div>
                  <span className="text-slate-500 text-xs block">Weight</span>
                  <span className="font-semibold text-slate-900">{user.weight || "--"} kg</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Height</span>
                  <span className="font-semibold text-slate-900">{user.height || "--"} cm</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Goal</span>
                  <span className="font-semibold text-emerald-600">{user.goal || "Not Set"}</span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Container */}
        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
