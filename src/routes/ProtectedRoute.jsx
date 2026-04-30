// @ts-nocheck
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardPathByRole } from "../utils/authRoutes";
import { isAdminRole } from "../utils/permissions";

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

/**
 * allowedRoles: explicit list of role strings, OR the special strings
 *   "admin"    → any admin-type role (super_admin, hr_admin, manager, finance_admin, admin)
 *   "employee" → employee role only
 */
export default function ProtectedRoute({ allowedRoles, children }) {
    const { isLoggedIn, loading, user } = useAuth();

    if (loading) return <LoadingScreen />;
    if (!isLoggedIn) return <Navigate to="/login" replace />;

    if (allowedRoles?.length) {
        const role = user?.role;
        // Expand the "admin" shorthand to all admin-type roles
        const expandedRoles = allowedRoles.flatMap((r) =>
            r === "admin"
                ? ["super_admin", "hr_admin", "manager", "finance_admin", "admin", "hr"]
                : [r]
        );
        if (!expandedRoles.includes(role)) {
            return <Navigate to={getDashboardPathByRole(role)} replace />;
        }
    }

    return children;
}
