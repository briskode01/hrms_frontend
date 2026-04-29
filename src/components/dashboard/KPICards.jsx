// @ts-nocheck
// client/src/components/dashboard/KPICards.jsx
// ─────────────────────────────────────────────────────────────

import { FaCalendarCheck, FaChartLine, FaUsers, FaWallet } from "react-icons/fa";

const fmt = (n) => (n || 0).toLocaleString("en-IN");
const fmtCurrency = (n) =>
    "₹" + (n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

function KPICard({ icon, label, value, sub, gradient, iconBg }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4 hover:shadow-md transition-shadow duration-300 group">
            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center text-2xl shrink-0 shadow-lg ${gradient} group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <div className="flex flex-col min-w-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5 truncate">{value}</p>
                {sub && <p className="text-xs text-slate-400 mt-1 truncate">{sub}</p>}
            </div>
        </div>
    );
}

export default function KPICards({ employees, attendance, payroll, performance, leaves }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <KPICard
                icon={<FaUsers className="text-xl" />}
                label="Total Employees"
                value={fmt(employees.total)}
                sub={`${employees.active} active · ${employees.onLeave} on leave`}
                iconBg="bg-blue-500/10"
                gradient="shadow-blue-500/30"
            />
            <KPICard
                icon={<FaCalendarCheck className="text-xl" />}
                label="Today's Attendance"
                value={fmt(attendance.present + attendance.late)}
                sub={`${attendance.absent} absent · ${leaves?.pendingRequests || 0} leave requests`}
                iconBg="bg-emerald-500/10"
                gradient="shadow-emerald-500/30"
            />
            <KPICard
                icon={<FaWallet className="text-xl" />}
                label="Monthly Payroll"
                value={fmtCurrency(payroll.totalExpense)}
                sub={`${payroll.paid} paid · ${payroll.pending} pending`}
                iconBg="bg-amber-500/10"
                gradient="shadow-amber-500/30"
            />
            <KPICard
                icon={<FaChartLine className="text-xl" />}
                label="Avg Performance"
                value={`${performance.avgScore}%`}
                sub={`${performance.totalReviews} reviews this year`}
                iconBg="bg-violet-500/10"
                gradient="shadow-violet-500/30"
            />
        </div>
    );
}
