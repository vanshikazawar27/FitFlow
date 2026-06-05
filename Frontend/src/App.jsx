import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from "./pages/Profile";
import WorkoutPlan from "./pages/WorkoutPlan";
import DietPlan from "./pages/DietPlan";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
         path="/profile"
         element={
         <ProtectedRoute>
            <Profile />
         </ProtectedRoute>
         }
       />
       <Route
          path="/workout-plan"
          element={<WorkoutPlan />}
        />
        <Route
        path="/diet-plan"
        element={<DietPlan />}
/>
    </Routes>
    
    
    
  );
}

export default App;