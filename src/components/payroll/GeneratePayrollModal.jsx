// @ts-nocheck
// client/src/components/payroll/GeneratePayrollModal.jsx

import { useEffect } from "react";
import { MONTHS, PAYMENT_METHODS, STATUS_OPTIONS } from "./constants";

const PF_RATE = 0.12;   // 12% of basic
const ESI_RATE = 0.0367; // 3.67% of basic

export default function GeneratePayrollModal({ form, setForm, employees, selectedMonth, selectedYear, onSubmit, onClose }) {

    // Auto-calculate PF and ESI whenever basic changes
    useEffect(() => {
        const basic = Number(form.earnings.basic) || 0;
        setForm((p) => ({
            ...p,
            deductions: {
                ...p.deductions,
                pf: Math.round(basic * PF_RATE),
                esi: Math.round(basic * ESI_RATE),
            },
        }));
    }, [form.earnings.basic]);

    const setEarning = (field, val) => setForm((p) => ({ ...p, earnings: { ...p.earnings, [field]: val } }));
    const setDeduction = (field, val) => setForm((p) => ({ ...p, deductions: { ...p.deductions, [field]: val } }));
    const setAttendance = (field, val) => setForm((p) => ({ ...p, attendance: { ...p.attendance, [field]: val } }));
    const setPayment = (field, val) => setForm((p) => ({ ...p, payment: { ...p.payment, [field]: val } }));

    const basic = Number(form.earnings.basic) || 0;
    const hraRupees = Math.round(basic * (Number(form.earnings.hraPercent) || 0) / 100);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900">Generate Payroll</h2>
                        <p className="text-xs text-slate-400 mt-0.5">{MONTHS[selectedMonth - 1]} {selectedYear}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl text-lg font-bold transition-colors">✕</button>
                </div>

                <form onSubmit={onSubmit} className="px-6 py-5 space-y-5">

                    {/* Employee */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Employee <span className="text-red-500">*</span></label>
                        <select required value={form.employeeId}
                            onChange={(e) => setForm((p) => ({ ...p, employeeId: e.target.value }))}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors">
                            <option value="">-- Select Employee --</option>
                            {employees.map((emp) => (
                                <option key={emp._id} value={emp._id}>
                                    {emp.firstName} {emp.lastName} ({emp.employeeId}) — ₹{emp.salary?.toLocaleString("en-IN")}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Attendance */}
                    <div>
                        <p className="text-xs font-extrabold text-cyan-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-4 h-0.5 bg-cyan-600 rounded" /> Attendance
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: "Working Days", field: "workingDays" },
                                { label: "Present Days", field: "presentDays" },
                                { label: "LOP Days", field: "lopDays" },
                            ].map(({ label, field }) => (
                                <div key={field}>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                                    <input type="number" min="0" placeholder="0"
                                        value={form.attendance[field] || ""}
                                        onChange={(e) => setAttendance(field, e.target.valueAsNumber || 0)}
                                        className="w-full px-3 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Earnings */}
                    <div>
                        <p className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-4 h-0.5 bg-emerald-600 rounded" /> Earnings
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            {/* Basic */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Basic (₹)</label>
                                <input type="number" min="0" placeholder="0"
                                    value={form.earnings.basic || ""}
                                    onChange={(e) => setEarning("basic", e.target.valueAsNumber || 0)}
                                    className="w-full px-3 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors" />
                            </div>

                            {/* HRA % + live ₹ preview */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    HRA (%) <span className="text-slate-400 font-normal normal-case">= ₹{hraRupees.toLocaleString("en-IN")}</span>
                                </label>
                                <input type="number" min="0" max="100" placeholder="0"
                                    value={form.earnings.hraPercent || ""}
                                    onChange={(e) => setEarning("hraPercent", e.target.valueAsNumber || 0)}
                                    className="w-full px-3 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors" />
                            </div>

                            {/* Bonus */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bonus (₹)</label>
                                <input type="number" min="0" placeholder="0"
                                    value={form.earnings.bonus || ""}
                                    onChange={(e) => setEarning("bonus", e.target.valueAsNumber || 0)}
                                    className="w-full px-3 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Deductions */}
                    <div>
                        <p className="text-xs font-extrabold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-4 h-0.5 bg-red-500 rounded" /> Deductions
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {/* PF — auto, editable */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    PF (12%) <span className="text-slate-400 font-normal normal-case">₹{form.deductions.pf.toLocaleString("en-IN")}</span>
                                </label>
                                <input type="number" min="0" placeholder="0"
                                    value={form.deductions.pf || ""}
                                    onChange={(e) => setDeduction("pf", e.target.valueAsNumber || 0)}
                                    className="w-full px-3 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors" />
                            </div>

                            {/* ESI — auto, editable */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    ESI (3.67%) <span className="text-slate-400 font-normal normal-case">₹{form.deductions.esi.toLocaleString("en-IN")}</span>
                                </label>
                                <input type="number" min="0" placeholder="0"
                                    value={form.deductions.esi || ""}
                                    onChange={(e) => setDeduction("esi", e.target.valueAsNumber || 0)}
                                    className="w-full px-3 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors" />
                            </div>

                            {/* P.Tax */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">P.Tax (₹)</label>
                                <input type="number" min="0" placeholder="0"
                                    value={form.deductions.ptax || ""}
                                    onChange={(e) => setDeduction("ptax", e.target.valueAsNumber || 0)}
                                    className="w-full px-3 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors" />
                            </div>

                            {/* Leave Deduction */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Leave Deduction (₹)</label>
                                <input type="number" min="0" placeholder="0"
                                    value={form.deductions.leaveDeduction || ""}
                                    onChange={(e) => setDeduction("leaveDeduction", e.target.valueAsNumber || 0)}
                                    className="w-full px-3 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                            <select value={form.payment.status}
                                onChange={(e) => setPayment("status", e.target.value)}
                                className="w-full px-3 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors">
                                {STATUS_OPTIONS.filter((s) => s !== "All").map((s) => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mode</label>
                            <select value={form.payment.mode}
                                onChange={(e) => setPayment("mode", e.target.value)}
                                className="w-full px-3 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors">
                                {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date</label>
                            <input type="date" value={form.payment.date}
                                onChange={(e) => setPayment("date", e.target.value)}
                                className="w-full px-3 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold transition-colors">
                            Cancel
                        </button>
                        <button type="submit"
                            className="flex-2 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold shadow-md shadow-blue-200 transition-all">
                            Generate Payroll
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
