// @ts-nocheck
// client/src/pages/Employees.jsx
// Employee list page — fully styled with Tailwind CSS

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "@/api/axios";


const AVATAR_COLORS = [
    "bg-blue-500", "bg-violet-500", "bg-emerald-500",
    "bg-amber-500", "bg-pink-500", "bg-cyan-500", "bg-rose-500",
];

const DEPARTMENTS = ["All", "Engineering", "Marketing", "HR", "Finance", "Sales", "Operations", "Design"];


const getAvatarColor = (name = "") =>
    AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const getInitials = (firstName = "", lastName = "") =>
    `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

export default function Employees({ onAddClick, onViewClick, onEditClick }) {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedDept, setSelectedDept] = useState("All");


    // ─── Fetch employees ──────────────────────────────────────────
    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const params = {};
            if (search) params.search = search;
            if (selectedDept !== "All") params.department = selectedDept;

            const { data } = await API.get("/employees", { params });
            setEmployees(data.data);
        } catch {
            toast.error("Failed to fetch employees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delay = setTimeout(fetchEmployees, 300);
        return () => clearTimeout(delay);
    }, [search, selectedDept]);

    // ─── Delete ───────────────────────────────────────────────────
    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete ${name}?`)) return;
        try {
            await API.delete(`/employees/${id}`);
            toast.success(`${name} deleted`);
            fetchEmployees();
        } catch {
            toast.error("Failed to delete employee");
        }
    };

    return (
        <div className="space-y-6">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Employees</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{employees.length} total employees</p>
                </div>
                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto justify-center sm:justify-start"
                >
                    <span className="text-lg leading-none">+</span> Add Employee
                </button>
            </div>

            {/* ── Filters ── */}
            <div className="flex flex-wrap gap-3 items-center">
                {/* Search */}
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex-1 min-w-50 shadow-sm">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <input
                        placeholder="Search by name, ID or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="text-sm text-slate-800 bg-transparent outline-none w-full placeholder-slate-400"
                    />
                </div>

                {/* Department */}
                <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none cursor-pointer shadow-sm hover:border-blue-400 transition-colors"
                >
                    {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>


            </div>

            {/* ── Employee Cards ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                        <p className="text-sm font-medium">Loading employees...</p>
                    </div>
                ) : employees.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <div className="text-5xl mb-3">👤</div>
                        <p className="text-base font-semibold text-slate-600">No employees found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                        {employees.map((emp) => (
                            <div key={emp._id} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-3">
                                    <div className="relative shrink-0">
                                        <div className={`w-14 h-14 rounded-full ${getAvatarColor(emp.firstName)} text-white text-base font-extrabold flex items-center justify-center`}>
                                            {getInitials(emp.firstName, emp.lastName)}
                                        </div>
                                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${emp.status === "Inactive" ? "bg-red-500" : "bg-emerald-500"}`} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-base font-extrabold text-slate-900 truncate">{emp.firstName} {emp.lastName}</p>
                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase shrink-0">
                                                {emp.status || "Active"}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-600">{emp.designation}</p>
                                        <p className="text-xs text-slate-400 mt-0.5 truncate">{emp.employeeId}</p>

                                        <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                                            <p><span className="font-semibold">Department :</span> {emp.department || "—"}</p>
                                            <p><span className="font-semibold">Type :</span> {emp.employmentType || "—"}</p>
                                            <p className="truncate"><span className="font-semibold">Email :</span> {emp.email || "—"}</p>
                                            <p><span className="font-semibold">Salary :</span> ₹{emp.salary?.toLocaleString("en-IN") || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => onViewClick(emp)}
                                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition-colors"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => onEditClick(emp)}
                                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold rounded-lg transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(emp._id, `${emp.firstName} ${emp.lastName}`)}
                                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold rounded-lg transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}