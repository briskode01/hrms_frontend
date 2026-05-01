// @ts-nocheck
import { useState, useMemo, useCallback } from "react";
import { useExpenditure } from "./ExpenditureContext";
import toast from "react-hot-toast";
import { FileDown, CloudUpload, Loader2, ExternalLink } from "lucide-react";
import ReportCard from "../../../components/reports/ReportCard";
import usePnlUpload, { buildReportPdf } from "../../../hooks/usePnlUpload";

// ReportCard and PDF helpers moved to components/hooks

function PnlSummary({ filterDate, pnlRows, netAfterSalary, onUpload, isUploading, onExport, uploadedPnlUrl }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
                <div>
                    <p className="font-extrabold text-slate-800">Profit & Loss Summary</p>
                    <p className="text-xs text-slate-400 mt-0.5">{filterDate ? `Filtered period: ${filterDate}` : "Current month summary"}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                    <button
                        onClick={onUpload}
                        disabled={isUploading}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isUploading ? <Loader2 size={14} className="animate-spin" /> : <CloudUpload size={14} />}
                        {isUploading ? "Uploading..." : "Auto Upload P&L"}
                    </button>
                    <button
                        onClick={onExport}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        <FileDown size={14} /> Export PDF
                    </button>
                </div>
            </div>
            <div className="p-5 space-y-3">
                {pnlRows.map(r => (
                    <div key={r.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                        <span className="text-sm text-slate-600">{r.label}</span>
                        <span className={`text-sm font-extrabold ${r.color || ''}`}>{r.value}</span>
                    </div>
                ))}
                <div className={`flex items-center justify-between py-3 rounded-xl px-3 mt-2 ${netAfterSalary >= 0 ? "bg-emerald-50" : "bg-rose-50"}`}>
                    <span className="text-sm font-extrabold text-slate-700">Net Profit / Loss</span>
                    <span className={`text-lg font-extrabold ${netAfterSalary >= 0 ? "text-emerald-700" : "text-rose-700"}`}>{pnlRows[pnlRows.length-1]?.value}</span>
                </div>
                {uploadedPnlUrl && (
                    <a
                        href={`https://sportyfi.com${uploadedPnlUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                        <ExternalLink size={13} /> Open uploaded copy
                    </a>
                )}
            </div>
        </div>
    );
}

export default function ExpenditureReports() {
    const { expenses: allExpenses, income: allIncome, advances: allAdvances, payrolls: allPayrolls, fmtINR } = useExpenditure();
    const [filterDate, setFilterDate] = useState("");
    const { upload: uploadFn, isUploading, uploadedUrl } = usePnlUpload();

    const matchDate = (d) => d && d.startsWith(filterDate);
    const expenses = filterDate ? allExpenses.filter(e => matchDate(e.date)) : allExpenses;
    const income = filterDate ? allIncome.filter(i => matchDate(i.date)) : allIncome;
    const advances = filterDate ? allAdvances.filter(a => matchDate(a.date) || matchDate(a.createdAt)) : allAdvances;

    const payrolls = useMemo(() => {
        if (!filterDate) return allPayrolls || [];
        const [year, month] = filterDate.split('-');
        return (allPayrolls || []).filter(p => p.year === Number(year) && p.month === Number(month));
    }, [filterDate, allPayrolls]);

    const totalIncome = useMemo(() => income.reduce((sum, i) => sum + Number(i.amount), 0), [income]);
    const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + Number(e.amount), 0), [expenses]);
    const totalAdvances = useMemo(() => advances.reduce((sum, a) => sum + Number(a.amount), 0), [advances]);

    // Group expenses by category
    const expByCategory = {};
    expenses.forEach(e => { expByCategory[e.category] = (expByCategory[e.category] || 0) + Number(e.amount); });
    const expCatRows = Object.entries(expByCategory).map(([k, v]) => ({ label: k, value: fmtINR(v) }));

    // Group income by source
    const incBySource = {};
    income.forEach(i => { incBySource[i.source] = (incBySource[i.source] || 0) + Number(i.amount); });
    const incSrcRows = Object.entries(incBySource).map(([k, v]) => ({ label: k, value: fmtINR(v) }));

    // Group expenses by date
    const expByDate = {};
    expenses.forEach(e => { 
        const d = e.date?.split('T')[0] || e.date;
        expByDate[d] = (expByDate[d] || 0) + Number(e.amount); 
    });
    const expDateRows = Object.entries(expByDate).sort((a, b) => new Date(b[0]) - new Date(a[0])).map(([k, v]) => ({ label: k, value: fmtINR(v) }));

    // Group income by date
    const incByDate = {};
    income.forEach(i => { 
        const d = i.date?.split('T')[0] || i.date;
        incByDate[d] = (incByDate[d] || 0) + Number(i.amount); 
    });
    const incDateRows = Object.entries(incByDate).sort((a, b) => new Date(b[0]) - new Date(a[0])).map(([k, v]) => ({ label: k, value: fmtINR(v) }));

    // Advances report
    const advRows = useMemo(() => advances.map(a => ({
        label: `${a.employee} (${a.employeeId})`,
        value: `${fmtINR(a.amount)} — ${a.status}`,
    })), [advances, fmtINR]);

    // Profit/loss
    const profit = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);
    const salaryCost = useMemo(() => payrolls.reduce((sum, p) => sum + (Number(p.earnings?.basic) || 0) + (Number(p.earnings?.hra) || 0) + (Number(p.earnings?.bonus) || 0), 0), [payrolls]);
    const netAfterSalary = useMemo(() => profit - salaryCost, [profit, salaryCost]);

    const reportMonth = useMemo(() => filterDate ? Number(filterDate.split("-")[1]) : new Date().getMonth() + 1, [filterDate]);
    const reportYear = useMemo(() => filterDate ? Number(filterDate.split("-")[0]) : new Date().getFullYear(), [filterDate]);
    const reportLabel = useMemo(() => filterDate ? `P&L ${filterDate}` : `P&L ${new Date().toISOString().slice(0, 7)}`, [filterDate]);

    const outstandingAdvances = useMemo(() => advances.filter(a => a.status === "Active").reduce((s, a) => s + (a.amount - (a.paid || 0)), 0), [advances]);

    const pnlRows = useMemo(() => [
        { label: "Total Revenue", value: fmtINR(totalIncome), color: "text-emerald-600" },
        { label: "Total Expenses", value: fmtINR(totalExpenses), color: "text-rose-600" },
        { label: "Salary Costs", value: fmtINR(salaryCost), color: "text-rose-600" },
        { label: "Advances Outstanding", value: fmtINR(outstandingAdvances), color: "text-amber-600" },
        { label: "Net Profit / Loss", value: fmtINR(netAfterSalary) },
    ], [totalIncome, totalExpenses, salaryCost, netAfterSalary, outstandingAdvances, fmtINR]);

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
                    title={filterDate ? `Expense Report (${filterDate})` : "Monthly Expense Report"}
                    rows={expCatRows.length ? expCatRows : [{ label: "No expenses recorded", value: "—" }]}
                    total={fmtINR(totalExpenses)}
                    totalLabel="Total Expenses"
                    color="text-rose-600"
                    onExport={() => exportReport(filterDate ? `Expense Report (${filterDate})` : "Monthly Expense Report", expCatRows, fmtINR(totalExpenses), "Total Expenses")}
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
