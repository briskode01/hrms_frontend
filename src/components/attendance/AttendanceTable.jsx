// @ts-nocheck
// client/src/components/attendance/AttendanceTable.jsx

import { STATUS_STYLES, STATUS_ICONS, getAvatarColor, formatDate, formatCheckInTime } from "./constants";

export default function AttendanceTable({ records, loading, selectedDate, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Table header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="font-extrabold text-slate-900">Attendance Log</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(selectedDate)} · {records.length} records</p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                    <p className="text-sm font-medium">Loading attendance...</p>
                </div>
            ) : records.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <div className="text-5xl mb-3">📅</div>
                    <p className="text-base font-semibold text-slate-600">No records for this date</p>
                    <p className="text-sm mt-1">Use "Mark All Present" or "+ Mark Attendance" to add records</p>
                </div>
            ) : (
            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            {["Employee", "Status", "Check In", "Check Out", "Hours", "Leave Type", "Actions"].map((h) => (
                                <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {records.map((rec) => (
                            <tr key={rec._id} className="hover:bg-blue-50/40 transition-colors group">
                                {/* Employee */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full ${getAvatarColor(rec.employee?.firstName)} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>
                                            {rec.employee?.firstName?.[0]}{rec.employee?.lastName?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">
                                                {rec.employee?.firstName} {rec.employee?.lastName}
                                            </p>
                                            <p className="text-xs text-slate-400">{rec.employee?.employeeId} · {rec.employee?.department}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Status Badge */}
                                <td className="px-5 py-4">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[rec.status]}`}>
                                        <span>{STATUS_ICONS[rec.status]}</span>
                                        {rec.status}
                                    </span>
                                </td>

                                <td className="px-5 py-4 text-sm text-slate-600 font-medium">{formatCheckInTime(rec.checkIn)}</td>
                                <td className="px-5 py-4 text-sm text-slate-600 font-medium">{formatCheckInTime(rec.checkOut)}</td>
                                <td className="px-5 py-4 text-sm font-bold text-slate-800">
                                    {rec.hoursWorked > 0 ? `${rec.hoursWorked}h` : "—"}
                                </td>
                                <td className="px-5 py-4 text-xs text-slate-500">{rec.leaveType || "—"}</td>

                                {/* Actions */}
                                <td className="px-5 py-4">
                                    <div className="flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(rec)}
                                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition-colors"
                                        >Edit</button>
                                        <button
                                            onClick={() => onDelete(rec._id)}
                                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold rounded-lg transition-colors"
                                        >Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>
    );
}
