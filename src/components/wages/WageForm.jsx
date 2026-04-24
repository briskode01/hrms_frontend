// @ts-nocheck
// client/src/components/wages/WageForm.jsx
import { Briefcase, Clock, CalendarDays, IndianRupee, Plus } from "lucide-react";

const WORKER_TYPES = ["Daily Worker", "Hourly Worker", "Freelancer"];

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all";
const labelCls = "text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 mb-1.5";

const rateLabel = (workerType) =>
    workerType === "Daily Worker"  ? "Rate per Day (₹)" :
    workerType === "Hourly Worker" ? "Rate per Hour (₹)" : "Fixed Rate (₹)";

const calcTotal = (form) => {
    const r = Number(form.rateAmount) || 0;
    if (form.workerType === "Daily Worker")  return r * (Number(form.workingDays)  || 0);
    if (form.workerType === "Hourly Worker") return r * (Number(form.workingHours) || 0);
    return r;
};

export { calcTotal };

export default function WageForm({ form, setForm, workers, submitting, onSubmit }) {
    const liveTotal = calcTotal(form);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-violet-50">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-indigo-500" /> New Wage Entry
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Select a registered worker and enter details</p>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-4">

                {/* Worker dropdown */}
                <div>
                    <label className={labelCls}>Worker Name *</label>
                    <select required value={form.workerId}
                        onChange={e => setForm(f => ({ ...f, workerId: e.target.value }))}
                        className={inputCls + " cursor-pointer font-medium"}>
                        <option value="">— Select Registered Worker —</option>
                        {workers.map(w => (
                            <option key={w._id} value={w._id}>{w.fullName} · {w.phone}</option>
                        ))}
                    </select>
                    {workers.length === 0 && (
                        <p className="text-xs text-amber-600 mt-1">⚠ No workers registered yet. Use the panel on the left.</p>
                    )}
                </div>

                {/* Worker Type */}
                <div>
                    <label className={labelCls}><Briefcase className="w-3.5 h-3.5 text-indigo-500" /> Worker Type</label>
                    <div className="grid grid-cols-3 gap-2">
                        {WORKER_TYPES.map(type => (
                            <button key={type} type="button"
                                onClick={() => setForm(f => ({ ...f, workerType: type, workingDays: "", workingHours: "" }))}
                                className={`py-2 px-1 rounded-xl text-xs font-bold border-2 transition-all ${
                                    form.workerType === type
                                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                                }`}>
                                {type.split(" ")[0]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date Range */}
                <div>
                    <label className={labelCls}><CalendarDays className="w-3.5 h-3.5 text-indigo-500" /> Work Period *</label>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">From</p>
                            <input type="date" required value={form.dateFrom}
                                onChange={e => setForm(f => ({ ...f, dateFrom: e.target.value }))}
                                className={inputCls} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">To</p>
                            <input type="date" required value={form.dateTo} min={form.dateFrom}
                                onChange={e => setForm(f => ({ ...f, dateTo: e.target.value }))}
                                className={inputCls} />
                        </div>
                    </div>
                </div>

                {/* Working Days — Daily only */}
                {form.workerType === "Daily Worker" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className={labelCls}><CalendarDays className="w-3.5 h-3.5 text-indigo-500" /> Working Days *</label>
                        <input type="number" required min="0" step="1" placeholder="e.g. 26"
                            value={form.workingDays}
                            onChange={e => setForm(f => ({ ...f, workingDays: e.target.value }))}
                            className={inputCls + " font-mono"} />
                    </div>
                )}

                {/* Working Hours — Hourly only */}
                {form.workerType === "Hourly Worker" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className={labelCls}><Clock className="w-3.5 h-3.5 text-indigo-500" /> Working Hours *</label>
                        <input type="number" required min="0" step="0.5" placeholder="e.g. 40"
                            value={form.workingHours}
                            onChange={e => setForm(f => ({ ...f, workingHours: e.target.value }))}
                            className={inputCls + " font-mono"} />
                    </div>
                )}

                {/* Rate Amount */}
                <div>
                    <label className={labelCls}><IndianRupee className="w-3.5 h-3.5 text-indigo-500" /> {rateLabel(form.workerType)} *</label>
                    <input type="number" required min="1" step="0.01" placeholder="0.00"
                        value={form.rateAmount}
                        onChange={e => setForm(f => ({ ...f, rateAmount: e.target.value }))}
                        className={inputCls + " font-mono"} />
                </div>

                {/* Live Total */}
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-4 border border-indigo-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-0.5">Total Payable</p>
                        <p className="text-2xl font-black text-slate-900">₹{liveTotal.toLocaleString("en-IN")}</p>
                    </div>
                    <p className="text-xs text-slate-400">
                        {form.workerType === "Daily Worker"  && `${form.rateAmount || 0} × ${form.workingDays || 0} days`}
                        {form.workerType === "Hourly Worker" && `${form.rateAmount || 0} × ${form.workingHours || 0} hrs`}
                        {form.workerType === "Freelancer"    && "Fixed flat rate"}
                    </p>
                </div>

                {/* Submit */}
                <button type="submit" disabled={submitting}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 text-white font-extrabold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                    {submitting
                        ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
                        : <><Plus className="w-4 h-4" /> Create Wage Record</>}
                </button>
            </form>
        </div>
    );
}
