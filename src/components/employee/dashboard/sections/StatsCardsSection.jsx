// @ts-nocheck
import CircleProgress from "../shared/CircleProgress";
import { MONTH_NAMES } from "../shared/constants";
import CountUp from "../shared/CountUp";
import { formatCurrency, formatTime } from "../shared/utils";

export default function StatsCardsSection({
  attendanceRate,
  attendStats,
  todayStyle,
  todayStatus,
  todayRecord,
  payroll,
  performance,
  gradeConfig,
}) {
  const grossSalary = Number(payroll?.earnings?.basic || 0)
    + Number(payroll?.earnings?.hra || 0)
    + Number(payroll?.earnings?.bonus || 0);
  const totalDeductions = Number(payroll?.deductions?.pf || 0)
    + Number(payroll?.deductions?.tax || 0);
  const netSalary = grossSalary - totalDeductions;
  const paymentStatus = payroll?.payment?.status || "Draft";

  const cards = [
    {
      type: "attendance",
      title: "Attendance Rate",
      attendanceRate,
      presentCount: attendStats.present + attendStats.late,
    },
    {
      type: "today",
      title: "Today\'s Status",
      todayStyle,
      todayStatus,
      todayRecord,
    },
    // {
    //   type: "payroll",
    //   title: "Latest Payroll",
    //   payroll,
    //   netSalary,
    //   paymentStatus,
    // },
    {
      type: "review",
      title: "Latest Review",
      performance,
      gradeConfig,
    },
    
  ];

  const renderCardContent = (card) => {
    if (card.type === "attendance") {
      return (
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <CircleProgress percent={card.attendanceRate} size={64} stroke={5} color="#3b82f6" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-extrabold text-slate-700">{card.attendanceRate}%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">
              <CountUp target={card.attendanceRate} suffix="%" />
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{card.presentCount} present this month</p>
          </div>
        </div>
      );
    }

    if (card.type === "today") {
      return (
        <>
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${card.todayStyle.dot}`} />
            <p className={`text-xl font-extrabold ${card.todayStyle.text}`}>{card.todayStatus}</p>
          </div>
          {card.todayRecord ? (
            <p className="text-xs text-slate-400">
              {formatTime(card.todayRecord.checkIn)} → {formatTime(card.todayRecord.checkOut)}
            </p>
          ) : (
            <p className="text-xs text-slate-400">No check-in recorded today</p>
          )}
        </>
      );
    }

    if (card.type === "payroll") {
      return card.payroll ? (
        <>
          <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(card.netSalary)}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${card.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-700"
                : card.paymentStatus === "Processed" ? "bg-blue-100 text-blue-700"
                  : card.paymentStatus === "Hold" ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-600"}`}
            >
              {card.paymentStatus}
            </span>
            <span className="text-xs text-slate-400">{MONTH_NAMES[card.payroll.month - 1]} {card.payroll.year}</span>
          </div>
        </>
      ) : (
        <>
          <p className="text-xl font-extrabold text-slate-300">--</p>
          <p className="text-xs text-slate-400 mt-1">No payroll record yet</p>
        </>
      );
    }

    return card.performance ? (
      <>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-2xl font-extrabold text-slate-900">{card.performance.overallScore}</p>
          <p className="text-sm text-slate-400 font-medium">/ 100</p>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1.5">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${card.gradeConfig?.bar || "bg-blue-500"}`}
            style={{ width: `${card.performance.overallScore}%` }}
          />
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${card.gradeConfig?.color} ${card.gradeConfig?.bg} ${card.gradeConfig?.border}`}>
          {card.gradeConfig?.emoji} {card.performance.grade}
        </span>
      </>
    ) : (
      <>
        <p className="text-xl font-extrabold text-slate-300">Pending</p>
        <p className="text-xs text-slate-400 mt-1">No performance review yet</p>
      </>
    );
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-white border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{card.title}</p>
          {renderCardContent(card)}
        </div>
      ))}
    </div>
  );
}
