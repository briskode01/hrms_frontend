// @ts-nocheck
// client/src/components/wages/WorkerPanel.jsx
// Left panel: Register a new worker + list existing workers

import { useState } from "react";
import { UserPlus, Phone, Landmark, Trash2, User, ChevronDown, ChevronUp } from "lucide-react";
import API from "@/api/axios";
import toast from "react-hot-toast";

const EMPTY = { fullName: "", phone: "", bank: { name: "", account: "", ifsc: "" } };

function getAvatarBg(name = "") {
    const c = ["bg-violet-500","bg-blue-500","bg-emerald-500","bg-rose-500","bg-amber-500","bg-cyan-500"];
    return c[name.charCodeAt(0) % c.length] || "bg-slate-400";
}

export default function WorkerPanel({ workers, onWorkerCreated, onWorkerDeleted }) {
    const [form, setForm]       = useState(EMPTY);
    const [saving, setSaving]   = useState(false);
    const [open, setOpen]       = useState(true);

    const set   = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const setB  = (k, v) => setForm(f => ({ ...f, bank: { ...f.bank, [k]: v } }));

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.fullName.trim() || !form.phone.trim()) {
            toast.error("Name and phone are required"); return;
        }
        setSaving(true);
        try {
            const { data } = await API.post("/workers", form);
            toast.success("Worker registered! ✅");
            onWorkerCreated(data.data);
            setForm(EMPTY);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to register worker");
        } finally { setSaving(false); }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Remove worker "${name}"?`)) return;
        try {
            await API.delete(`/workers/${id}`);
            toast.success("Worker removed");
            onWorkerDeleted(id);
        } catch { toast.error("Failed to remove worker"); }
    };

    const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all";
    const labelCls = "text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block";

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-indigo-500" />
                    <span className="font-extrabold text-slate-900">Register Worker</span>
                </div>
                {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Registration Form */}
            {open && (
                <form onSubmit={handleCreate} className="p-6 space-y-4 border-b border-slate-100">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <label className={labelCls}><User className="inline w-3 h-3 mr-1" />Full Name *</label>
                            <input className={inputCls} placeholder="e.g. Raju Kumar" value={form.fullName}
                                onChange={e => set("fullName", e.target.value)} />
                        </div>
                        <div className="col-span-2">
                            <label className={labelCls}><Phone className="inline w-3 h-3 mr-1" />Phone *</label>
                            <input className={inputCls} placeholder="e.g. 9876543210" value={form.phone}
                                onChange={e => set("phone", e.target.value)} />
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div>
                        <label className={labelCls}><Landmark className="inline w-3 h-3 mr-1" />Bank Details (optional)</label>
                        <div className="space-y-2">
                            <input className={inputCls} placeholder="Bank Name (e.g. SBI)" value={form.bank.name}
                                onChange={e => setB("name", e.target.value)} />
                            <input className={inputCls} placeholder="Account Number" value={form.bank.account}
                                onChange={e => setB("account", e.target.value)} />
                            <input className={inputCls} placeholder="IFSC Code" value={form.bank.ifsc}
                                onChange={e => setB("ifsc", e.target.value)} />
                        </div>
                    </div>

                    <button type="submit" disabled={saving}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                        {saving ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</> : <><UserPlus className="w-4 h-4" /> Register Worker</>}
                    </button>
                </form>
            )}

            {/* Workers List */}
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {workers.length === 0 ? (
                    <p className="text-center text-slate-400 text-sm py-8">No workers yet. Register one above.</p>
                ) : workers.map(w => (
                    <div key={w._id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 group">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${getAvatarBg(w.fullName)} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                                {w.fullName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">{w.fullName}</p>
                                <p className="text-xs text-slate-400">{w.phone}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(w._id, w.fullName)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
