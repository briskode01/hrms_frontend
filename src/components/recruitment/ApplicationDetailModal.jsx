// @ts-nocheck
import { STATUS_STYLES } from "./constants";
import { getAvatarColor } from "./utils";

export default function ApplicationDetailModal({
    viewApp,
    onClose,
    onSaveNotes,
    onMarkReviewed,
    onDelete,
    onOpenResume,
}) {
    if (!viewApp) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-6 rounded-t-2xl text-white relative">
                    <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors">✕</button>
                    <div className="flex items-center gap-4 mb-3">
                        <div className={`w-14 h-14 rounded-full ${getAvatarColor(viewApp.firstName)} text-white text-lg font-extrabold flex items-center justify-center ring-2 ring-white/20`}>
                            {viewApp.firstName[0]}{viewApp.lastName[0]}
                        </div>
                        <div>
                            <p className="font-extrabold text-lg">{viewApp.firstName} {viewApp.lastName}</p>
                            <p className="text-slate-400 text-sm">{viewApp.email} · {viewApp.phone}</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${STATUS_STYLES[viewApp.status]}`}>
                                {viewApp.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Applied For</p>
                        <p className="font-extrabold text-slate-900">{viewApp.job?.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{viewApp.job?.department} · {viewApp.job?.location}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Experience", value: viewApp.experienceYears > 0 ? `${viewApp.experienceYears} years` : "Fresher" },
                            { label: "Current Company", value: viewApp.currentCompany || "—" },
                            { label: "Location", value: viewApp.currentLocation || "—" },
                            { label: "Applied", value: new Date(viewApp.appliedAt).toLocaleDateString("en-IN") },
                        ].map(({ label, value }) => (
                            <div key={label} className="bg-slate-50 rounded-xl p-3">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
                                <p className="text-sm font-bold text-slate-800">{value}</p>
                            </div>
                        ))}
                    </div>

                    {viewApp.coverLetter && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cover Letter</p>
                            <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-3 leading-relaxed">{viewApp.coverLetter}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">HR Notes (internal)</p>
                        <textarea
                            rows={2}
                            defaultValue={viewApp.hrNotes}
                            placeholder="Add internal notes about this candidate..."
                            onBlur={(e) => onSaveNotes(viewApp._id, e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 outline-none resize-none placeholder-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                        />
                        <p className="text-xs text-slate-400 mt-1">Auto-saved when you click away</p>
                    </div>

                    <div className="flex gap-2 pt-1">
                        <button onClick={() => onOpenResume(viewApp._id)} className="flex-1 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-bold rounded-xl transition-colors">
                            📄 View Resume
                        </button>
                        {viewApp.status === "New" && (
                            <button onClick={() => onMarkReviewed(viewApp._id)} className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-sm font-bold rounded-xl transition-colors">
                                ✅ Mark Reviewed
                            </button>
                        )}
                        <button onClick={() => onDelete(viewApp._id)} className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 text-sm font-bold rounded-xl transition-colors">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
