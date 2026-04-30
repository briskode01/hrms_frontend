// @ts-nocheck
import { useState } from "react";
import { useExpenditure } from "./ExpenditureContext";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function handleExport(title, rows, total, totalLabel) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(title, 14, 20);
    
    const tableData = rows.map(r => [r.label, r.value]);
    if (total !== undefined && totalLabel) {
        tableData.push([{ content: totalLabel, styles: { fontStyle: 'bold' } }, { content: total, styles: { fontStyle: 'bold' } }]);
    }

    autoTable(doc, {
        startY: 30,
        head: [['Description', 'Amount / Details']],
        body: tableData,
    });

    doc.save(`${title.replace(/ /g, "_").toLowerCase()}.pdf`);
}

function ReportCard({ title, rows, total, totalLabel, color }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between`}>
                <p className="font-extrabold text-slate-800">{title}</p>
                <button 
                    onClick={() => handleExport(title, rows, total, totalLabel)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                >
                    <FileDown size={14} /> Export PDF
                </button>
            </div>
            <div className="divide-y divide-slate-50 max-h-[320px] overflow-y-auto">
                {rows.map((r, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3">
                        <span className="text-sm text-slate-600">{r.label}</span>
                        <span className={`text-sm font-extrabold ${color}`}>{r.value}</span>
                    </div>
                ))}
            </div>
            {total !== undefined && (
                <div className={`px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between`}>
                    <span className="text-sm font-extrabold text-slate-700">{totalLabel}</span>
                    <span className={`text-base font-extrabold ${color}`}>{total}</span>
                </div>
            )}
        </div>
    );
}

export default function ExpenditureReports() {
    const { expenses: allExpenses, income: allIncome, advances: allAdvances, payrolls: allPayrolls, fmtINR } = useExpenditure();
    const [filterDate, setFilterDate] = useState("");

    const matchDate = (d) => d && d.startsWith(filterDate);
    const expenses = filterDate ? allExpenses.filter(e => matchDate(e.date)) : allExpenses;
    const income = filterDate ? allIncome.filter(i => matchDate(i.date)) : allIncome;
    const advances = filterDate ? allAdvances.filter(a => matchDate(a.date) || matchDate(a.createdAt)) : allAdvances;

    let payrolls = allPayrolls || [];
    if (filterDate) {
        const [year, month] = filterDate.split('-');
        payrolls = (allPayrolls || []).filter(p => p.year === Number(year) && p.month === Number(month));
    }

    const totalIncome = income.reduce((sum, i) => sum + Number(i.amount), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalAdvances = advances.reduce((sum, a) => sum + Number(a.amount), 0);

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
    const advRows = advances.map(a => ({
        label: `${a.employee} (${a.employeeId})`,
        value: `${fmtINR(a.amount)} — ${a.status}`,
    }));

    // Profit/loss
    const profit = totalIncome - totalExpenses;
    const salaryCost = payrolls.reduce((sum, p) => sum + (Number(p.earnings?.basic) || 0) + (Number(p.earnings?.hra) || 0) + (Number(p.earnings?.bonus) || 0), 0);
    const netAfterSalary = profit - salaryCost;

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
                />

                {/* Daily Income */}
                <ReportCard
                    title="Daily Income Report"
                    rows={incDateRows.length ? incDateRows : [{ label: "No income recorded", value: "—" }]}
                    total={fmtINR(totalIncome)}
                    totalLabel="Total Income"
                    color="text-emerald-600"
                />

                {/* Expense by category */}
                <ReportCard
                    title={filterDate ? `Expense Report (${filterDate})` : "Monthly Expense Report"}
                    rows={expCatRows.length ? expCatRows : [{ label: "No expenses recorded", value: "—" }]}
                    total={fmtINR(totalExpenses)}
                    totalLabel="Total Expenses"
                    color="text-rose-600"
                />

                {/* Income by source */}
                <ReportCard
                    title={filterDate ? `Income Report (${filterDate})` : "Monthly Income Report"}
                    rows={incSrcRows.length ? incSrcRows : [{ label: "No income recorded", value: "—" }]}
                    total={fmtINR(totalIncome)}
                    totalLabel="Total Income"
                    color="text-emerald-600"
                />

                {/* Advances */}
                <ReportCard
                    title="Employee Advance Report"
                    rows={advRows.length ? advRows : [{ label: "No advances recorded", value: "—" }]}
                    total={fmtINR(totalAdvances)}
                    totalLabel="Total Advances"
                    color="text-amber-600"
                />

                {/* P&L Summary */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100">
                        <p className="font-extrabold text-slate-800">Profit & Loss Summary</p>
                    </div>
                    <div className="p-5 space-y-3">
                        {[
                            { label: "Total Revenue",          val: fmtINR(totalIncome),     color: "text-emerald-600" },
                            { label: "Total Expenses",         val: `− ${fmtINR(totalExpenses)}`, color: "text-rose-600" },
                            { label: "Salary Costs",           val: `− ${fmtINR(salaryCost)}`,  color: "text-rose-600" },
                            { label: "Advances Outstanding",   val: `− ${fmtINR(advances.filter(a=>a.status==='Active').reduce((s,a)=>s+(a.amount-a.paid),0))}`, color: "text-amber-600" },
                        ].map(r => (
                            <div key={r.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                <span className="text-sm text-slate-600">{r.label}</span>
                                <span className={`text-sm font-extrabold ${r.color}`}>{r.val}</span>
                            </div>
                        ))}
                        <div className={`flex items-center justify-between py-3 rounded-xl px-3 mt-2 ${netAfterSalary >= 0 ? "bg-emerald-50" : "bg-rose-50"}`}>
                            <span className="text-sm font-extrabold text-slate-700">Net Profit / Loss</span>
                            <span className={`text-lg font-extrabold ${netAfterSalary >= 0 ? "text-emerald-700" : "text-rose-700"}`}>{fmtINR(netAfterSalary)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
