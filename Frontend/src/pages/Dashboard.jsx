import { useEffect, useState } from "react";
import API from "../services/api";

import {
  calculateBMI,
  getBMIStatus,
} from "../utils/calculateBMI";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const res = await API.get(
          "/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  if (!user)
    return <h1>Loading...</h1>;

  const bmi = calculateBMI(
    user.weight,
    user.height
  );

  const status = getBMIStatus(bmi);

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        FitFlow Dashboard 💪
      </h1>

      <div className="grid grid-cols-2 gap-5">
        <div className="border p-5 rounded">
          <h2 className="text-xl font-bold">
            Weight
          </h2>

          <p>{user.weight} kg</p>
        </div>

        <div className="border p-5 rounded">
          <h2 className="text-xl font-bold">
            Height
          </h2>

          <p>{user.height} cm</p>
        </div>

        <div className="border p-5 rounded">
          <h2 className="text-xl font-bold">
            BMI
          </h2>

          <p>{bmi}</p>
        </div>

        <div className="border p-5 rounded">
          <h2 className="text-xl font-bold">
            Status
          </h2>

          <p>{status}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;