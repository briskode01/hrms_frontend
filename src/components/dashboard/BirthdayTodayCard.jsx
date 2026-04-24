// @ts-nocheck

export default function BirthdayTodayCard({ employees = [] }) {
    if (!employees || employees.length === 0) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🎂</span>
                    <h3 className="text-base font-extrabold text-slate-700">Birthdays Today</h3>
                </div>
                <p className="text-sm text-slate-400">No birthdays today</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-pink-50 via-white to-amber-50 px-5 py-4 shadow-sm">
            {/* ── Header ─────────────────────────────────── */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🎂</span>
                    <h3 className="text-base font-extrabold text-slate-700">Birthdays Today</h3>
                </div>
                <span className="inline-flex items-center justify-center rounded-full bg-pink-100 text-pink-600 text-xs font-bold h-6 w-6">
                    {employees.length}
                </span>
            </div>

            {/* ── Employee Cards ──────────────────────────── */}
            <div className="space-y-3">
                {employees.map((emp) => {
                    const initials = `${emp.firstName?.[0] || ""}${emp.lastName?.[0] || ""}`.toUpperCase();
                    const age = emp.dateOfBirth
                        ? new Date().getFullYear() - new Date(emp.dateOfBirth).getFullYear()
                        : null;

                    return (
                        <div
                            key={emp._id || emp.employeeId}
                            className="flex items-center gap-3 rounded-lg bg-white/70 border border-pink-100 px-3 py-2.5 transition hover:shadow-sm"
                        >
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                {emp.avatar ? (
                                    <img
                                        src={emp.avatar}
                                        alt={`${emp.firstName} ${emp.lastName}`}
                                        className="h-10 w-10 rounded-full object-cover border-2 border-pink-200"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 to-amber-400 text-white font-bold text-xs flex items-center justify-center border-2 border-pink-200">
                                        {initials}
                                    </div>
                                )}
                                <span className="absolute -top-1 -right-1 text-sm">🎈</span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-700 truncate">
                                    {emp.firstName} {emp.lastName}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                    {emp.designation}{emp.department ? ` · ${emp.department}` : ""}
                                </p>
                            </div>

                            {/* Age Badge */}
                            {age && (
                                <span className="flex-shrink-0 text-xs font-semibold text-amber-600 bg-amber-50 rounded-full px-2 py-0.5">
                                    🎉 {age}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
