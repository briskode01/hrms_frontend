// @ts-nocheck
export default function ApplyJobModal({
    applyJob,
    submitted,
    form,
    formError,
    submitting,
    dragOver,
    onClose,
    onSubmit,
    onFieldChange,
    onDragOver,
    onDragLeave,
    onDrop,
}) {
    if (!applyJob) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white px-7 py-5 border-b border-slate-100 flex items-center justify-between z-10 rounded-t-2xl">
                    <div>
                        <h2 className="text-base font-extrabold text-slate-900">Apply — {applyJob.title}</h2>
                        <p className="text-xs text-slate-400 mt-0.5">{applyJob.department} · {applyJob.location}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl text-lg font-bold transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {submitted ? (
                    <div className="flex flex-col items-center justify-center px-7 py-14 text-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-4xl mb-5">🎉</div>
                        <h3 className="text-xl font-extrabold text-slate-900 mb-2">Application Submitted!</h3>
                        <p className="text-sm text-slate-500 max-w-xs">
                            Thanks {form.firstName}! We've received your application for <b>{applyJob.title}</b>.
                            Our HR team will review and get back to you soon.
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-6 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="px-7 py-6 space-y-5">
                        {formError && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                <span className="text-red-400">⚠️</span>
                                <p className="text-red-600 text-sm font-medium">{formError}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "First Name", field: "firstName", required: true },
                                { label: "Last Name", field: "lastName", required: true },
                            ].map(({ label, field, required }) => (
                                <div key={field}>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                        {label} {required && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        required={required}
                                        type="text"
                                        placeholder={label}
                                        value={form[field]}
                                        onChange={(e) => onFieldChange(field, e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Email", field: "email", type: "email", required: true },
                                { label: "Phone", field: "phone", type: "tel", required: true },
                            ].map(({ label, field, type, required }) => (
                                <div key={field}>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                        {label} {required && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        required={required}
                                        type={type}
                                        placeholder={label}
                                        value={form[field]}
                                        onChange={(e) => onFieldChange(field, e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Current Location</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Bengaluru"
                                    value={form.currentLocation}
                                    onChange={(e) => onFieldChange("currentLocation", e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Experience (years)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="50"
                                    placeholder="0"
                                    value={form.experienceYears}
                                    onChange={(e) => onFieldChange("experienceYears", e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Current Company</label>
                            <input
                                type="text"
                                placeholder="Where do you currently work? (optional)"
                                value={form.currentCompany}
                                onChange={(e) => onFieldChange("currentCompany", e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cover Letter <span className="text-slate-400 normal-case">(optional)</span></label>
                            <textarea
                                rows={3}
                                placeholder="Tell us why you'd be a great fit..."
                                value={form.coverLetter}
                                onChange={(e) => onFieldChange("coverLetter", e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 outline-none resize-none placeholder-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Resume (PDF) <span className="text-red-500">*</span>
                            </label>
                            <div
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer
                      ${dragOver
                                        ? "border-blue-400 bg-blue-50"
                                        : form.resume
                                            ? "border-emerald-400 bg-emerald-50"
                                            : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50"}`}
                                onClick={() => document.getElementById("resumeInput").click()}
                            >
                                <input
                                    id="resumeInput"
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => onFieldChange("resume", e.target.files?.[0] || null)}
                                />

                                {form.resume ? (
                                    <>
                                        <div className="text-3xl mb-2">✅</div>
                                        <p className="text-sm font-bold text-emerald-700">{form.resume.name}</p>
                                        <p className="text-xs text-emerald-600 mt-0.5">
                                            {(form.resume.size / 1024).toFixed(0)} KB · Click to change
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-3xl mb-2">📄</div>
                                        <p className="text-sm font-bold text-slate-600">Drop your PDF here or click to browse</p>
                                        <p className="text-xs text-slate-400 mt-0.5">PDF only · Max 5MB</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all
                    ${submitting
                                    ? "bg-slate-400 cursor-not-allowed"
                                    : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-200 hover:-translate-y-0.5"}`}
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Submitting...
                                </span>
                            ) : "Submit Application 🚀"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
