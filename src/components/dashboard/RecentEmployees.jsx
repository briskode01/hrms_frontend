// @ts-nocheck
// client/src/components/dashboard/RecentEmployees.jsx
// ─────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
    "bg-blue-500", "bg-violet-500", "bg-emerald-500",
    "bg-amber-500", "bg-pink-500", "bg-cyan-500", "bg-rose-500",
];

const STATUS_STYLES = {
    Active: "bg-emerald-100 text-emerald-700",
    "On Leave": "bg-amber-100 text-amber-700",
    Inactive: "bg-red-100 text-red-600",
};

const getAvatarColor = (name = "") =>
    AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = (first = "", last = "") =>
    `${first[0] || ""}${last[0] || ""}`.toUpperCase();

export default function RecentEmployees({ employees }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-base font-extrabold text-slate-900">Recent Employees</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Latest additions to the organization</p>
                </div>
            </div>

            {employees && employees.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-180">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                {["Employee", "Department", "Designation", "Status", "Joined"].map((h) => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {employees.map((emp) => (
                                <tr key={emp._id} className="hover:bg-blue-50/40 transition-colors duration-150">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full ${getAvatarColor(emp.firstName)} text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm`}>
                                                {getInitials(emp.firstName, emp.lastName)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{emp.firstName} {emp.lastName}</p>
                                                <p className="text-xs text-slate-400">{emp.employeeId} · {emp.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-600">{emp.department}</td>
                                    <td className="px-5 py-4 text-sm text-slate-600">{emp.designation}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[emp.status] || "bg-slate-100 text-slate-600"}`}>
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-xs text-slate-500">
                                        {new Date(emp.createdAt).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <div className="text-4xl mb-3 opacity-60">👤</div>
                    <p className="text-sm font-medium">No employees added yet</p>
                </div>
            )}
        </div>
    );
}
