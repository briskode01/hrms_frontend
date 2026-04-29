// @ts-nocheck
import { useExpenditure } from "./ExpenditureContext";
import { TrendingUp, TrendingDown, CreditCard, UserCheck, ArrowUpRight } from "lucide-react";

// ─── Mini bar chart using SVG ─────────────────────────────────
function BarChart({ data = [] }) {
    const maxVal = Math.max(...data.flatMap(d => [d.income, d.expenses]), 1);
    const h = 100;

    return (
        <svg viewBox={`0 0 ${Math.max(data.length * 60, 360)} 130`} className="w-full" xmlns="http://www.w3.org/2000/svg">
            {data.map((d, i) => {
                const x = i * 60 + 10;
                const iH = (d.income / maxVal) * h;
                const eH = (d.expenses / maxVal) * h;
                return (
                    <g key={i}>
                        <rect x={x} y={110 - iH} width={18} height={iH} rx="3" fill="#6366f1" opacity="0.85" />
                        <rect x={x + 20} y={110 - eH} width={18} height={eH} rx="3" fill="#f43f5e" opacity="0.85" />
                        <text x={x + 9} y={125} textAnchor="middle" fontSize="9" fill="#94a3b8">{d.month}</text>
                    </g>
                );
            })}
            <rect x={10}  y={5} width={10} height={10} rx="2" fill="#6366f1" />
            <text x={24}  y={14} fontSize="9" fill="#94a3b8">Income</text>
            <rect x={80}  y={5} width={10} height={10} rx="2" fill="#f43f5e" />
            <text x={94}  y={14} fontSize="9" fill="#94a3b8">Expenses</text>
        </svg>
    );
}

