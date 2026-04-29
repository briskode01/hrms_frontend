// @ts-nocheck
// client/src/components/payroll/PayrollTable.jsx

import { MONTHS, STATUS_STYLES, getAvatarColor, fmt } from "./constants";

export default function PayrollTable({ payrolls, loading, selectedMonth, selectedYear, onViewSlip, onOpenPaymentStepper, onDelete }) {
    const gross = (p) => Number(p?.earnings?.basic || 0) + Number(p?.earnings?.hra || 0) + Number(p?.earnings?.bonus || 0);
    const totalDeductions = (p) =>
        Number(p?.deductions?.pf || 0) +
        Number(p?.deductions?.ptax || 0) +
        Number(p?.deductions?.esi || 0) +
        Number(p?.deductions?.leaveDeduction || 0);
    const net = (p) => gross(p) - totalDeductions(p);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="font-extrabold text-slate-900">Payroll Records</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {MONTHS[selectedMonth - 1]} {selectedYear} · {payrolls.length} records
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                    <p className="text-sm font-medium">Loading payroll...</p>
                </div>
            ) : payrolls.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <div className="text-5xl mb-3">💳</div>
                    <p className="text-base font-semibold text-slate-600">No payroll records yet</p>
                    <p className="text-sm mt-1">Generate payrolls from the Wages Creation page first.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-200">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                {["Employee", "Basic", "Gross", "Deductions", "Net Salary", "Status", "Actions"].map((h) => (
                                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {payrolls.map((p) => (
                                <tr key={p._id} className="hover:bg-blue-50/40 transition-colors group">
                                    {/* Employee */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full ${getAvatarColor(p.employee?.firstName)} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                                                {p.employee?.firstName?.[0]}{p.employee?.lastName?.[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {p.employee?.firstName} {p.employee?.lastName}
                                                </p>
                                                <p className="text-xs text-slate-400">{p.employee?.employeeId} · {p.employee?.department}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-slate-600 font-medium">{fmt(p?.earnings?.basic)}</td>

                                    {/* Gross */}
                                    <td className="px-5 py-4">
                                        <p className="text-sm font-bold text-slate-800">{fmt(gross(p))}</p>
                                        <p className="text-xs text-emerald-600">+{fmt((p?.earnings?.hra || 0) + (p?.earnings?.bonus || 0))} allowances</p>
                                    </td>
                                    {/* Deductions */}
                                    <td className="px-5 py-4">
                                        <p className="text-sm font-bold text-red-500">-{fmt(totalDeductions(p))}</p>
                                        <p className="text-xs text-slate-400">All Deduct.</p>
                                    </td>

                                    {/* Net Salary */}
                                    <td className="px-5 py-4">
                                        <p className="text-base font-extrabold text-slate-900">{fmt(net(p))}</p>
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[p?.payment?.status] || STATUS_STYLES.Draft}`}>
                                            {p?.payment?.status || "Draft"}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <div className="flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => onViewSlip(p)}
                                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition-colors">Slip</button>
                                            {p?.payment?.status !== "Paid" && (
                                                <button onClick={() => onOpenPaymentStepper(p)}
                                                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold rounded-lg transition-colors">Pay</button>
                                            )}
                                            <button onClick={() => onDelete(p._id)}
                                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold rounded-lg transition-colors">Del</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
