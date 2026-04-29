// @ts-nocheck
import { DEPT_COLORS, JOB_STATUS_STYLES } from "./constants";

export default function JobsPanel({ jobs, onEditJob, onDeleteJob }) {
    if (jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center">
                <div className="text-5xl mb-4">💼</div>
                <p className="text-base font-semibold text-slate-600">No jobs posted yet</p>
                <p className="text-sm mt-1">Click "+ Post a Job" to create your first listing</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {jobs.map((job) => (
                <div key={job._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${DEPT_COLORS[job.department]}`}>{job.department}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${JOB_STATUS_STYLES[job.status]}`}>{job.status}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base mb-1">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-3">
                        <span>📍 {job.location}</span>
                        <span>💼 {job.jobType}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-400">
                            {job.applicationCount} applicant{job.applicationCount !== 1 ? "s" : ""}
                        </span>
                        <div className="flex gap-2">
                            <button onClick={() => onEditJob(job)} className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition-colors">Edit</button>
                            <button onClick={() => onDeleteJob(job._id, job.title)} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold rounded-lg transition-colors">Delete</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
