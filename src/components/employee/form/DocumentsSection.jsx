// @ts-nocheck
// client/src/components/employee/form/DocumentsSection.jsx

const DOCS = [
    {
        field: "bankDetails",
        label: "Bank Details",
        icon: "🏦",
        desc: "Bank passbook / cancelled cheque",
    },
    {
        field: "aadhar",
        label: "Aadhar Card",
        icon: "🪪",
        desc: "Aadhar front & back (PDF / DOC)",
    },
    {
        field: "resume",
        label: "Resume / CV",
        icon: "📄",
        desc: "Latest resume",
    },
    {
        field: "offerLetter",
        label: "Offer Letter",
        icon: "📨",
        desc: "Signed offer letter",
    },
];

const FILE_TYPES = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export default function DocumentsSection({ docs, onFileChange }) {
    return (
        <div>
            {/* Section heading */}
            <div className="flex items-center gap-2 mb-4">
                <span className="w-4 h-0.5 bg-violet-500 rounded" />
                <p className="text-xs font-extrabold text-violet-600 uppercase tracking-widest">
                    Documents
                </p>
                <span className="text-xs text-slate-400 font-normal normal-case">(PDF or DOC only)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DOCS.map(({ field, label, icon, desc }) => {
                    const file = docs[field];
                    return (
                        <label
                            key={field}
                            htmlFor={`doc-${field}`}
                            className={`flex items-start gap-3 rounded-xl border-2 border-dashed p-3.5 cursor-pointer transition-all
                                ${file
                                    ? "border-violet-400 bg-violet-50"
                                    : "border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-violet-50/40"
                                }`}
                        >
                            <span className="text-2xl shrink-0">{icon}</span>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-slate-800">{label}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                    {file ? (
                                        <span className="text-violet-600 font-semibold truncate block">
                                            ✓ {file.name}
                                        </span>
                                    ) : (
                                        desc
                                    )}
                                </p>
                            </div>
                            {file && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onFileChange(field, null);
                                    }}
                                    className="shrink-0 text-rose-400 hover:text-rose-600 text-lg font-bold leading-none"
                                    title="Remove"
                                >
                                    ×
                                </button>
                            )}
                            <input
                                id={`doc-${field}`}
                                type="file"
                                accept={FILE_TYPES}
                                className="hidden"
                                onChange={(e) => onFileChange(field, e.target.files?.[0] || null)}
                            />
                        </label>
                    );
                })}
            </div>
        </div>
    );
}
