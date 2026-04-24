// @ts-nocheck
import { DEPARTMENTS, EXP_LEVELS, JOB_TYPES } from "./constants";

function FieldLabel({ label, required }) {
    return (
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
    );
}

const inputCls = "w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors";

export default function JobFormModal({ show, editJob, jobForm, onClose, onSubmit, onChange }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white flex items-center justify-between px-7 py-5 border-b border-slate-100 z-10 rounded-t-2xl">
                    <h2 className="text-lg font-extrabold text-slate-900">
                        {editJob ? "✏️ Edit Job" : "➕ Post New Job"}
                    </h2>
                    <button onClick={onClose} className="w-9 h-9 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors text-lg font-bold">✕</button>
                </div>

                <form onSubmit={onSubmit} className="px-7 py-6 space-y-5">
                    <div>
                        <FieldLabel label="Job Title" required />
                        <input required type="text" placeholder="e.g. Senior React Developer" value={jobForm.title} onChange={(e) => onChange("title", e.target.value)} className={inputCls} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FieldLabel label="Department" required />
                            <select value={jobForm.department} onChange={(e) => onChange("department", e.target.value)} className={inputCls}>
                                {DEPARTMENTS.map((department) => <option key={department}>{department}</option>)}
                            </select>
                        </div>
                        <div>
                            <FieldLabel label="Location" required />
                            <input required type="text" placeholder="e.g. Bengaluru / Remote" value={jobForm.location} onChange={(e) => onChange("location", e.target.value)} className={inputCls} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FieldLabel label="Job Type" />
                            <select value={jobForm.jobType} onChange={(e) => onChange("jobType", e.target.value)} className={inputCls}>
                                {JOB_TYPES.map((type) => <option key={type}>{type}</option>)}
                            </select>
                        </div>
                        <div>
                            <FieldLabel label="Experience Level" />
                            <select value={jobForm.experienceLevel} onChange={(e) => onChange("experienceLevel", e.target.value)} className={inputCls}>
                                {EXP_LEVELS.map((level) => <option key={level}>{level}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FieldLabel label="Min Salary (₹/year)" />
                            <input type="number" placeholder="e.g. 500000" value={jobForm.salaryMin} onChange={(e) => onChange("salaryMin", e.target.value)} className={inputCls} />
                        </div>
                        <div>
                            <FieldLabel label="Max Salary (₹/year)" />
                            <input type="number" placeholder="e.g. 1000000" value={jobForm.salaryMax} onChange={(e) => onChange("salaryMax", e.target.value)} className={inputCls} />
                        </div>
                    </div>

                    <div>
                        <FieldLabel label="Job Description" required />
                        <textarea required rows={4} placeholder="Describe the role and what you're looking for..." value={jobForm.description} onChange={(e) => onChange("description", e.target.value)} className={`${inputCls} resize-none`} />
                    </div>

                    <div>
                        <FieldLabel label="Requirements" />
                        <textarea rows={3} placeholder="List skills and qualifications (one per line)..." value={jobForm.requirements} onChange={(e) => onChange("requirements", e.target.value)} className={`${inputCls} resize-none`} />
                    </div>

                    <div>
                        <FieldLabel label="Responsibilities" />
                        <textarea rows={3} placeholder="List key responsibilities (one per line)..." value={jobForm.responsibilities} onChange={(e) => onChange("responsibilities", e.target.value)} className={`${inputCls} resize-none`} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FieldLabel label="Status" />
                            <select value={jobForm.status} onChange={(e) => onChange("status", e.target.value)} className={inputCls}>
                                <option>Active</option>
                                <option>Draft</option>
                                <option>Closed</option>
                            </select>
                        </div>
                        <div>
                            <FieldLabel label="Application Deadline" />
                            <input type="date" value={jobForm.deadline} onChange={(e) => onChange("deadline", e.target.value)} className={inputCls} />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="flex-2 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5">
                            {editJob ? "Update Job" : "Post Job 🚀"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
