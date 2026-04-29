// @ts-nocheck
import { formatCheckInTime } from "./constants";
import { STATUS_TONE } from "./attendanceHelpers";

export default function TodayCheckInCard({
    todayRecord,
    displayStatus,
    todayStatus,
    canCheckIn,
    canCheckOut,
    actionLoading,
    onCheckIn,
    onCheckOut,
}) {
    return (
        <section className="rounded-3xl bg-white/80 border border-slate-200 shadow-sm p-5 backdrop-blur-[1px]">
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h3 className="text-lg font-extrabold text-slate-900">Today</h3>
                    <p className="text-sm text-slate-500 mt-1">Check in and check out for today only</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${STATUS_TONE[displayStatus] ?? STATUS_TONE[todayStatus]}`}>
                    {displayStatus}
                </span>
            </div>

            {/* Time info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {[
                    ["Check In",  formatCheckInTime(todayRecord?.checkIn)],
                    ["Check Out", formatCheckInTime(todayRecord?.checkOut)],
                    ["Hours",     `${todayRecord?.hoursWorked || 0} hrs`],
                ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-slate-200 bg-white/85 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">{label}</p>
                        <p className="text-lg font-extrabold text-slate-900 mt-2">{value}</p>
                    </div>
                ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mt-5">
                <button
                    onClick={onCheckIn}
                    disabled={!canCheckIn || actionLoading === "check-in"}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
                >
                    {actionLoading === "check-in"
                        ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Checking in...</>
                        : "Check In"}
                </button>
                <button
                    onClick={onCheckOut}
                    disabled={!canCheckOut || actionLoading === "check-out"}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
                >
                    {actionLoading === "check-out"
                        ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Checking out...</>
                        : "Check Out"}
                </button>
            </div>
        </section>
    );
}
