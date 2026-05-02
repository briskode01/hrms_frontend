// @ts-nocheck
import { useState, useCallback } from "react";
import { useExpenditure } from "./ExpenditureContext";
import toast from "react-hot-toast";
import { FileDown } from "lucide-react";
import ReportCard from "../../../components/reports/ReportCard";
import usePnlUpload, { buildReportPdf } from "../../../hooks/usePnlUpload";
import useExpenditureReportData from "../../../hooks/useExpenditureReportData";
import PnlSummary from "../../../components/reports/PnlSummary";

export default function ExpenditureReports() {
    const { expenses: allExpenses, income: allIncome, advances: allAdvances, payrolls: allPayrolls, fmtINR } = useExpenditure();
    const [filterDate, setFilterDate] = useState("");
    const { upload: uploadFn, isUploading, uploadedUrl } = usePnlUpload();
    const {
        expenses,
        income,
        advances,
        payrolls,
        reportMonth,
        reportYear,
        totalIncome,
        totalExpenses,
        totalAdvances,
        expCatRows,
        incSrcRows,
        expDateRows,
        incDateRows,
        advRows,
        profit,
        salaryCost,
        netAfterSalary,
        reportLabel,
        outstandingAdvances,
        monthlyExpenseRows,
        monthlyExpenseTotal,
        pnlRows,
    } = useExpenditureReportData({
        filterDate,
        allExpenses,
        allIncome,
        allAdvances,
        allPayrolls,
        fmtINR,
    });

    const exportReport = useCallback((title, rows, total, totalLabel) => {
        const doc = buildReportPdf(title, rows, total, totalLabel);
        doc.save(`${title.replace(/ /g, "_").toLowerCase()}.pdf`);
    }, []);

    const uploadPnlReport = useCallback(async () => {
        try {
            const doc = buildReportPdf("Profit & Loss Summary", pnlRows, fmtINR(netAfterSalary), "Net Profit / Loss");
            const fileName = `${reportLabel.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase()}.pdf`;
            await uploadFn({ doc, fileName, month: reportMonth, year: reportYear });
            toast.success("P&L report uploaded");
        } catch (e) {
            toast.error(e?.message || "Failed to upload P&L report");
        }
    }, [pnlRows, netAfterSalary, reportLabel, reportMonth, reportYear, uploadFn]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-800">Reports</h2>
                    <p className="text-sm text-slate-400 mt-0.5">Financial summary and downloadable reports</p>
                </div>
                <div className="flex items-center gap-3">
                    <label className="text-sm font-bold text-slate-600">Filter by Date:</label>
                    <input 
                        type="date" 
                        value={filterDate} 
                        onChange={e => setFilterDate(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 shadow-sm transition-all"
                    />
                    {filterDate && (
                        <button onClick={() => setFilterDate("")} className="text-xs text-rose-500 hover:text-rose-600 font-bold">Clear</button>
                    )}
                </div>
            </div>

            {/* Profit / Loss Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    { label: "Total Income",          val: fmtINR(totalIncome),    bg: "bg-emerald-50",  text: "text-emerald-700",  border: "border-emerald-100" },
                    { label: "Total Expenses",         val: fmtINR(totalExpenses),  bg: "bg-rose-50",     text: "text-rose-700",     border: "border-rose-100" },
                    { label: "Gross Profit",           val: fmtINR(profit),         bg: profit >= 0 ? "bg-indigo-50" : "bg-rose-50", text: profit >= 0 ? "text-indigo-700" : "text-rose-700", border: "border-indigo-100" },
                    { label: "Net (After Salaries)",   val: fmtINR(netAfterSalary), bg: "bg-amber-50",    text: "text-amber-700",    border: "border-amber-100" },
                ].map(c => (
                    <div key={c.label} className={`${c.bg} ${c.border} border rounded-2xl p-5`}>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{c.label}</p>
                        <p className={`text-xl font-extrabold mt-1 ${c.text}`}>{c.val}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Expenses */}
                <ReportCard
                    title="Daily Expense Report"
                    rows={expDateRows.length ? expDateRows : [{ label: "No expenses recorded", value: "—" }]}
                    total={fmtINR(totalExpenses)}
                    totalLabel="Total Expenses"
                    color="text-rose-600"
                    onExport={() => exportReport("Daily Expense Report", expDateRows, fmtINR(totalExpenses), "Total Expenses")}
                />

                {/* Daily Income */}
                <ReportCard
                    title="Daily Income Report"
                    rows={incDateRows.length ? incDateRows : [{ label: "No income recorded", value: "—" }]}
                    total={fmtINR(totalIncome)}
                    totalLabel="Total Income"
                    color="text-emerald-600"
                    onExport={() => exportReport("Daily Income Report", incDateRows, fmtINR(totalIncome), "Total Income")}
                />

                {/* Expense by category */}
                <ReportCard
                    title={filterDate ? `Expense Report (${filterDate})` : "Monthly Expense & Salary Report"}
                    rows={monthlyExpenseRows.length ? monthlyExpenseRows : [{ label: "No expenses recorded", value: "—" }]}
                    total={fmtINR(monthlyExpenseTotal)}
                    totalLabel="Total Expenses + Salary"
                    color="text-rose-600"
                    onExport={() => exportReport(filterDate ? `Expense Report (${filterDate})` : "Monthly Expense & Salary Report", monthlyExpenseRows, fmtINR(monthlyExpenseTotal), "Total Expenses + Salary")}
                />

                {/* Income by source */}
                <ReportCard
                    title={filterDate ? `Income Report (${filterDate})` : "Monthly Income Report"}
                    rows={incSrcRows.length ? incSrcRows : [{ label: "No income recorded", value: "—" }]}
                    total={fmtINR(totalIncome)}
                    totalLabel="Total Income"
                    color="text-emerald-600"
                    onExport={() => exportReport(filterDate ? `Income Report (${filterDate})` : "Monthly Income Report", incSrcRows, fmtINR(totalIncome), "Total Income")}
                />

                {/* Advances */}
                <ReportCard
                    title="Employee Advance Report"
                    rows={advRows.length ? advRows : [{ label: "No advances recorded", value: "—" }]}
                    total={fmtINR(totalAdvances)}
                    totalLabel="Total Advances"
                    color="text-amber-600"
                    onExport={() => exportReport("Employee Advance Report", advRows, fmtINR(totalAdvances), "Total Advances")}
                />
                <PnlSummary
                    filterDate={filterDate}
                    pnlRows={pnlRows}
                    netAfterSalary={netAfterSalary}
                    onUpload={uploadPnlReport}
                    isUploading={isUploading}
                    onExport={() => exportReport("Profit & Loss Summary", pnlRows, fmtINR(netAfterSalary), "Net Profit / Loss")}
                    uploadedPnlUrl={uploadedUrl}
                />
            </div>
        </div>
    );
}
