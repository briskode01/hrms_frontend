// @ts-nocheck
// client/src/components/EmployeeDetail.jsx
// Employee detail view modal — fully styled with Tailwind CSS

const AVATAR_COLORS = [
    "bg-blue-500", "bg-violet-500", "bg-emerald-500",
    "bg-amber-500", "bg-pink-500", "bg-cyan-500", "bg-rose-500",
];
const getAvatarColor = (name = "") =>
    AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const STATUS_STYLES = {
    Active: "bg-emerald-100 text-emerald-700",
    "On Leave": "bg-amber-100 text-amber-700",
    Inactive: "bg-red-100 text-red-600",
};

export default function EmployeeDetail({ employee, onClose, onEdit }) {
    if (!employee) return null;

    const initials = `${employee.firstName?.[0] || ""}${employee.lastName?.[0] || ""}`.toUpperCase();
    const fullName = `${employee.firstName} ${employee.lastName}`;

    const InfoCard = ({ label, value }) => (
        <div className="bg-slate-50 rounded-xl p-3.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-sm font-bold text-slate-800">{value || "—"}</p>
        </div>
    );

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Hero Header ── */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-t-2xl px-7 py-8 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-base"
                    >✕</button>

                    {/* Avatar */}
                    <div className={`w-16 h-16 rounded-full ${getAvatarColor(employee.firstName)} text-white text-2xl font-extrabold flex items-center justify-center mx-auto mb-3 ring-4 ring-white/20`}>
                        {initials}
                    </div>
                    <h2 className="text-xl font-extrabold text-white">{fullName}</h2>
                    <p className="text-sm text-slate-400 mt-1">{employee.designation} · {employee.department}</p>
                    <span className={`inline-block mt-3 px-4 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[employee.status]}`}>
                        {employee.status}
                    </span>
                </div>

                {/* ── Info Body ── */}
                <div className="px-6 py-5 space-y-5">

                    {/* Personal */}
                    <div>
                        <h3 className="text-xs font-extrabold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-4 h-0.5 bg-blue-600 rounded" /> Personal Info
                        </h3>
                        <div className="grid grid-cols-2 gap-2.5">
                            <InfoCard label="Employee ID" value={employee.employeeId} />
                            <InfoCard label="Gender" value={employee.gender} />
                            <InfoCard label="Email" value={employee.email} />
                            <InfoCard label="Phone" value={employee.phone} />
                        </div>
                        {employee.address && (
                            <div className="mt-2.5">
                                <InfoCard label="Address" value={employee.address} />
                            </div>
                        )}
                    </div>

                    {/* Job */}
                    <div>
                        <h3 className="text-xs font-extrabold text-violet-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-4 h-0.5 bg-violet-600 rounded" /> Job Info
                        </h3>
                        <div className="grid grid-cols-2 gap-2.5">
                            <InfoCard label="Department" value={employee.department} />
                            <InfoCard label="Employment Type" value={employee.employmentType} />
                            <InfoCard
                                label="Joining Date"
                                value={new Date(employee.joiningDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                            />
                            {employee.endingDate && (
                                <InfoCard
                                    label="Ending Date"
                                    value={new Date(employee.endingDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                />
                            )}
                            <InfoCard label="Monthly Salary" value={`₹${employee.salary?.toLocaleString("en-IN")}`} />
                        </div>
                    </div>

                    {/* Documents */}
                    <div>
                        <h3 className="text-xs font-extrabold text-violet-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-4 h-0.5 bg-violet-600 rounded" /> Documents
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                { key: "bankDetails", label: "Bank Details", icon: "🏦" },
                                { key: "aadhar", label: "Aadhar Card", icon: "🪪" },
                                { key: "resume", label: "Resume / CV", icon: "📄" },
                                { key: "offerLetter", label: "Offer Letter", icon: "📨" },
                            ].map(({ key, label, icon }) => {
                                const filePath = employee.documents?.[key];
                                const fileUrl = filePath ? `http://localhost:8000${filePath}` : null;
                                return (
                                    <div key={key} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-lg">{icon}</span>
                                            <span className="text-sm font-bold text-slate-700">{label}</span>
                                        </div>
                                        {fileUrl ? (
                                            <a
                                                href={fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 hover:bg-violet-200 text-violet-700 text-xs font-bold rounded-lg transition-colors"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                View
                                            </a>
                                        ) : (
                                            <span className="px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-semibold rounded-lg">
                                                Not uploaded
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>


                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold transition-colors"
                        >Close</button>
                        <button
                            onClick={() => { onClose(); onEdit(employee); }}
                            className="flex-[2] py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold shadow-md shadow-blue-200 hover:shadow-lg transition-all hover:-translate-y-0.5"
                        >✏️ Edit Employee</button>
                    </div>
                </div>
            </div>
        </div>
    );
}