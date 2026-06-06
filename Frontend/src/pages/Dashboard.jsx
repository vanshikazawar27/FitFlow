import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import DownloadReport from "../components/DownloadReport";

import {
  calculateBMI,
  getBMIStatus,
} from "../utils/calculateBMI";

function Dashboard() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  const bmi = calculateBMI(
    user.weight,
    user.height
  );

  const status = getBMIStatus(Number(bmi));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          FitFlow Dashboard 💪
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* BMI Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-2">
            BMI
          </h2>

          <p className="text-4xl font-bold text-blue-600">
            {bmi}
          </p>

          <p className="mt-2 text-gray-600">
            {status}
          </p>
        </div>

        {/* Goal Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-2">
            Fitness Goal
          </h2>

          <p className="text-lg">
            {user.goal}
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-2">
            Profile
          </h2>

          <p>Age: {user.age}</p>
          <p>Gender: {user.gender}</p>
        </div>

        {/* Weight Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-2">
            Weight
          </h2>

          <p className="text-3xl font-bold">
            {user.weight} kg
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
  <h2 className="text-xl font-bold mb-2">
    Goal Weight
  </h2>

  <p className="text-3xl font-bold text-green-600">
    {user.goalWeight || "Not Set"} kg
  </p>
</div>

        {/* Height Card */}
<div className="bg-white rounded-xl shadow p-6">
  <h2 className="text-xl font-bold mb-2">
    Height
  </h2>

  <p className="text-3xl font-bold">
    {user.height} cm
  </p>
</div>

{/* Experience Card */}
<div className="bg-white rounded-xl shadow p-6">
  <h2 className="text-xl font-bold mb-2">
    Experience
  </h2>

  <p className="text-lg">
    {user.experience || "Not Set"}
  </p>
</div>

{/* Workout Days Card */}
<div className="bg-white rounded-xl shadow p-6">
  <h2 className="text-xl font-bold mb-2">
    Workout Days
  </h2>

  <p className="text-3xl font-bold">
    {user.daysPerWeek || 0}
  </p>
</div>

{/* Welcome Card */}
<div className="bg-white rounded-xl shadow p-6">
  <h2 className="text-xl font-bold mb-2">
    Welcome
  </h2>

  <p className="text-lg">
    {user.name}
  </p>
</div>

<div className="mt-8 flex flex-wrap gap-4">
  <button
    onClick={() =>
      navigate("/workout-plan")
    }
    className="bg-green-600 text-white px-6 py-3 rounded-lg"
  >
    Generate AI Workout Plan
  </button>


<button
  onClick={() =>
    navigate("/diet-plan")
  }
  className="bg-yellow-600 text-white px-6 py-3 rounded-lg ml-4"
>
  AI Diet Planner 🍎
</button>
</div> 

<div className="mt-8 flex flex-wrap gap-4">

  <button
    onClick={() =>
      navigate("/fitness-chat")
    }
    className="bg-purple-600 text-white px-6 py-3 rounded-lg"
  >
    AI Fitness Coach 🤖
  </button>

  <button
    onClick={() =>
      navigate("/progress")
    }
    className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
  >
    Progress Tracker 📈
  </button>

  {/* <Link to="/progress-photos">
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">
    <h2 className="text-xl font-bold">
      Progress Photos 📸
    </h2>

    <p className="text-gray-500">
      Track your transformation journey
    </p>
  </div>
</Link> */}

  <DownloadReport />

</div>

      </div>
    </div>
  );
}



export default Dashboard;