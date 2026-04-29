// @ts-nocheck
// client/src/components/settings/UserManagement.jsx
// ─────────────────────────────────────────────────────────────
// Admin user management — view all users, toggle active status
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

const ROLE_STYLES = {
    admin: "bg-rose-100 text-rose-700",
    hr: "bg-blue-100 text-blue-700",
    employee: "bg-emerald-100 text-emerald-700",
};

const AVATAR_COLORS = [
    "bg-blue-500", "bg-violet-500", "bg-emerald-500",
    "bg-amber-500", "bg-pink-500", "bg-cyan-500", "bg-rose-500",
];
const getAvatarColor = (name = "") =>
    AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(null); // user ID being toggled

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/auth/users");
            setUsers(data.data || []);
        } catch {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleToggle = async (userId, userName, isActive) => {
        const action = isActive ? "Deactivate" : "Activate";
        if (!window.confirm(`${action} user "${userName}"?`)) return;
        try {
            setToggling(userId);
            await API.put(`/auth/users/${userId}/toggle-status`);
            toast.success(`${userName} ${isActive ? "deactivated" : "activated"} ✅`);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${action.toLowerCase()} user`);
        } finally {
            setToggling(null);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-lg">👥</span>
                    User Management
                </h3>
                <p className="text-xs text-slate-400 mt-1 ml-10">Manage system users and their access</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16 text-slate-400">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mr-3" />
                    <p className="text-sm font-medium">Loading users...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <div className="text-4xl mb-3 opacity-60">👥</div>
                    <p className="text-sm font-medium">No users found</p>
                </div>
            ) : (
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            {["User", "Role", "Status", "Last Login", "Actions"].map((h) => (
                                <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {users.map((u) => (
                            <tr key={u._id} className="hover:bg-blue-50/40 transition-colors duration-150 group">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full ${getAvatarColor(u.name)} text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                            {u.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{u.name}</p>
                                            <p className="text-xs text-slate-400">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize ${ROLE_STYLES[u.role] || "bg-slate-100 text-slate-600"}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                                        {u.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-xs text-slate-500">
                                    {u.lastLogin
                                        ? new Date(u.lastLogin).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                                        : "Never"}
                                </td>
                                <td className="px-5 py-4">
                                    <button
                                        onClick={() => handleToggle(u._id, u.name, u.isActive)}
                                        disabled={toggling === u._id}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${u.isActive
                                                ? "bg-red-50 hover:bg-red-100 text-red-600"
                                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                                            } ${toggling === u._id ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        {toggling === u._id ? "..." : u.isActive ? "Deactivate" : "Activate"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
