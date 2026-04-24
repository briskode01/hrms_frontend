// @ts-nocheck
import LeaveStatsWidget from "../components/employee/dashboard/sections/LeaveStatsWidget";

const EMP_STATUS_TONES = {
    Active: "bg-emerald-500/20 text-emerald-400",
    "On Leave": "bg-sky-500/20 text-sky-400",
    Inactive: "bg-slate-500/20 text-slate-400",
};

export default function EmployeeProfileCard({ empProfile, employeeId, onLogout, onViewAllLeaves }) {
    return (
        <>
            <div className="px-3 py-2 bg-slate-800/60 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8.5 h-8.5 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 text-white text-sm font-extrabold flex items-center justify-center shrink-0 select-none">
                        {empProfile.firstName?.[0]}{empProfile.lastName?.[0]}
                    </div>
                    <div className="overflow-hidden flex-1 min-w-0">
                        <p className="text-white text-[12px] font-extrabold truncate">{empProfile.firstName} {empProfile.lastName}</p>
                        <p className="text-slate-400 text-[11px] truncate">{empProfile.designation}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                    <div className="bg-slate-700/60 rounded-lg px-2 py-1">
                        <p className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">ID</p>
                        <p className="text-slate-200 text-[11px] font-bold mt-0.5 font-mono truncate">{empProfile.employeeId}</p>
                    </div>
                    <div className="bg-slate-700/60 rounded-lg px-2 py-1">
                        <p className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Dept</p>
                        <p className="text-slate-200 text-[11px] font-bold mt-0.5 truncate">{empProfile.department}</p>
                    </div>
                    <div className="bg-slate-700/60 rounded-lg px-2 py-1">
                        <p className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Type</p>
                        <p className="text-slate-200 text-[11px] font-bold mt-0.5 truncate">{empProfile.employmentType}</p>
                    </div>
                    {empProfile.phone ? (
                        <div className="bg-slate-700/60 rounded-lg px-2 py-1">
                            <p className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Phone</p>
                            <p className="text-slate-200 text-[11px] font-bold mt-0.5 truncate">{empProfile.phone}</p>
                        </div>
                    ) : (
                        <div className="bg-slate-700/60 rounded-lg px-2 py-1">
                            <p className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Email</p>
                            <p className="text-slate-200 text-[11px] font-bold mt-0.5 truncate">{empProfile.email}</p>
                        </div>
                    )}
                </div>
                {empProfile.address && (
                    <div className="bg-slate-700/60 rounded-lg px-2 py-1">
                        <p className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Address</p>
                        <p className="text-slate-200 text-[11px] font-bold mt-0.5 leading-4 line-clamp-1">{empProfile.address}</p>
                    </div>
                )}
                <div className="flex items-center justify-between pt-0">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${EMP_STATUS_TONES[empProfile.status] || "bg-slate-500/20 text-slate-400"}`}>
                        {empProfile.status}
                    </span>
                    <button onClick={onLogout} className="text-xs text-slate-500 hover:text-red-400 font-bold transition-colors">
                        Sign out
                    </button>
                </div>
            </div>

            {/* Leave Stats Widget */}
            <LeaveStatsWidget
                employeeId={employeeId}
                onViewAll={onViewAllLeaves}
            />
        </>
    );
}
