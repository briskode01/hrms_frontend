// @ts-nocheck

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../api/axios";
import { getDashboardPathByRole } from "../utils/authRoutes";
import { hasPermission, isAdminRole, ADMIN_ROLES } from "../utils/permissions";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token    = localStorage.getItem("hrflow_token");
        const userData = localStorage.getItem("hrflow_user");

        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch {
                localStorage.removeItem("hrflow_token");
                localStorage.removeItem("hrflow_user");
            }
        }
        setLoading(false);
    }, []);

    // ─── Login ────────────────────────────────────────────────────
    const login = async (email, password, selectedRole) => {
        try {
            const { data } = await API.post("/auth/login", { email, password, role: selectedRole });
            localStorage.setItem("hrflow_token", data.token);
            localStorage.setItem("hrflow_user", JSON.stringify(data.user));
            setUser(data.user);
            toast.success(data.message || "Login successful! 👋");
            return {
                success: true,
                redirectPath: getDashboardPathByRole(data?.user?.role),
            };
        } catch (error) {
            const message = error.response?.data?.message || "Login failed";
            toast.error(message);
            return { success: false, message };
        }
    };

    // ─── Logout ───────────────────────────────────────────────────
    const logout = () => {
        localStorage.removeItem("hrflow_token");
        localStorage.removeItem("hrflow_user");
        setUser(null);
        toast.success("Logged out successfully");
    };

    // ─── Update user (after profile edit) ────────────────────────
    const updateUser = (updatedFields) => {
        const newUser = { ...user, ...updatedFields };
        setUser(newUser);
        localStorage.setItem("hrflow_user", JSON.stringify(newUser));
    };

    // ─── Role Helpers ─────────────────────────────────────────────
    const role = user?.role;

    /** True for ANY admin-type role (all non-employee roles) */
    const isAnyAdmin     = isAdminRole(role);
    const isSuperAdmin   = role === "super_admin";
    const isHRAdmin      = role === "hr_admin";
    const isManager      = role === "manager";
    const isFinanceAdmin = role === "finance_admin";
    const isEmployee     = role === "employee";

    /** Check a specific permission string against the current user's role */
    const checkPermission = (permission) => hasPermission(role, permission);

    // Legacy: kept for backward compat with existing components
    const isAdmin = isAnyAdmin;

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            updateUser,
            // Role booleans
            isAdmin,        // legacy — any admin role
            isAnyAdmin,
            isSuperAdmin,
            isHRAdmin,
            isManager,
            isFinanceAdmin,
            isEmployee,
            isLoggedIn: !!user,
            // Permission check helper
            hasPermission: checkPermission,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
};