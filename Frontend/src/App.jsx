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
import { AnimatePresence } from "framer-motion";
import AnimatedPage from "./components/AnimatedPage";

function App() {
  return (
    <AnimatePresence mode="wait"><Routes>
      <Route
        path="/"
        element={<Navigate to="/login" />}
      />

      <Route
        path="/signup"
        element={<AnimatedPage><Signup /></AnimatedPage>}
      />

      <Route
        path="/login"
        element={<AnimatedPage><Login /></AnimatedPage>}
      />

      <Route
        path="/dashboard"
        element={
            <ProtectedRoute>
              <MainLayout>
                <AnimatedPage><Dashboard /></AnimatedPage>
              </MainLayout>
            </ProtectedRoute>
          }
      />
      <Route
         path="/profile"
         element={
          <ProtectedRoute>
             <MainLayout>
               <AnimatedPage><Profile /></AnimatedPage>
             </MainLayout>
          </ProtectedRoute>
          }
       />
       <Route
          path="/workout-plan"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AnimatedPage><WorkoutPlan /></AnimatedPage>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
        path="/diet-plan"
        element={
            <ProtectedRoute>
              <MainLayout>
                <AnimatedPage><DietPlan /></AnimatedPage>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
        path="/fitness-chat"
        element={
            <ProtectedRoute>
              <MainLayout>
                <AnimatedPage><FitnessChat /></AnimatedPage>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AnimatedPage><Progress /></AnimatedPage>
              </MainLayout>
            </ProtectedRoute>
          }
         />
         <Route
          path="/workout-history"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AnimatedPage><WorkoutHistory /></AnimatedPage>
              </MainLayout>
            </ProtectedRoute>
          }
          />
          <Route
           path="/diet-history"
           element={
              <ProtectedRoute>
                <MainLayout>
                  <AnimatedPage><DietHistory /></AnimatedPage>
                </MainLayout>
              </ProtectedRoute>
            }
          />
    </Routes></AnimatePresence>
    
    
    
  );
}

export default App;