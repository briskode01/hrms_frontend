// @ts-nocheck
import { STATUS_STYLES } from "../shared/constants";
import { formatTime } from "../shared/utils";

export default function AttendancePanel({ attendance, attendStats, attendanceRate, setActiveTab }) {
  return (
    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900">Recent Attendance</h3>
            <p className="text-xs text-slate-400 mt-0.5">Latest entries from this month</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            {attendStats.present + attendStats.late} hrs logged
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 mt-4">
          {[
            { label: "Present", val: attendStats.present, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
            { label: "Late", val: attendStats.late, color: "bg-amber-50 text-amber-700 border-amber-100" },
            { label: "Half Day", val: attendStats.halfDay, color: "bg-blue-50 text-blue-700 border-blue-100" },
            { label: "On Leave", val: attendStats.onLeave, color: "bg-violet-50 text-violet-700 border-violet-100" },
            { label: "Absent", val: attendStats.absent, color: "bg-red-50 text-red-600 border-red-100" },
          ].map((summary) => (
            <div key={summary.label} className={`rounded-xl border p-2.5 text-center ${summary.color}`}>
              <p className="text-lg font-extrabold">{summary.val}</p>
              <p className="text-[10px] font-bold opacity-80 mt-0.5">{summary.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-slate-500">Monthly attendance</span>
            <span className="text-xs font-bold text-blue-600">{attendanceRate}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-50">
        {attendance.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm font-medium">No attendance records this month</p>
          </div>
        ) : (
          attendance.map((record) => {
            const status = STATUS_STYLES[record.status] || STATUS_STYLES["Not Marked"];
            return (
              <div key={record._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${status.bg} flex items-center justify-center shrink-0`}>
                    <span className={`text-xs font-extrabold ${status.text}`}>{new Date(record.date).getDate()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {new Date(record.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatTime(record.checkIn)} → {formatTime(record.checkOut)}
                      {record.hoursWorked > 0 && ` · ${record.hoursWorked}h`}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text}`}>{record.status}</span>
              </div>
            );
          })
        )}
      </div>

      {attendance.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-100">
          <button
            onClick={() => setActiveTab("attendance")}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View full attendance log →
          </button>
        </div>
      )}
    </div>
  );
}
