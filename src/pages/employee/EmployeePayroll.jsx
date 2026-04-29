import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import API from "../../api/axios";
import { buildPayslipHtml, printViaIframe } from "../../components/payroll/payslipUtils";

const monthInputFromDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const getGross = (payroll) => Number(payroll?.earnings?.basic || 0) + Number(payroll?.earnings?.hra || 0) + Number(payroll?.earnings?.bonus || 0);
const getDeductions = (payroll) => Number(payroll?.deductions?.pf || 0) + Number(payroll?.deductions?.tax || 0);
const getNet = (payroll) => getGross(payroll) - getDeductions(payroll);

const statusClasses = {
  Paid: "bg-emerald-100 text-emerald-700",
  Processed: "bg-blue-100 text-blue-700",
  Hold: "bg-amber-100 text-amber-700",
  Draft: "bg-slate-100 text-slate-600",
};

const handleDownloadPayslip = (payroll) => {
  const html = buildPayslipHtml(payroll);
  printViaIframe(html);
};

export default function EmployeePayroll() {
  const [selectedMonth, setSelectedMonth] = useState(monthInputFromDate(new Date()));
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);

  const fetchPayrolls = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const [year, month] = selectedMonth.split("-");
      const { data } = await API.get("/payroll", { params: { month: Number(month), year: Number(year) } });
      setRecords(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      if (showLoader) {
        toast.error(error.response?.data?.message || "Failed to fetch payroll records");
      }
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const monthLabel = useMemo(() => {
    const [year, month] = selectedMonth.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);
    return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(date);
  }, [selectedMonth]);

  useEffect(() => {
    fetchPayrolls(true);
  }, [selectedMonth]);

  useEffect(() => {
    const refreshSilently = () => fetchPayrolls(false);
    const intervalId = window.setInterval(refreshSilently, 10000);

    window.addEventListener("focus", refreshSilently);
    document.addEventListener("visibilitychange", refreshSilently);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshSilently);
      document.removeEventListener("visibilitychange", refreshSilently);
    };
  }, [selectedMonth]);

  return (
    <div className="relative overflow-hidden rounded-3xl pb-8">
      <div className="absolute inset-0 bg-[url('/Payroll.png')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-white/30" />

      <div className="relative z-10 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight p-1">My Payroll</h2>
          <p className="text-sm text-slate-400 mt-0.5">View your payslips and download PDF</p>
        </div>
        <input
          type="month"
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none cursor-pointer shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
        />
      </div>

      <section className="bg-white/88 rounded-2xl border border-slate-100 shadow-sm overflow-hidden backdrop-blur-[1px]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900">Payslips</h3>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">{monthLabel}</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm font-medium">Loading payroll...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
            <div className="text-4xl mb-3">💳</div>
            <p className="text-sm font-semibold text-slate-500">No payroll records found</p>
            <p className="text-xs mt-1">Try a different month or contact your administrator</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {records.map((payroll) => {
              const gross = getGross(payroll);
              const deductions = getDeductions(payroll);
              const net = getNet(payroll);
              const status = payroll?.payment?.status || "Draft";
              const statusClass = statusClasses[status] || statusClasses.Draft;

              return (
                <div key={payroll._id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-sm font-extrabold text-slate-900">{MONTHS[payroll.month - 1]} {payroll.year}</p>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusClass}`}>{status}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Gross: {fmt(gross)} · Deductions: -{fmt(deductions)} · Net: <span className="font-bold text-slate-700">{fmt(net)}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleDownloadPayslip(payroll)}
                      className="w-full lg:w-auto px-4 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold shadow-md shadow-blue-200 transition-all"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      </div>
    </div>
  );
}
