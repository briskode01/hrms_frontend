// @ts-nocheck
import { DEPT_COLORS, TYPE_ICONS } from "./constants";
import { formatSalary } from "./utils";

export default function JobDetailModal({ selectedJob, onClose, onApply }) {
    if (!selectedJob) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-7 py-6 rounded-t-2xl text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        ✕
                    </button>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block ${DEPT_COLORS[selectedJob.department]}`}>
                        {selectedJob.department}
                    </span>
                    <h2 className="text-2xl font-extrabold mb-1">{selectedJob.title}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400 mt-2">
                        <span>📍 {selectedJob.location}</span>
                        <span>{TYPE_ICONS[selectedJob.jobType]} {selectedJob.jobType}</span>
                        <span>🎯 {selectedJob.experienceLevel}</span>
                        {formatSalary(selectedJob.salaryMin, selectedJob.salaryMax) && (
                            <span className="text-emerald-400 font-bold">💰 {formatSalary(selectedJob.salaryMin, selectedJob.salaryMax)}</span>
                        )}
                    </div>
                </div>

                <div className="px-7 py-6 space-y-5">
                    {[
                        { label: "About the Role", text: selectedJob.description },
                        { label: "Requirements", text: selectedJob.requirements },
                        { label: "Responsibilities", text: selectedJob.responsibilities },
                    ]
                        .filter((section) => section.text)
                        .map(({ label, text }) => (
                            <div key={label}>
                                <h4 className="font-extrabold text-slate-900 mb-2">{label}</h4>
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{text}</p>
                            </div>
                        ))}

                    <button
                        onClick={() => onApply(selectedJob)}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5"
                    >
                        Apply for this Position →
                    </button>
                </div>
            </div>
        </div>
    );
}
