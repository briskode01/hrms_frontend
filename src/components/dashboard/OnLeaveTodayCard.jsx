// @ts-nocheck

export default function OnLeaveTodayCard({ requests = [], activeCount = 0 }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const onLeaveToday = requests
        .filter((request) => {
            if (request?.status !== "Approved") return false;
            const start = new Date(request.startDate);
            const end = new Date(request.endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            return start <= today && end >= today;
        })
        .filter((request, index, list) => {
            const employeeId = request?.employee?._id;
            if (!employeeId) return true;
            return list.findIndex((item) => item?.employee?._id === employeeId) === index;
        })
        .slice(0, 5);

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-700">On Leave Today</h3>
                <span className="text-sm font-bold text-slate-400">{activeCount}</span>
            </div>

            {onLeaveToday.length > 0 ? (
                <div className="mt-4 flex items-start gap-4">
                    {onLeaveToday.map((request) => {
                        const employee = request.employee || {};
                        const firstName = employee.firstName || "Employee";
                        const lastName = employee.lastName || "";
                        const initials = `${firstName[0] || "E"}${lastName[0] || ""}`.toUpperCase();

                        return (
                            <div key={request._id} className="w-14 text-center">
                                <div className="relative mx-auto h-10 w-10 rounded-full bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center">
                                    {initials}
                                    <span className="absolute -right-0.5 bottom-0 h-2.5 w-2.5 rounded-full border border-white bg-sky-400" />
                                </div>
                                <p className="mt-1 text-xs font-semibold text-slate-500 truncate">
                                    {firstName}
                                </p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="mt-4 text-sm text-slate-400">No approved leaves for today</p>
            )}
        </div>
    );
}
