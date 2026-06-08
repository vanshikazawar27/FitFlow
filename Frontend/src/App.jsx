import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from "./pages/Profile";
import WorkoutPlan from "./pages/WorkoutPlan";
import DietPlan from "./pages/DietPlan";
import FitnessChat from "./pages/FitnessChat";
import Progress from "./pages/Progress";
import WorkoutHistory from "./pages/WorkoutHistory";
import DietHistory from "./pages/DietHistory";
import MainLayout from "./components/MainLayout";

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
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
         path="/profile"
         element={
         <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
         </ProtectedRoute>
         }
       />
       <Route
          path="/workout-plan"
          element={
            <ProtectedRoute>
              <MainLayout>
                <WorkoutPlan />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
        path="/diet-plan"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DietPlan />
            </MainLayout>
          </ProtectedRoute>
        }
        />
        <Route
        path="/fitness-chat"
        element={
          <ProtectedRoute>
            <MainLayout>
              <FitnessChat />
            </MainLayout>
          </ProtectedRoute>
        }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Progress />
              </MainLayout>
            </ProtectedRoute>
          }
         />
         <Route
          path="/workout-history"
          element={
            <ProtectedRoute>
              <MainLayout>
                <WorkoutHistory />
              </MainLayout>
            </ProtectedRoute>
          }
          />
          <Route
           path="/diet-history"
           element={
             <ProtectedRoute>
               <MainLayout>
                 <DietHistory />
               </MainLayout>
             </ProtectedRoute>
           }
          />
    </Routes>
    
    
    
  );
}

export default App;