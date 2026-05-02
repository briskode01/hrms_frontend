import { ChevronLeft, ChevronRight } from "lucide-react";

export default function UserManagementTable({
    users,
    totalUsers,
    currentPage,
    totalPages,
    startIndex,
    itemsPerPage,
    isSuperAdmin,
    roleLabels,
    roleStyles,
    changingRole,
    toggling,
    getAvatarColor,
    onPageChange,
    onToggle,
    onRoleChange,
}) {
    return (
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
                                    {isSuperAdmin ? (
                                        <select
                                            value={u.role}
                                            disabled={changingRole === u._id}
                                            onChange={(e) => onRoleChange(u._id, u.name, e.target.value)}
                                            className={`text-xs font-bold rounded-lg px-2 py-1 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${roleStyles[u.role] || "bg-slate-100 text-slate-600"}`}
                                        >
                                            {Object.entries(roleLabels).map(([value, label]) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize ${roleStyles[u.role] || "bg-slate-100 text-slate-600"}`}>
                                            {roleLabels[u.role] || u.role}
                                        </span>
                                    )}
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
                                        onClick={() => onToggle(u._id, u.name, u.isActive)}
                                        disabled={toggling === u._id || u.role === "super_admin"}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${u.isActive
                                            ? "bg-red-50 hover:bg-red-100 text-red-600"
                                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                                        } ${(toggling === u._id || u.role === "super_admin") ? "opacity-50 cursor-not-allowed grayscale" : ""}`}
                                        title={u.role === "super_admin" ? "Super Admin cannot be deactivated" : ""}
                                    >
                                        {toggling === u._id ? "..." : u.isActive ? "Deactivate" : "Activate"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500">
                    Showing <span className="text-slate-900">{startIndex + 1}</span> to <span className="text-slate-900">{Math.min(startIndex + itemsPerPage, totalUsers)}</span> of <span className="text-slate-900">{totalUsers}</span> users
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => onPageChange(i + 1)}
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
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </>
    );
}
