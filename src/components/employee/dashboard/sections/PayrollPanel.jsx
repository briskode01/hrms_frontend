// @ts-nocheck
import { MONTH_NAMES } from "../shared/constants";
import { formatCurrency, formatDate } from "../shared/utils";

export default function PayrollPanel({ payroll, navigate, setActiveTab }) {
  const grossSalary = Number(payroll?.earnings?.basic || 0) + Number(payroll?.earnings?.hra || 0) + Number(payroll?.earnings?.bonus || 0);
  const totalDeductions = Number(payroll?.deductions?.pf || 0) + Number(payroll?.deductions?.tax || 0);
  const netSalary = grossSalary - totalDeductions;

  const paymentStatus = payroll?.payment?.status || "Draft";
  const paymentDate = payroll?.payment?.date;

  const handleViewAll = () => {
    if (setActiveTab) {
      setActiveTab("payroll");
      return;
    }
    navigate("/payroll");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-1">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-slate-900">Latest Payroll</h3>
          <p className="text-xs text-slate-400 mt-0.5">Your most recent salary record</p>
        </div>
        <span className="text-xl">💳</span>
      </div>

      <div className="px-6 py-5">
        {payroll ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-slate-600">{MONTH_NAMES[payroll.month - 1]} {payroll.year}</p>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-700"
                    : paymentStatus === "Processed" ? "bg-blue-100 text-blue-700"
                      : paymentStatus === "Hold" ? "bg-red-100 text-red-600"
                        : "bg-slate-100 text-slate-600"}`}
              >
                {paymentStatus === "Paid" ? "✅" : paymentStatus === "Hold" ? "⏸️" : "🔄"} {paymentStatus}
              </span>
            </div>

            <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-xl p-4 text-white mb-4">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Net Salary</p>
              <p className="text-3xl font-extrabold">{formatCurrency(netSalary)}</p>
              {paymentDate && (
                <p className="text-xs text-slate-400 mt-1.5">Paid on {formatDate(paymentDate)}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Earnings</span>
                <span className="text-xs font-extrabold text-emerald-600">{formatCurrency(grossSalary)}</span>
              </div>
              {[
                { label: "Basic Salary", val: payroll?.earnings?.basic },
                { label: "HRA", val: payroll?.earnings?.hra },
                (payroll?.earnings?.bonus || 0) > 0 && { label: "Bonus", val: payroll?.earnings?.bonus },
              ]
                .filter(Boolean)
                .map(({ label, val }) => val > 0 && (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">{label}</span>
                    <span className="text-xs font-bold text-slate-700">{formatCurrency(val)}</span>
                  </div>
                ))}

              <div className="flex justify-between items-center py-2 border-b border-slate-100 mt-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deductions</span>
                <span className="text-xs font-extrabold text-red-500">-{formatCurrency(totalDeductions)}</span>
              </div>
              {[
                { label: "Provident Fund", val: payroll?.deductions?.pf },
                { label: "Tax", val: payroll?.deductions?.tax },
              ]
                .filter(Boolean)
                .map(({ label, val }) => val > 0 && (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">{label}</span>
                    <span className="text-xs font-bold text-red-400">-{formatCurrency(val)}</span>
                  </div>
                ))}
            </div>

            <button
              onClick={handleViewAll}
              className="w-full mt-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-colors border border-slate-200"
            >
              View all payslips →
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-center">
            <div className="text-4xl mb-3">💳</div>
            <p className="text-sm font-semibold text-slate-500">No payroll record yet</p>
            <p className="text-xs mt-1">Your salary details will appear here once payroll is processed</p>
          </div>
        )}
      </div>
    </div>
  );
}
