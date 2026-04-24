import { useState, useEffect } from "react";
import { useExpenditure, today } from "./ExpenditureContext";
import { Plus, Pencil, Trash2, X, CheckCircle } from "lucide-react";
import API from "../../../api/axios";

const DEDUCTION_TYPES = ["Full", "Installments"];

const blank = () => ({
    employee: "",
    amount: "",
    date: today(),
    deductionType: "Full",
    installmentAmount: "",
});

function AdvanceModal({ initial, onSave, onClose }) {
    const [form, setForm] = useState(initial || blank());
    const [employees, setEmployees] = useState([]);
    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
    const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all";

    useEffect(() => {
        API.get("/employees").then(res => {
            setEmployees(res.data?.data || []);
            if (!initial && res.data?.data?.length > 0) {
                set("employee", res.data.data[0]._id);
            }
        }).catch(() => {});
    }, []);

    const handleEmpChange = (e) => set("employee", e.target.value);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="font-extrabold text-slate-800">{initial?.id ? "Edit Advance" : "Give Advance"}</h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
                </div>
                <div className="px-6 py-5 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Employee</label>
                        <select className={inputCls}
                            value={typeof form.employee === "object" ? form.employee._id : form.employee}
                            onChange={handleEmpChange}>
                            <option value="">Select employee...</option>
                            {employees.map(e => (
                                <option key={e._id} value={e._id}>{e.firstName} {e.lastName} ({e.employeeId})</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Advance Amount (₹)</label>
                            <input type="number" className={inputCls} value={form.amount} onChange={e => set("amount", e.target.value)} placeholder="0" min="0" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Date</label>
                            <input type="date" className={inputCls} value={form.date} onChange={e => set("date", e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Deduction Type</label>
                        <div className="flex gap-3">
                            {DEDUCTION_TYPES.map(t => (
                                <button key={t} onClick={() => set("deductionType", t)}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${form.deductionType === t ? "bg-amber-500 text-white border-amber-500" : "bg-slate-50 text-slate-600 border-slate-200 hover:border-amber-300"}`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    {form.deductionType === "Installments" && (
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Monthly Installment Amount (₹)</label>
                            <input type="number" className={inputCls} value={form.installmentAmount} onChange={e => set("installmentAmount", e.target.value)} placeholder="0" min="0" />
                        </div>
                    )}
                </div>
                <div className="px-6 pb-5 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-sm font-bold text-slate-600 transition-colors">Cancel</button>
                    <button onClick={() => { if (!form.amount) return; onSave(form); onClose(); }}
                        className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold transition-colors">
                        {initial?.id ? "Update" : "Give Advance"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ExpenditureAdvances() {
    const { advances, addAdvance, editAdvance, deleteAdvance, clearAdvance, fmtINR, pendingAdvancesCount } = useExpenditure();
    const [modal, setModal] = useState(null);
    const [filterStatus, setFilterStatus] = useState("All");

    const filtered = advances.filter(a => filterStatus === "All" || a.status === filterStatus);

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-extrabold text-slate-800">Advances</h2>
                        {pendingAdvancesCount > 0 && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-extrabold animate-pulse">
                                {pendingAdvancesCount} Pending
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-400 mt-0.5">Manage salary advances given to employees</p>
                </div>
                <button onClick={() => setModal("add")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold shadow-md shadow-amber-200 transition-all">
                    <Plus size={16} /> Give Advance
                </button>
            </div>

            {/* Status filter tabs */}
            <div className="flex gap-2">
                {["All", "Active", "Cleared"].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterStatus === s ? "bg-amber-500 text-white shadow-md shadow-amber-200" : "bg-white text-slate-500 border border-slate-200 hover:border-amber-300"}`}>
                        {s}
                    </button>
                ))}
            </div>

            {/* Advances cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.length === 0 ? (
                    <div className="col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm py-14 flex flex-col items-center justify-center text-slate-400">
                        <div className="text-4xl mb-3">💰</div>
                        <p className="text-sm font-semibold">No advance records found.</p>
                    </div>
                ) : filtered.map(adv => {
                    const remaining = Number(adv.amount) - Number(adv.paid);
                    const pct = adv.amount > 0 ? Math.round((adv.paid / adv.amount) * 100) : 0;
                    return (
                        <div key={adv._id || adv.id} className={`bg-white rounded-2xl p-5 border shadow-sm ${adv.status === "Cleared" ? "border-emerald-100 opacity-75" : "border-amber-100"}`}>
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="font-extrabold text-slate-800">
                                        {adv.employee?.firstName
                                            ? `${adv.employee.firstName} ${adv.employee.lastName}`
                                            : adv.employee}
                                    </p>
                                    <p className="text-xs text-slate-400">{adv.employee?.employeeId || adv.employeeId} · {new Date(adv.date).toLocaleDateString("en-IN")}</p>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${adv.status === "Cleared" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                    {adv.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-500">Total Advance</span>
                                <span className="font-extrabold text-slate-700">{fmtINR(adv.amount)}</span>
                            </div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-slate-500">Remaining</span>
                                <span className={`font-extrabold ${remaining > 0 ? "text-amber-600" : "text-emerald-600"}`}>{fmtINR(remaining)}</span>
                            </div>
                            {/* Progress bar */}
                            <div className="w-full h-1.5 bg-slate-100 rounded-full mb-3">
                                <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                                <span>{adv.deductionType === "Installments" ? `₹${adv.installmentAmount}/month` : "Full deduction"}</span>
                                <span>{pct}% recovered</span>
                            </div>
                            <div className="flex gap-2">
                                {adv.status !== "Cleared" && (
                                    <button onClick={() => clearAdvance(adv._id || adv.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors">
                                        <CheckCircle size={13} /> Mark Cleared
                                    </button>
                                )}
                                <button onClick={() => setModal(adv)}
                                    className="flex items-center justify-center py-2 px-3 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-colors">
                                    <Pencil size={13} />
                                </button>
                                <button onClick={() => deleteAdvance(adv._id || adv.id)}
                                    className="flex items-center justify-center py-2 px-3 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors">
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {modal === "add" && <AdvanceModal onSave={addAdvance} onClose={() => setModal(null)} />}
            {modal && modal !== "add" && <AdvanceModal initial={modal} onSave={editAdvance} onClose={() => setModal(null)} />}
        </div>
    );
}
