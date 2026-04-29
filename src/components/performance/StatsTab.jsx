// @ts-nocheck
// client/src/components/performance/StatsTab.jsx

import { GRADE_STYLES, getAvatarColor } from "./constants";

export default function StatsTab({ stats, selectedYear }) {
    if (!stats) return null;

    return (
        <div className="space-y-5">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Reviews", value: stats.totalReviews, icon: "📋", style: "bg-blue-50 border-blue-200 text-blue-700" },
                    { label: "Avg Score", value: `${stats.avgScore}/100`, icon: "🎯", style: "bg-violet-50 border-violet-200 text-violet-700" },
                    { label: "Increments", value: stats.incrementCount, icon: "💰", style: "bg-emerald-50 border-emerald-200 text-emerald-700" },
                    { label: "Promotions", value: stats.promotionCount, icon: "🚀", style: "bg-amber-50 border-amber-200 text-amber-700" },
                ].map((c) => (
                    <div key={c.label} className={`rounded-2xl border p-5 shadow-sm ${c.style}`}>
                        <div className="text-2xl mb-2">{c.icon}</div>
                        <div className="text-3xl font-extrabold">{c.value}</div>
                        <div className="text-xs font-bold opacity-80 mt-1">{c.label}</div>
                    </div>
                ))}
            </div>

            {/* Grade Distribution */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-extrabold text-slate-900 mb-5">Grade Distribution — {selectedYear}</h3>
                <div className="space-y-4">
                    {Object.entries(stats.gradeCount).map(([grade, count]) => {
                        const pct = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0;
                        const style = GRADE_STYLES[grade] || GRADE_STYLES["Average"];
                        return (
                            <div key={grade}>
                                <div className="flex justify-between items-center mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${style.badge}`}>{grade}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">{count} <span className="text-slate-400 font-normal text-xs">({pct}%)</span></span>
                                </div>
                                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${style.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Top Performers */}
            {stats.topPerformers?.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="font-extrabold text-slate-900 mb-5">🏆 Top Performers — {selectedYear}</h3>
                    <div className="space-y-3">
                        {stats.topPerformers.map((tp, i) => (
                            <div key={tp._id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0
                                    ${i === 0 ? "bg-amber-400" : i === 1 ? "bg-slate-400" : i === 2 ? "bg-amber-600" : "bg-slate-300"}`}>
                                    {i + 1}
                                </div>
                                <div className={`w-9 h-9 rounded-full ${getAvatarColor(tp.employee?.firstName)} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>
                                    {tp.employee?.firstName?.[0]}{tp.employee?.lastName?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{tp.employee?.firstName} {tp.employee?.lastName}</p>
                                    <p className="text-xs text-slate-400">{tp.employee?.department}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-lg font-extrabold text-emerald-600">{tp.overallScore}</p>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${GRADE_STYLES[tp.grade]?.badge}`}>{tp.grade}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
