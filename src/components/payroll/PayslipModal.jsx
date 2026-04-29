// @ts-nocheck
// client/src/components/payroll/PayslipModal.jsx
import { useRef } from "react";
import { X, Printer } from "lucide-react";
import {
    MONTHS, fmt, fmtDate,
    derivePayrollAmounts, parseBankDetails,
    buildPayslipHtml, printViaIframe,
} from "./payslipUtils";

// ─── Sub-components ───────────────────────────────────────────

function InfoRow({ label, value }) {
    return (
        <tr>
            <td className="border border-slate-300 px-3 py-1.5 w-44 text-slate-600">{label}</td>
            <td className="border border-slate-300 px-3 py-1.5 font-semibold">{value ?? "—"}</td>
        </tr>
    );
}

function SlipHeader({ month, year }) {
    return (
        <table className="w-full border-collapse">
            <tbody>
                <tr>
                    {/* Logo */}
                    <td className="w-36 border border-slate-800 p-3 align-middle">
                        <div className="flex flex-col items-center justify-center gap-1">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-xl">H</div>
                            <p className="font-black text-xs text-indigo-700 leading-tight text-center mt-1">HR MANAGEMENT</p>
                            <p className="text-[9px] text-slate-500 leading-tight">SYSTEM</p>
                        </div>
                    </td>
                    {/* Company info */}
                    <td className="border border-slate-800 p-3 text-center align-middle">
                        <p className="font-extrabold text-lg text-slate-900">HR Management System</p>
                        <p className="text-xs text-slate-600 mt-1">Plot no 222, District Center, Chandrasekharpur,</p>
                        <p className="text-xs text-slate-600">Bhubaneswar, Odisha 751016</p>
                        <p className="font-extrabold text-base mt-2 text-slate-800 underline underline-offset-2">
                            Pay slip for the month of {MONTHS[month - 1]} {year}
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

function EmployeeDetails({ emp, att }) {
    const bi = emp.bankInfo || {};
    const leftRows = [
        ["Name:",                `${emp.firstName || ""} ${emp.lastName || ""}`.toUpperCase()],
        ["Joining Date:",        fmtDate(emp.joiningDate)],
        ["Designation:",         (emp.designation || "—").toUpperCase()],
        ["Department:",          emp.department],
        ["Location:",            emp.address],
        ["Effective Work Days:", att.workingDays],
        ["LOP:",                 att.lopDays ?? "0"],
    ];
    const rightRows = [
        ["Employee No :",    emp.employeeId],
        ["Bank Name :",      bi.bankName || "—"],
        ["Bank account No:", bi.accountNumber || "—"],
        ["IFSC Code:",       bi.ifscCode || "—"],
        ["Pan No:",          bi.panNumber || "—"],
        ["PF No:",           bi.pfNumber || ""],
        ["PF UAN:",          bi.pfUAN || ""],
        ["Present Days:",    att.presentDays],
    ];

    return (
        <table className="w-full border-collapse">
            <tbody>
                <tr>
                    <td className="w-1/2 border border-slate-800 p-0 align-top">
                        <table className="w-full border-collapse">
                            <tbody>{leftRows.map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}</tbody>
                        </table>
                    </td>
                    <td className="w-1/2 border border-slate-800 p-0 align-top">
                        <table className="w-full border-collapse">
                            <tbody>{rightRows.map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}</tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

function EarningsDeductionsTable({ basic, hra, bonus, pf, esi, ptax, leaveDed, totalEarnings, totalDed }) {
    const td = "border border-slate-300 px-3 py-1.5";
    const tdR = `${td} text-right`;
    const thB = "border border-slate-800 px-3 py-2";

    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-slate-100">
                    <th className={`${thB} text-center w-1/2`} colSpan={3}>Earnings</th>
                    <th className={`${thB} text-center w-1/2`} colSpan={2}>Deduction</th>
                </tr>
                <tr className="bg-slate-50">
                    <th className={`${thB} text-left w-2/5`}></th>
                    <th className={`${thB} text-right w-1/5`}>Full</th>
                    <th className={`${thB} text-right w-1/5`}>Actual</th>
                    <th className={`${thB} text-left`}></th>
                    <th className={`${thB} text-right`}>Actual</th>
                </tr>
            </thead>
            <tbody>
                <tr><td className={td}>BASIC</td><td className={tdR}>{fmt(basic)}</td><td className={tdR}>{fmt(basic)}</td><td className={td}>PROF TAX</td><td className={tdR}>{fmt(ptax)}</td></tr>
                <tr><td className={td}>HRA</td><td className={tdR}>{fmt(hra)}</td><td className={tdR}>{fmt(hra)}</td><td className={td}>PF</td><td className={tdR}>{fmt(pf)}</td></tr>
                <tr><td className={td}>BONUS / INCENTIVE</td><td className={tdR}>{fmt(bonus)}</td><td className={tdR}>{fmt(bonus)}</td><td className={td}>ESI</td><td className={tdR}>{fmt(esi)}</td></tr>
                <tr><td className={td}>&nbsp;</td><td className={td}></td><td className={td}></td><td className={td}>LEAVE DEDUCTION</td><td className={tdR}>{fmt(leaveDed)}</td></tr>
                <tr className="bg-slate-50 font-bold">
                    <td className={`${thB}`}>Total Earnings:INR.</td>
                    <td className={`${thB} text-right`}></td>
                    <td className={`${thB} text-right`}>{fmt(totalEarnings)}</td>
                    <td className={`${thB}`}>Total Deduction:INR.</td>
                    <td className={`${thB} text-right`}>{fmt(totalDed)}</td>
                </tr>
            </tbody>
        </table>
    );
}

// ─── Main Modal ───────────────────────────────────────────────
export default function PayslipModal({ payroll, onClose }) {
    const emp    = payroll?.employee   || {};
    const att    = payroll?.attendance || {};
    const amounts = derivePayrollAmounts(payroll);
    const { netPay } = amounts;

    const handlePrint = () => printViaIframe(buildPayslipHtml(payroll));

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-4" onClick={e => e.stopPropagation()}>

                {/* Toolbar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <h2 className="font-extrabold text-slate-800 text-lg">Payslip Preview</h2>
                    <div className="flex items-center gap-3">
                        <button onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">
                            <Printer className="w-4 h-4" /> Print / Download
                        </button>
                        <button onClick={onClose}
                            className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg flex items-center justify-center transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Payslip preview */}
                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    <div className="border-2 border-slate-800 font-sans text-sm text-slate-900">
                        <SlipHeader month={payroll.month} year={payroll.year} />
                        <EmployeeDetails emp={emp} att={att} />
                        <EarningsDeductionsTable {...amounts} />

                        {/* Net Pay */}
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr>
                                    <td className="border border-slate-800 px-4 py-2">
                                        <span className="font-bold">Net Pay for the month (Total Earnings-Total Deductions): </span>
                                        <span className="font-extrabold text-base ml-1">₹{fmt(netPay)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-800 px-4 py-2 italic text-slate-700">
                                        ({amounts.netWords || ""})
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="text-center py-3 border-t border-slate-800 text-slate-500 text-xs">
                            This is a system generated payslip and does not require signature.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
