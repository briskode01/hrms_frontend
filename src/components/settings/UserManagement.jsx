// @ts-nocheck
// components/settings/UserManagement.jsx
// ─────────────────────────────────────────────────────────────
// Super Admin user management:
//   - View all users with their role badges
//   - Create a new admin-type user
//   - Change any user's role (super_admin only)
//   - Toggle active / deactivate
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { ROLE_LABELS } from "../../utils/permissions";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ── Pagination Config ─────────────────────────────────────────
const ITEMS_PER_PAGE = 5;

// ── Role badge colours ────────────────────────────────────────
const ROLE_STYLES = {
    super_admin:  "bg-rose-100 text-rose-700 border border-rose-200",
    hr_admin:     "bg-blue-100 text-blue-700 border border-blue-200",
    manager:      "bg-amber-100 text-amber-700 border border-amber-200",
    finance_admin:"bg-violet-100 text-violet-700 border border-violet-200",
    employee:     "bg-emerald-100 text-emerald-700 border border-emerald-200",
    admin:        "bg-rose-100 text-rose-700 border border-rose-200",   // legacy
    hr:           "bg-blue-100 text-blue-700 border border-blue-200",   // legacy
};

const AVATAR_COLORS = [
    "bg-blue-500", "bg-violet-500", "bg-emerald-500",
    "bg-amber-500", "bg-pink-500", "bg-cyan-500", "bg-rose-500",
];
const getAvatarColor = (name = "") =>
    AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

// All assignable roles for the dropdown
const ASSIGNABLE_ROLES = [
    { value: "super_admin",   label: "Super Admin" },
    { value: "hr_admin",      label: "HR Admin" },
    { value: "manager",       label: "Manager" },
    { value: "finance_admin", label: "Finance Admin" },
    { value: "employee",      label: "Employee" },
];

// ── Main Component ────────────────────────────────────────────
export default function UserManagement() {
    const { isSuperAdmin } = useAuth();
    const [users,        setUsers]       = useState([]);
    const [loading,      setLoading]     = useState(true);
    const [toggling,     setToggling]    = useState(null);
    const [changingRole, setChangingRole] = useState(null);
    const [currentPage,  setCurrentPage]  = useState(1);

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

    const handleRoleChange = async (userId, userName, newRole) => {
        if (!window.confirm(`Change "${userName}" role to "${ROLE_LABELS[newRole] || newRole}"?`)) return;
        try {
            setChangingRole(userId);
            await API.put(`/auth/users/${userId}/role`, { role: newRole });
            toast.success(`${userName}'s role updated to ${ROLE_LABELS[newRole]} ✅`);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update role");
        } finally {
            setChangingRole(null);
        }
    };

    // ── Pagination Logic ──────────────────────────────────────────
    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-lg">👥</span>
                            User Management
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 ml-10">Manage system users and their roles</p>
                    </div>
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
                    <>
                        <div className="overflow-x-auto">
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
                                    {paginatedUsers.map((u) => (
                                        <tr key={u._id} className="hover:bg-blue-50/40 transition-colors duration-150 group">
                                            {/* User */}
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

                                            {/* Role — dropdown if super_admin */}
                                            <td className="px-5 py-4">
                                                {isSuperAdmin ? (
                                                    <select
                                                        value={u.role}
                                                        disabled={changingRole === u._id}
                                                        onChange={(e) => handleRoleChange(u._id, u.name, e.target.value)}
                                                        className={`text-xs font-bold rounded-lg px-2 py-1 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${ROLE_STYLES[u.role] || "bg-slate-100 text-slate-600"}`}
                                                    >
                                                        {ASSIGNABLE_ROLES.map((r) => (
                                                            <option key={r.value} value={r.value}>{r.label}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize ${ROLE_STYLES[u.role] || "bg-slate-100 text-slate-600"}`}>
                                                        {ROLE_LABELS[u.role] || u.role}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                                                    {u.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>

                                            {/* Last Login */}
                                            <td className="px-5 py-4 text-xs text-slate-500">
                                                {u.lastLogin
                                                    ? new Date(u.lastLogin).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                                                    : "Never"}
                                            </td>

                                            {/* Actions */}
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
                        </div>

                        {/* Pagination Footer */}
                        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-500">
                                Showing <span className="text-slate-900">{startIndex + 1}</span> to <span className="text-slate-900">{Math.min(startIndex + ITEMS_PER_PAGE, users.length)}</span> of <span className="text-slate-900">{users.length}</span> users
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => goToPage(i + 1)}
                                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1
                                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

