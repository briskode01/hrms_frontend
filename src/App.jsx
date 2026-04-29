// @ts-nocheck

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import AppLayout from "./layout/AppLayout";
import Careers from "./pages/public/Careers";
import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import AppRoutes from "./routes/AppRoutes";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { getDashboardPathByRole } from "./utils/authRoutes";

// ─────────────────────────────────────────────────────────────
// App Shell (shown after login)
// ─────────────────────────────────────────────────────────────
function AppShell() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <AppRoutes activeTab={activeTab} setActiveTab={setActiveTab} />
    </AppLayout>
  );
}

// ─────────────────────────────────────────────────────────────
// Root App — shows Login if not logged in, AppShell if logged in
// ─────────────────────────────────────────────────────────────
console.log('Test')
function DashboardGate() {
  const { user } = useAuth();

  return <Navigate to={getDashboardPathByRole(user?.role)} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* Public careers page — no login required */}
          <Route path="/careers" element={<Careers />} />

          <Route
            path="/login"
            element={(
              <PublicRoute>
                <Login />
              </PublicRoute>
            )}
          />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />

          {/* Dashboard — redirects to role-specific shell */}
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <DashboardGate />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin/dashboard"
            element={(
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppShell />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/employee/dashboard"
            element={(
              <ProtectedRoute allowedRoles={["employee"]}>
                <AppShell />
              </ProtectedRoute>
            )}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: "12px", fontSize: "14px", fontWeight: 600 },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}