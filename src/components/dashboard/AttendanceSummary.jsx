// @ts-nocheck
// client/src/components/dashboard/AttendanceSummary.jsx
// ─────────────────────────────────────────────────────────────

function AttendancePill({ label, count, color, bgColor }) {
    return (
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${bgColor}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span className="text-xs font-bold text-slate-600">{label}</span>
            <span className={`text-sm font-extrabold ml-auto ${color.replace("bg-", "text-")}`}>{count}</span>
        </div>
    );
}

export default function AttendanceSummary({ attendance }) {
    const total = attendance.present + attendance.late + attendance.absent + attendance.onLeave + attendance.halfDay;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-base font-extrabold text-slate-900">Today's Attendance</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Status breakdown for today</p>
                </div>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg">
                    Live
                </span>
            </div>

            <div className="space-y-3">
                <AttendancePill label="Present" count={attendance.present} color="bg-emerald-500" bgColor="bg-emerald-50" />
                <AttendancePill label="Late" count={attendance.late} color="bg-amber-500" bgColor="bg-amber-50" />
                <AttendancePill label="Absent" count={attendance.absent} color="bg-red-500" bgColor="bg-red-50" />
                <AttendancePill label="On Leave" count={attendance.onLeave} color="bg-blue-500" bgColor="bg-blue-50" />
                <AttendancePill label="Half Day" count={attendance.halfDay} color="bg-violet-500" bgColor="bg-violet-50" />
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Total marked today</span>
                <span className="text-sm font-extrabold text-slate-700">{total}</span>
            </div>
        </div>
    );
}
