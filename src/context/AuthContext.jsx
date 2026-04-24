// @ts-nocheck


import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../api/axios";
import { getDashboardPathByRole } from "../utils/authRoutes";


const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem("hrflow_token");
        const userData = localStorage.getItem("hrflow_user");

        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch {
                // Corrupt data — clear it
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

            // Save token and user to localStorage for session persistence
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

    // ─── Update user (after profile edit) ──────────────────────────
    const updateUser = (updatedFields) => {
        const newUser = { ...user, ...updatedFields };
        setUser(newUser);
        localStorage.setItem("hrflow_user", JSON.stringify(newUser));
    };

    // ─── Role Helpers ─────────────────────────────────────────────
    const isAdmin = user?.role === "admin";
    const isEmployee = user?.role === "employee";

    // ─── Provide values to all children ──────────────────────────
    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            updateUser,
            isAdmin,
            isEmployee,
            isLoggedIn: !!user,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// Step 3: Custom hook for easy access
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};