// @ts-nocheck
// client/src/components/wages/WageTable.jsx
import { Banknote, CreditCard, Trash2, CheckCircle2, RefreshCw } from "lucide-react";

function getAvatarBg(name = "") {
    const c = ["bg-violet-500","bg-blue-500","bg-emerald-500","bg-rose-500","bg-amber-500","bg-cyan-500"];
    return c[(name.charCodeAt(0) || 0) % c.length];
}

const TYPE_BADGE = {
    "Daily Worker":  "bg-blue-100 text-blue-700",
    "Hourly Worker": "bg-amber-100 text-amber-700",
    "Freelancer":    "bg-violet-100 text-violet-700",
};

export default function WageTable({ records, loading, month, year, onPay, onDelete, onRefresh }) {
    const paidCount = records.filter(r => r.status === "Paid").length;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h2 className="font-extrabold text-slate-900">Wage Records</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(year, month - 1).toLocaleString("default", { month: "long" })} {year}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {records.length > 0 && (
                        <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
                            {paidCount} Paid · {records.length - paidCount} Pending
                        </span>
                    )}
                    <button onClick={onRefresh}
                        className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg flex items-center justify-center transition-colors">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* States */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
                    <p className="text-sm text-slate-400">Loading...</p>
                </div>
            ) : records.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Banknote className="w-12 h-12 text-slate-200 mb-3" />
                    <p className="font-semibold text-slate-500">No wage records yet</p>
                    <p className="text-sm mt-1">Create one using the form</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                {["Worker", "Type", "Period", "Hours/Days", "Rate", "Total", "Status", "Actions"].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {records.map(record => {
                                const name = record.worker?.fullName || "—";
                                const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
                                const dateRange = record.dateFrom && record.dateTo
                                    ? `${new Date(record.dateFrom).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} – ${new Date(record.dateTo).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`
                                    : "—";

                                return (
                                    <tr key={record._id} className="hover:bg-indigo-50/30 transition-colors group">
                                        {/* Worker */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`w-8 h-8 rounded-full ${getAvatarBg(name)} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                                                    {initials}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{name}</p>
                                                    <p className="text-xs text-slate-400">{record.worker?.phone}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Type */}
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${TYPE_BADGE[record.workerType] || "bg-slate-100 text-slate-600"}`}>
                                                {record.workerType}
                                            </span>
                                        </td>

                                        {/* Period */}
                                        <td className="px-4 py-3 text-xs text-slate-500 font-medium whitespace-nowrap">{dateRange}</td>

                                        {/* Hours / Days */}
                                        <td className="px-4 py-3 text-sm text-slate-600 font-mono">
                                            {record.workerType === "Daily Worker"  && `${record.workingDays}d`}
                                            {record.workerType === "Hourly Worker" && `${record.workingHours}h`}
                                            {record.workerType === "Freelancer"    && <span className="italic text-slate-400 text-xs">Fixed</span>}
                                        </td>

                                        {/* Rate */}
                                        <td className="px-4 py-3 text-sm text-slate-600 font-mono">₹{record.rateAmount?.toLocaleString("en-IN")}</td>

                                        {/* Total */}
                                        <td className="px-4 py-3 font-extrabold text-slate-900">₹{record.totalPayable?.toLocaleString("en-IN")}</td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            {record.status === "Paid"
                                                ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3 h-3" />Paid</span>
                                                : <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Draft</span>}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1.5 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                {record.status !== "Paid" && (
                                                    <button onClick={() => onPay(record)}
                                                        className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold rounded-lg transition-colors">
                                                        <CreditCard className="w-3.5 h-3.5" /> Pay
                                                    </button>
                                                )}
                                                <button onClick={() => onDelete(record._id)}
                                                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
