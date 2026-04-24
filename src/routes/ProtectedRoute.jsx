// @ts-nocheck
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardPathByRole } from "../utils/authRoutes";

function LoadingScreen() {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-slate-400 text-sm font-medium">Loading HRFlow...</p>
            </div>
        </div>
    );
}

export default function ProtectedRoute({ allowedRoles, children }) {
    const { isLoggedIn, loading, user } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
        return <Navigate to={getDashboardPathByRole(user?.role)} replace />;
    }

    return children;
}
