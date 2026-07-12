import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AdminLayout from "./components/AdminLayout";
import Layout from "./components/Layout";

// Public Pages
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminQuizzes from "./pages/admin/AdminQuizzes";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminResults from "./pages/admin/AdminResults";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import AdminSubmissionEdit from "./pages/admin/AdminSubmissionEdit";
import AdminSettings from "./pages/admin/AdminSettings"; 
import AdminRoute from "./components/AdminRoute";

import { QuizContextProvider } from "./store/QuizContext";
import { AuthProvider } from "./store/AuthContext";

function App() {
  return (
    <QuizContextProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ---------- PUBLIC SITE ---------- */}
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/quiz/:quizId" element={<QuizPage />} />
              <Route path="/results/:quizId" element={<ResultsPage />} />
            </Route>

            {/* ---------- ADMIN PANEL ---------- */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="quizzes" element={<AdminQuizzes />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="results" element={<AdminResults />} />
                <Route path="submissions" element={<AdminSubmissions />} />
                <Route path="submissions/:id" element={<AdminSubmissionEdit />} />
                <Route path="settings" element={<AdminSettings />} /> 
              </Route>
            </Route>
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QuizContextProvider>
  );
}

export default App;
