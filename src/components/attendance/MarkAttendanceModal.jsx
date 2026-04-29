// @ts-nocheck
// client/src/components/attendance/MarkAttendanceModal.jsx

import { STATUS_OPTIONS, STATUS_ICONS, LEAVE_TYPES, formatDate } from "./constants";

export default function MarkAttendanceModal({ form, setForm, employees, selectedDate, onSubmit, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900">Mark Attendance</h2>
                        <p className="text-xs text-slate-400 mt-0.5">{formatDate(selectedDate)}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl text-lg font-bold transition-colors">✕</button>
                </div>

                <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
                    {/* Employee Select */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Employee <span className="text-red-500">*</span></label>
                        <select
                            required
                            value={form.employee}
                            onChange={(e) => setForm((p) => ({ ...p, employee: e.target.value }))}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                        >
                            <option value="">-- Select Employee --</option>
                            {employees.map((emp) => (
                                <option key={emp._id} value={emp._id}>
                                    {emp.firstName} {emp.lastName} ({emp.employeeId})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-3 gap-2">
                            {STATUS_OPTIONS.map((s) => (
                                <button
                                    type="button"
                                    key={s}
                                    onClick={() => setForm((p) => ({ ...p, status: s }))}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all
                                        ${form.status === s
                                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                                            : "border-slate-200 text-slate-500 hover:border-slate-300"
                                        }`}
                                >
                                    {STATUS_ICONS[s]} {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Check In / Out */}
                    {["Present", "Late", "Half Day"].includes(form.status) && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Check In</label>
                                <input type="time" value={form.checkIn}
                                    onChange={(e) => setForm((p) => ({ ...p, checkIn: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Check Out</label>
                                <input type="time" value={form.checkOut}
                                    onChange={(e) => setForm((p) => ({ ...p, checkOut: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors" />
                            </div>
                        </div>
                    )}

                    {/* Leave Type */}
                    {form.status === "On Leave" && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Leave Type</label>
                            <select value={form.leaveType}
                                onChange={(e) => setForm((p) => ({ ...p, leaveType: e.target.value }))}
                                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors">
                                {LEAVE_TYPES.map((l) => <option key={l} value={l}>{l || "-- Select Leave Type --"}</option>)}
                            </select>
                        </div>
                    )}

                    {/* Remarks */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Remarks</label>
                        <input type="text" placeholder="Optional note..." value={form.remarks}
                            onChange={(e) => setForm((p) => ({ ...p, remarks: e.target.value }))}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none placeholder-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors" />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold transition-colors">Cancel</button>
                        <button type="submit" className="flex-[2] py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold shadow-md shadow-blue-200 transition-all">Save Attendance</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
