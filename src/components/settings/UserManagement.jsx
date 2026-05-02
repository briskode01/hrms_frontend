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
import { Plus } from "lucide-react";
import UserManagementTable from "./UserManagementTable";
import CreateUserModal from "./CreateUserModal";

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

const CREATABLE_ROLES = ASSIGNABLE_ROLES.filter((role) => role.value !== "employee");

// ── Main Component ────────────────────────────────────────────
export default function UserManagement() {
    const { isSuperAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(null);
    const [changingRole, setChangingRole] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState({ name: "", email: "", password: "", role: "hr_admin" });
    const [creatingUser, setCreatingUser] = useState(false);

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

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!createForm.name.trim() || !createForm.email.trim() || !createForm.password.trim()) {
            return toast.error("All fields are required");
        }
        if (createForm.password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }
        try {
            setCreatingUser(true);
            await API.post("/auth/create-user", {
                name: createForm.name,
                email: createForm.email,
                password: createForm.password,
                role: createForm.role,
            });
            toast.success(`User "${createForm.name}" created successfully! ✅`);
            setCreateForm({ name: "", email: "", password: "", role: "hr_admin" });
            setShowCreateModal(false);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create user");
        } finally {
            setCreatingUser(false);
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
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-lg">👥</span>
                            User Management
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 ml-10">Manage system users and their roles</p>
                    </div>
                    {isSuperAdmin && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 text-white text-sm font-bold hover:from-violet-700 hover:to-violet-800 shadow-md shadow-violet-200 transition-all hover:-translate-y-0.5"
                        >
                            <Plus size={16} /> Create User
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                        <div className="text-4xl mb-3 opacity-60">⏳</div>
                        <p className="text-sm font-medium">Loading users...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                        <div className="text-4xl mb-3 opacity-60">👥</div>
                        <p className="text-sm font-medium">No users found</p>
                    </div>
                ) : (
                    <UserManagementTable
                        users={paginatedUsers}
                        totalUsers={users.length}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        startIndex={startIndex}
                        itemsPerPage={ITEMS_PER_PAGE}
                        isSuperAdmin={isSuperAdmin}
                        roleLabels={ROLE_LABELS}
                        roleStyles={ROLE_STYLES}
                        changingRole={changingRole}
                        toggling={toggling}
                        getAvatarColor={getAvatarColor}
                        onPageChange={goToPage}
                        onToggle={handleToggle}
                        onRoleChange={handleRoleChange}
                    />
                )}
            </div>

            {showCreateModal && (
                <CreateUserModal
                    createForm={createForm}
                    setCreateForm={setCreateForm}
                    creatableRoles={CREATABLE_ROLES}
                    creatingUser={creatingUser}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateUser}
                />
            )}
        </>
    );
}

