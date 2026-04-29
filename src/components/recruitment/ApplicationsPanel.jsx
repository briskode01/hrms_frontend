// @ts-nocheck
import { Link } from "react-router-dom";
import { DEPT_COLORS, STATUS_STYLES } from "./constants";
import { getAvatarColor, timeAgo } from "./utils";

export default function ApplicationsPanel({
    loading,
    applications,
    jobs,
    filterStatus,
    filterJob,
    onFilterStatus,
    onFilterJob,
    onView,
    onMarkReviewed,
    onOpenResume,
}) {
    return (
        <>
            <div className="flex flex-wrap gap-3">
                <select
                    value={filterStatus}
                    onChange={(e) => onFilterStatus(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none cursor-pointer shadow-sm hover:border-blue-400 transition-colors"
                >
                    <option value="All">All Statuses</option>
                    <option>New</option>
                    <option>Reviewed</option>
                </select>
                <select
                    value={filterJob}
                    onChange={(e) => onFilterJob(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none cursor-pointer shadow-sm hover:border-blue-400 transition-colors"
                >
                    <option value="All">All Jobs</option>
                    {jobs.map((job) => <option key={job._id} value={job._id}>{job.title}</option>)}
                </select>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                    <p className="text-sm font-medium">Loading applications...</p>
                </div>
            ) : applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center">
                    <div className="text-5xl mb-4">📭</div>
                    <p className="text-base font-semibold text-slate-600">No applications yet</p>
                    <p className="text-sm mt-1">Applications from the careers page will appear here</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                {["Applicant", "Applied For", "Experience", "Status", "Applied", "Actions"].map((heading) => (
                                    <th key={heading} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{heading}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {applications.map((app) => (
                                <tr key={app._id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full ${getAvatarColor(app.firstName)} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                                                {app.firstName[0]}{app.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{app.firstName} {app.lastName}</p>
                                                <p className="text-xs text-slate-400">{app.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="text-sm font-bold text-slate-700 truncate max-w-40">{app.job?.title}</p>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${DEPT_COLORS[app.job?.department]}`}>
                                            {app.job?.department}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-600">
                                        {app.experienceYears > 0 ? `${app.experienceYears} yr${app.experienceYears > 1 ? "s" : ""}` : "Fresher"}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[app.status]}`}>
                                            {app.status === "New" ? "🆕 New" : "✅ Reviewed"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-xs text-slate-400">{timeAgo(app.appliedAt)}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => onView(app)} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition-colors">
                                                View
                                            </button>
                                            {app.status === "New" && (
                                                <button onClick={() => onMarkReviewed(app._id)} className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold rounded-lg transition-colors">
                                                    Mark Reviewed
                                                </button>
                                            )}
                                            <Link
                                                to="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    onOpenResume(app._id);
                                                }}
                                                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition-colors"
                                            >
                                                📄 Resume
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
