// @ts-nocheck
import { DEPT_COLORS, TYPE_ICONS } from "./constants";
import { formatSalary } from "./utils";

export default function JobsGrid({ jobs, loading, onSelectJob, onApply }) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium">Loading jobs...</p>
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center">
                <div className="text-5xl mb-4">💼</div>
                <p className="text-lg font-bold text-slate-600">No open positions found</p>
                <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {jobs.map((job) => (
                <div
                    key={job._id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                    onClick={() => onSelectJob(job)}
                >
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${DEPT_COLORS[job.department] || "bg-slate-100 text-slate-600"}`}>
                                {job.department}
                            </span>
                            <span className="text-xs text-slate-400">
                                {new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </span>
                        </div>

                        <h3 className="font-extrabold text-slate-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                            {job.title}
                        </h3>

                        <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
                            <span>📍 {job.location}</span>
                            <span>{TYPE_ICONS[job.jobType]} {job.jobType}</span>
                            <span>🎯 {job.experienceLevel}</span>
                        </div>

                        {formatSalary(job.salaryMin, job.salaryMax) && (
                            <p className="text-sm font-bold text-emerald-600 mb-3">
                                💰 {formatSalary(job.salaryMin, job.salaryMax)}
                            </p>
                        )}

                        <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                            {job.description}
                        </p>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onApply(job);
                            }}
                            className="w-full py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-blue-200 transition-all"
                        >
                            Apply Now →
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
