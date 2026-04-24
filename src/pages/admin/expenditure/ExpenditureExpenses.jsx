// @ts-nocheck
import { useState } from "react";
import { useExpenditure, today } from "./ExpenditureContext";
import { Plus, Pencil, Trash2, X, Filter } from "lucide-react";

const CATEGORIES = ["Office Supplies", "IT & Software", "Transport", "Food & Entertainment", "Maintenance", "Marketing", "Raw Material", "Utilities", "Other"];
const MODES = ["Cash", "UPI", "Bank Transfer", "Cheque", "Card"];

const blank = () => ({ title: "", category: "Office Supplies", amount: "", date: today(), mode: "UPI", description: "" });

function ExpenseModal({ initial, onSave, onClose }) {
    const [form, setForm] = useState(initial || blank());
    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
    const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all";

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="font-extrabold text-slate-800">{initial?.id ? "Edit Expense" : "Add Expense"}</h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
                </div>
                <div className="px-6 py-5 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Title</label>
                        <input className={inputCls} value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Office Printer Paper" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Category</label>
                            <select className={inputCls} value={form.category} onChange={e => set("category", e.target.value)}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Payment Mode</label>
                            <select className={inputCls} value={form.mode} onChange={e => set("mode", e.target.value)}>
                                {MODES.map(m => <option key={m}>{m}</option>)}
                            </select>
                        </div>
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
                        <textarea rows={2} className={inputCls + " resize-none"} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Optional notes..." />
                    </div>
                </div>
                <div className="px-6 pb-5 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-sm font-bold text-slate-600 transition-colors">Cancel</button>
                    <button onClick={() => { if (!form.title || !form.amount) return; onSave(form); onClose(); }}
                        className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors">
                        {initial?.id ? "Update" : "Add Expense"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ExpenditureExpenses() {
    const { expenses, addExpense, editExpense, deleteExpense, fmtINR } = useExpenditure();
    const [modal, setModal] = useState(null); // null | "add" | expense object
    const [filterCat, setFilterCat] = useState("All");
    const [filterDate, setFilterDate] = useState("");

    const filtered = expenses.filter(e =>
        (filterCat === "All" || e.category === filterCat) &&
        (!filterDate || e.date === filterDate)
    );

    const total = filtered.reduce((s, e) => s + Number(e.amount), 0);

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-800">Expenses</h2>
                    <p className="text-sm text-slate-400 mt-0.5">Track and manage all business expenditures</p>
                </div>
                <button onClick={() => setModal("add")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition-all">
                    <Plus size={16} /> Add Expense
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl px-5 py-4 border border-slate-100 shadow-sm flex flex-wrap gap-3 items-center">
                <Filter size={15} className="text-slate-400" />
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 transition-all">
                    <option value="All">All Categories</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 transition-all" />
                {(filterCat !== "All" || filterDate) && (
                    <button onClick={() => { setFilterCat("All"); setFilterDate(""); }}
                        className="text-xs text-indigo-600 font-bold hover:underline">Clear</button>
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
                                <th className="text-left px-5 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Title</th>
                                <th className="text-left px-4 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="text-left px-4 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="text-left px-4 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Mode</th>
                                <th className="text-right px-5 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-4 py-3.5" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-sm">No expenses found. Add your first expense!</td></tr>
                            ) : filtered.map(exp => (
                                <tr key={exp._id || exp.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <p className="font-semibold text-slate-700">{exp.title}</p>
                                        {exp.description && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[180px]">{exp.description}</p>}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">{exp.category}</span>
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-500">{exp.date}</td>
                                    <td className="px-4 py-3.5">
                                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">{exp.mode}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right font-extrabold text-rose-600">{fmtINR(exp.amount)}</td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => setModal(exp)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors">
                                                <Pencil size={13} />
                                            </button>
                                            <button onClick={() => deleteExpense(exp._id || exp.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors">
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

            {/* Modal */}
            {modal === "add" && <ExpenseModal onSave={addExpense} onClose={() => setModal(null)} />}
            {modal && modal !== "add" && (
                <ExpenseModal initial={modal} onSave={editExpense} onClose={() => setModal(null)} />
            )}
        </div>
    );
}
