// @ts-nocheck
import CircleProgress from "../shared/CircleProgress";

export default function PerformancePanel({ performance, gradeConfig, navigate, setActiveTab }) {
  const handleViewAll = () => {
    if (setActiveTab) {
      setActiveTab("performance");
      return;
    }
    navigate("/performance");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-1">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-slate-900">Latest Performance</h3>
          <p className="text-xs text-slate-400 mt-0.5">Most recent review cycle</p>
        </div>
        <span className="text-xl">📈</span>
      </div>

      <div className="px-6 py-5">
        {performance ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-600">{performance.reviewCycle} {performance.year}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${gradeConfig?.color} ${gradeConfig?.bg} ${gradeConfig?.border}`}>
                {gradeConfig?.emoji} {performance.grade}
              </span>
            </div>

            <div className="flex items-center gap-5 mb-5">
              <div className="relative shrink-0">
                <CircleProgress
                  percent={performance.overallScore}
                  size={80}
                  stroke={7}
                  color={performance.overallScore >= 90 ? "#10b981"
                    : performance.overallScore >= 75 ? "#3b82f6"
                      : performance.overallScore >= 60 ? "#f59e0b"
                        : "#ef4444"}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-extrabold text-slate-900">{performance.overallScore}</span>
                  <span className="text-[9px] text-slate-400 font-bold">/ 100</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-700 mb-3">Skill Ratings</p>
                {[
                  { label: "Technical", val: performance.technicalSkills },
                  { label: "Teamwork", val: performance.teamwork },
                  { label: "Comm.", val: performance.communication },
                ].map(({ label, val }) => (
                  <div key={label} className="mb-2">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-xs text-slate-500">{label}</span>
                      <span className="text-xs font-bold text-slate-700">{val}/5</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-blue-400 to-indigo-500 rounded-full" style={{ width: `${(val / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {performance.strengths && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-3">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Strengths</p>
                <p className="text-xs text-slate-600 line-clamp-2">{performance.strengths}</p>
              </div>
            )}

            {performance.areasOfImprovement && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-4">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Areas to Improve</p>
                <p className="text-xs text-slate-600 line-clamp-2">{performance.areasOfImprovement}</p>
              </div>
            )}

            {(performance.incrementRecommended || performance.promotionRecommended) && (
              <div className="flex gap-2 mb-4">
                {performance.incrementRecommended && (
                  <div className="flex-1 bg-green-50 border border-green-100 rounded-xl p-2.5 text-center">
                    <p className="text-base">💰</p>
                    <p className="text-xs font-extrabold text-green-700">+{performance.incrementPercent}%</p>
                    <p className="text-[10px] text-green-600">Increment</p>
                  </div>
                )}
                {performance.promotionRecommended && (
                  <div className="flex-1 bg-violet-50 border border-violet-100 rounded-xl p-2.5 text-center">
                    <p className="text-base">🚀</p>
                    <p className="text-xs font-extrabold text-violet-700">Recommended</p>
                    <p className="text-[10px] text-violet-600">Promotion</p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleViewAll}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-colors border border-slate-200"
            >
              View all reviews →
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-center">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-xs mt-1">Your review will appear here once HR completes an assessment</p>
          </div>
        )}
      </div>
    </div>
  );
}