// ─── Donut chart ──────────────────────────────────────────────
function DonutChart({ expenses }) {
    const categories = {};
    expenses.forEach(e => { categories[e.category] = (categories[e.category] || 0) + Number(e.amount); });
    const total = Object.values(categories).reduce((s, v) => s + v, 0);
    const COLORS = ["#6366f1","#f43f5e","#10b981","#f59e0b","#3b82f6","#8b5cf6"];
    let cumulative = 0;
    const segments = Object.entries(categories).map(([label, val], i) => {
        const pct  = total ? val / total : 0;
        const start = cumulative;
        cumulative += pct;
        return { label, val, pct, start, color: COLORS[i % COLORS.length] };
    });

    const toXY = (pct) => {
        const angle = pct * 2 * Math.PI - Math.PI / 2;
        return [50 + 38 * Math.cos(angle), 50 + 38 * Math.sin(angle)];
    };

    return (
        <div className="flex items-center gap-6">
            <svg viewBox="0 0 100 100" className="w-28 h-28 shrink-0">
                {segments.map((s) => {
                    if (s.pct === 0) return null;
                    const [x1, y1] = toXY(s.start);
                    const [x2, y2] = toXY(s.start + s.pct);
                    const large = s.pct > 0.5 ? 1 : 0;
                    return (
                        <path key={s.label}
                            d={`M50 50 L${x1} ${y1} A38 38 0 ${large} 1 ${x2} ${y2} Z`}
                            fill={s.color} opacity="0.9" />
                    );
                })}
                <circle cx="50" cy="50" r="24" fill="white" />
                <text x="50" y="54" textAnchor="middle" fontSize="8" fontWeight="700" fill="#334155">
                    {segments.length} cats
                </text>
            </svg>
            <ul className="space-y-1.5 flex-1">
                {segments.map(s => (
                    <li key={s.label} className="flex items-center gap-2 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                        <span className="text-slate-600 flex-1 truncate">{s.label}</span>
                        <span className="font-bold text-slate-700">{Math.round(s.pct * 100)}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ─── Summary Card ─────────────────────────────────────────────
function SummaryCard({ label, value, icon: Icon, color, sub }) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-xl font-extrabold text-slate-800 mt-0.5">{value}</p>
                {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

// ─── Recent Transactions ──────────────────────────────────────
function RecentTransaction({ label, amount, date, type }) {
    return (
        <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${type === "income" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                    {type === "income" ? "+" : "-"}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-700">{label}</p>
                    <p className="text-xs text-slate-400">{date}</p>
                </div>
            </div>
            <span className={`text-sm font-extrabold ${type === "income" ? "text-emerald-600" : "text-rose-500"}`}>
                {type === "income" ? "+" : "-"}₹{Number(amount).toLocaleString("en-IN")}
            </span>
        </div>
    );
}

// ─── Main Overview ────────────────────────────────────────────
export default function ExpenditureOverview() {
    const { expenses, income, advances, stats, loading, totalIncome, totalExpenses, totalAdvances, fmtINR } = useExpenditure();
    
    const profit = stats?.profit ?? (totalIncome - totalExpenses);
    const totalSalaryPaid = stats?.totalSalaryPaid ?? 0;
    const barData = stats?.barChartData ?? [];
    const expByCategory = stats?.expenseByCategory ?? [];

    const recent = [
        ...income.slice(0, 2).map(i  => ({ label: i.clientName, amount: i.amount, date: i.date, type: "income" })),
        ...expenses.slice(0, 3).map(e => ({ label: e.title, amount: e.amount, date: e.date, type: "expense" })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-slate-400">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    // Build donut data from either API stats or local expenses
    const donutExpenses = expByCategory.length > 0
        ? expByCategory.map(e => ({ category: e._id, amount: e.total }))
        : expenses;

    return (
        <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <SummaryCard label="Total Income"      value={fmtINR(totalIncome)}    icon={TrendingUp}   color="bg-emerald-500" sub="This month" />
                <SummaryCard label="Total Expenses"    value={fmtINR(totalExpenses)}  icon={TrendingDown} color="bg-rose-500"    sub="This month" />
                <SummaryCard label="Salary Paid"       value={fmtINR(totalSalaryPaid)} icon={CreditCard}  color="bg-indigo-500"  sub="This month" />
                <SummaryCard label="Advances Given"    value={fmtINR(totalAdvances)}  icon={UserCheck}    color="bg-amber-500"   sub={`${advances.filter(a=>a.status==='Active').length} active`} />
            </div>

            {/* Profit banner */}
            <div className={`rounded-2xl px-6 py-4 flex items-center justify-between ${profit >= 0 ? "bg-emerald-50 border border-emerald-200" : "bg-rose-50 border border-rose-200"}`}>
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Net Profit / Loss (This Month)</p>
                    <p className={`text-2xl font-extrabold mt-0.5 ${profit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{profit >= 0 ? "+" : ""}{fmtINR(profit)}</p>
                </div>
                <ArrowUpRight size={36} className={profit >= 0 ? "text-emerald-300" : "text-rose-300"} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar chart */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <p className="text-sm font-extrabold text-slate-700 mb-4">Income vs Expenses (Last 6 Months)</p>
                    {barData.length === 0
                        ? <p className="text-slate-400 text-sm text-center py-8">No chart data yet.</p>
                        : <BarChart data={barData} />
                    }
                </div>

                {/* Donut chart */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <p className="text-sm font-extrabold text-slate-700 mb-4">Expense Breakdown</p>
                    {donutExpenses.length === 0
                        ? <p className="text-slate-400 text-sm text-center py-8">No expense data yet.</p>
                        : <DonutChart expenses={donutExpenses} />
                    }
                </div>
            </div>

            {/* Recent transactions */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <p className="text-sm font-extrabold text-slate-700 mb-4">Recent Transactions</p>
                {recent.length === 0
                    ? <p className="text-slate-400 text-sm text-center py-6">No transactions yet.</p>
                    : recent.map((t, i) => <RecentTransaction key={i} {...t} />)
                }
            </div>
        </div>
    );
}
