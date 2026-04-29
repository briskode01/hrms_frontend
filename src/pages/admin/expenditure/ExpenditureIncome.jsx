// @ts-nocheck
import { useState } from "react";
import { useExpenditure, today } from "./ExpenditureContext";
import { Plus, Pencil, Trash2, X, Filter } from "lucide-react";

const SOURCES  = ["Client Payment", "Project Payment", "Retainer Fee", "Product Sale", "Consulting", "Other"];
const METHODS  = ["Bank Transfer", "UPI", "Cash", "Cheque", "Card"];

const blank = () => ({ source: "Client Payment", clientName: "", amount: "", date: today(), method: "Bank Transfer", description: "" });

function IncomeModal({ initial, onSave, onClose }) {
    const [form, setForm] = useState(initial || blank());
    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
    const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all";

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="font-extrabold text-slate-800">{initial?.id ? "Edit Income" : "Add Income"}</h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
                </div>
                <div className="px-6 py-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Source</label>
                            <select className={inputCls} value={form.source} onChange={e => set("source", e.target.value)}>
                                {SOURCES.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Payment Method</label>
                            <select className={inputCls} value={form.method} onChange={e => set("method", e.target.value)}>
                                {METHODS.map(m => <option key={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Client / Company Name</label>
                        <input className={inputCls} value={form.clientName} onChange={e => set("clientName", e.target.value)} placeholder="e.g. Infosys Ltd" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Amount (₹)</label>
                            <input type="number" className={inputCls} value={form.amount} onChange={e => set("amount", e.target.value)} placeholder="0" min="0" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Date</label>
                            <input type="date" className={inputCls} value={form.date} onChange={e => set("date", e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Description</label>
                        <textarea className={inputCls} value={form.description || ""} onChange={e => set("description", e.target.value)} placeholder="Optional details..." rows={2} />
                    </div>
                </div>
                <div className="px-6 pb-5 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-sm font-bold text-slate-600 transition-colors">Cancel</button>
                    <button onClick={() => { if (!form.clientName || !form.amount) return; onSave(form); onClose(); }}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors">
                        {initial?.id ? "Update" : "Add Income"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ExpenditureIncome() {
    const { income, addIncome, editIncome, deleteIncome, fmtINR } = useExpenditure();
    const [modal, setModal]       = useState(null);
    const [filterSrc, setFilterSrc] = useState("All");
    const [filterDate, setFilterDate] = useState("");

    const filtered = income.filter(i =>
        (filterSrc === "All" || i.source === filterSrc) &&
        (!filterDate || i.date === filterDate)
    );
    const total = filtered.reduce((s, i) => s + Number(i.amount), 0);

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-800">Income</h2>
                    <p className="text-sm text-slate-400 mt-0.5">Track all incoming revenue and payments</p>
                </div>
                <button onClick={() => setModal("add")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-200 transition-all">
                    <Plus size={16} /> Add Income
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100 shadow-sm flex flex-wrap gap-3 items-center">
                <Filter size={15} className="text-slate-400" />
                <select value={filterSrc} onChange={e => setFilterSrc(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-emerald-400 transition-all">
                    <option value="All">All Sources</option>
                    {SOURCES.map(s => <option key={s}>{s}</option>)}
                </select>
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-emerald-400 transition-all" />
                {(filterSrc !== "All" || filterDate) && (
                    <button onClick={() => { setFilterSrc("All"); setFilterDate(""); }}
                        className="text-xs text-emerald-600 font-bold hover:underline">Clear</button>
                )}
                <span className="ml-auto text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                    {filtered.length} records · Total: {fmtINR(total)}
                </span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="text-left px-5 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Client / Company</th>
                                <th className="text-left px-4 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Description</th>
                                <th className="text-left px-4 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Source</th>
                                <th className="text-left px-4 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="text-left px-4 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Method</th>
                                <th className="text-right px-5 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-4 py-3.5" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-sm">No income records found.</td></tr>
                            ) : filtered.map(inc => (
                                <tr key={inc._id || inc.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3.5 font-semibold text-slate-700">{inc.clientName}</td>
                                    <td className="px-4 py-3.5 text-slate-500 text-xs truncate max-w-[150px]" title={inc.description}>{inc.description || "-"}</td>
                                    <td className="px-4 py-3.5">
                                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">{inc.source}</span>
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-500">{inc.date}</td>
                                    <td className="px-4 py-3.5">
                                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">{inc.method}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right font-extrabold text-emerald-600">{fmtINR(inc.amount)}</td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => setModal(inc)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors">
                                                <Pencil size={13} />
                                            </button>
                                            <button onClick={() => deleteIncome(inc._id || inc.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors">
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modal === "add" && <IncomeModal onSave={addIncome} onClose={() => setModal(null)} />}
            {modal && modal !== "add" && <IncomeModal initial={modal} onSave={editIncome} onClose={() => setModal(null)} />}
        </div>
    );
}
