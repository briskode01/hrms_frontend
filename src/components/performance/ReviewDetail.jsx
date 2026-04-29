// @ts-nocheck
// client/src/components/performance/ReviewDetail.jsx

import { GRADE_STYLES, getAvatarColor } from "./constants";

export default function ReviewDetail({ review, onClose, onEdit }) {
    if (!review) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>

                {/* Hero Header */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-t-2xl px-6 py-6 text-white relative">
                    <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">✕</button>
                    <div className="flex items-center gap-4 mb-3">
                        <div className={`w-14 h-14 rounded-full ${getAvatarColor(review.employee?.firstName)} text-white text-lg font-extrabold flex items-center justify-center ring-2 ring-white/20`}>
                            {review.employee?.firstName?.[0]}{review.employee?.lastName?.[0]}
                        </div>
                        <div>
                            <p className="font-extrabold text-lg">{review.employee?.firstName} {review.employee?.lastName}</p>
                            <p className="text-slate-400 text-sm">{review.employee?.designation} · {review.employee?.department}</p>
                            <p className="text-slate-500 text-xs mt-0.5">{review.reviewCycle} Review · {review.year}</p>
                        </div>
                    </div>
                    {/* Score bar */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                <div className={`h-full ${GRADE_STYLES[review.grade]?.bar || "bg-blue-500"} rounded-full`}
                                    style={{ width: `${review.overallScore}%` }} />
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-extrabold">{review.overallScore}</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${GRADE_STYLES[review.grade]?.badge}`}>{review.grade}</span>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-5 space-y-5">
                    {/* Skill Ratings */}
                    <div>
                        <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3">Skill Ratings</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                ["Technical", review.technicalSkills],
                                ["Comm.", review.communication],
                                ["Teamwork", review.teamwork],
                                ["Leadership", review.leadership],
                                ["Punctuality", review.punctuality],
                                ["Problem Slv.", review.problemSolving],
                            ].map(([label, val]) => (
                                <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                                    <div className="flex justify-center gap-0.5 mb-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <span key={s} className={`text-sm ${s <= val ? "text-amber-400" : "text-slate-200"}`}>★</span>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-slate-500">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* KPIs */}
                    {review.kpis?.length > 0 && (
                        <div>
                            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3">KPIs</h4>
                            <div className="space-y-2">
                                {review.kpis.map((kpi, i) => {
                                    const pct = kpi.target > 0 ? Math.round((kpi.achieved / kpi.target) * 100) : 0;
                                    return (
                                        <div key={i} className="flex items-center gap-3">
                                            <p className="text-xs text-slate-600 w-36 flex-shrink-0 font-medium">{kpi.title}</p>
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                                            </div>
                                            <p className="text-xs font-bold text-slate-700 w-10 text-right">{pct}%</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Feedback */}
                    {[
                        { label: "Strengths", val: review.strengths },
                        { label: "Areas of Improvement", val: review.areasOfImprovement },
                        { label: "Goals", val: review.goals },
                        { label: "Manager Comments", val: review.managerComments },
                    ].filter((f) => f.val).map(({ label, val }) => (
                        <div key={label}>
                            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1">{label}</h4>
                            <p className="text-sm text-slate-700 bg-slate-50 rounded-xl px-4 py-3">{val}</p>
                        </div>
                    ))}

                    {/* Flags */}
                    {(review.incrementRecommended || review.promotionRecommended) && (
                        <div className="flex gap-3">
                            {review.incrementRecommended && (
                                <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                                    <p className="text-lg">💰</p>
                                    <p className="text-sm font-extrabold text-emerald-700">+{review.incrementPercent}%</p>
                                    <p className="text-xs text-emerald-600">Increment</p>
                                </div>
                            )}
                            {review.promotionRecommended && (
                                <div className="flex-1 bg-violet-50 border border-violet-200 rounded-xl p-3 text-center">
                                    <p className="text-lg">🚀</p>
                                    <p className="text-sm font-extrabold text-violet-700">Recommended</p>
                                    <p className="text-xs text-violet-600">Promotion</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold transition-colors">Close</button>
                        <button onClick={() => onEdit(review)}
                            className="flex-[2] py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold shadow-md shadow-blue-200 transition-all">
                            ✏️ Edit Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
