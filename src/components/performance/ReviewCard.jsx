// @ts-nocheck
// client/src/components/performance/ReviewCard.jsx

import { GRADE_STYLES, STATUS_STYLES, getAvatarColor } from "./constants";

export default function ReviewCard({ review, onView, onEdit, onDelete }) {
    const r = review;
    const gradeStyle = GRADE_STYLES[r.grade] || GRADE_STYLES["Average"];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            {/* Score Bar */}
            <div className="h-1.5 w-full bg-slate-100">
                <div className={`h-full ${gradeStyle.bar} transition-all duration-500`} style={{ width: `${r.overallScore}%` }} />
            </div>

            <div className="p-5">
                {/* Employee Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-full ${getAvatarColor(r.employee?.firstName)} text-white text-sm font-bold flex items-center justify-center flex-shrink-0`}>
                        {r.employee?.firstName?.[0]}{r.employee?.lastName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-extrabold text-slate-900 truncate">
                            {r.employee?.firstName} {r.employee?.lastName}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{r.employee?.designation} · {r.employee?.department}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-extrabold text-slate-900">{r.overallScore}</p>
                        <p className="text-xs text-slate-400">/ 100</p>
                    </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${gradeStyle.badge}`}>{r.grade}</span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${STATUS_STYLES[r.status]}`}>{r.status}</span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600">{r.reviewCycle} {r.year}</span>
                </div>

                {/* Star Ratings Mini */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                        { label: "Technical", val: r.technicalSkills },
                        { label: "Teamwork", val: r.teamwork },
                        { label: "Comm.", val: r.communication },
                        { label: "Leadership", val: r.leadership },
                        { label: "Punctuality", val: r.punctuality },
                        { label: "Problem Solv.", val: r.problemSolving },
                    ].map(({ label, val }) => (
                        <div key={label} className="bg-slate-50 rounded-xl p-2 text-center">
                            <p className="text-xs font-bold text-slate-800">{val}<span className="text-slate-400 font-normal">/5</span></p>
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Flags */}
                {(r.incrementRecommended || r.promotionRecommended) && (
                    <div className="flex gap-2 mb-3">
                        {r.incrementRecommended && (
                            <span className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold">
                                💰 +{r.incrementPercent}% increment
                            </span>
                        )}
                        {r.promotionRecommended && (
                            <span className="flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 rounded-lg text-xs font-bold">
                                🚀 Promotion
                            </span>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-1 border-t border-slate-100">
                    <button onClick={() => onView(r)}
                        className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl transition-colors">
                        View
                    </button>
                    <button onClick={() => onEdit(r)}
                        className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-colors">
                        Edit
                    </button>
                    <button onClick={() => onDelete(r._id)}
                        className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold rounded-xl transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
