// @ts-nocheck
// client/src/components/dashboard/PerformanceGrades.jsx
// ─────────────────────────────────────────────────────────────

const GRADE_COLORS = {
    Excellent: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Good: "bg-blue-50 text-blue-700 border-blue-200",
    Average: "bg-amber-50 text-amber-700 border-amber-200",
    "Needs Improvement": "bg-orange-50 text-orange-700 border-orange-200",
    Poor: "bg-red-50 text-red-700 border-red-200",
};

export default function PerformanceGrades({ performance }) {
    if (performance.totalReviews <= 0) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-base font-extrabold text-slate-900">Performance Grades</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date().getFullYear()} review distribution</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-3">
                {Object.entries(performance.gradeDistribution).map(([grade, count]) => (
                    <div
                        key={grade}
                        className={`px-4 py-3 rounded-xl border font-bold text-sm flex items-center gap-2 ${GRADE_COLORS[grade] || "bg-slate-50 text-slate-700 border-slate-200"}`}
                    >
                        <span>{grade}</span>
                        <span className="text-lg font-extrabold">{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
