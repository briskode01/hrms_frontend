// @ts-nocheck
// client/src/components/dashboard/DepartmentChart.jsx
// ─────────────────────────────────────────────────────────────

const DEPT_COLORS = {
    Engineering: "bg-blue-500",
    Marketing: "bg-violet-500",
    HR: "bg-emerald-500",
    Finance: "bg-amber-500",
    Sales: "bg-pink-500",
    Operations: "bg-cyan-500",
    Design: "bg-rose-500",
};

function DepartmentBar({ name, count, maxCount }) {
    const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
    const color = DEPT_COLORS[name] || "bg-slate-400";
    return (
        <div className="flex items-center gap-3 group">
            <span className="text-xs font-bold text-slate-500 w-24 text-right truncate">{name}</span>
            <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-full rounded-full ${color} transition-all duration-700 ease-out group-hover:opacity-80`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-xs font-extrabold text-slate-700 w-8">{count}</span>
        </div>
    );
}

export default function DepartmentChart({ departmentStats }) {
    const maxCount = departmentStats.length > 0
        ? Math.max(...departmentStats.map((d) => d.count))
        : 1;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-base font-extrabold text-slate-900">Department Distribution</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Employees by department</p>
                </div>
                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-lg">
                    {departmentStats.length} depts
                </span>
            </div>
            <div className="space-y-3">
                {departmentStats.length > 0 ? (
                    departmentStats.map((dept) => (
                        <DepartmentBar
                            key={dept._id}
                            name={dept._id}
                            count={dept.count}
                            maxCount={maxCount}
                        />
                    ))
                ) : (
                    <p className="text-sm text-slate-400 text-center py-8">No department data available</p>
                )}
            </div>
        </div>
    );
}
