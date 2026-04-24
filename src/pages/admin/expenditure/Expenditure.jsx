// @ts-nocheck
import { ExpenditureProvider, useExpenditure } from "./ExpenditureContext";
import ExpenditureOverview  from "./ExpenditureOverview";
import ExpenditureExpenses  from "./ExpenditureExpenses";
import ExpenditureIncome    from "./ExpenditureIncome";
import ExpenditureAdvances  from "./ExpenditureAdvances";
import ExpenditureReports   from "./ExpenditureReports";
import { LayoutDashboard, Receipt, TrendingUp, UserCheck, FileBarChart } from "lucide-react";

const SUB_PAGES = [
    { id: "overview",  label: "Overview",  icon: LayoutDashboard },
    { id: "expenses",  label: "Expenses",  icon: Receipt },
    { id: "income",    label: "Income",    icon: TrendingUp },
    { id: "advances",  label: "Advances",  icon: UserCheck },
    { id: "reports",   label: "Reports",   icon: FileBarChart },
];

function ExpenditureInner() {
    const { subPage, setSubPage, pendingAdvancesCount } = useExpenditure();

    const PAGE_MAP = {
        overview:  <ExpenditureOverview />,
        expenses:  <ExpenditureExpenses />,
        income:    <ExpenditureIncome />,
        advances:  <ExpenditureAdvances />,
        reports:   <ExpenditureReports />,
    };

    return (
        <div className="space-y-5">
            {/* Sub-page tab bar */}
            <div className="flex items-center gap-1 flex-wrap bg-white rounded-2xl p-1.5 border border-slate-100 shadow-sm w-fit">
                {SUB_PAGES.map(({ id, label, icon: Icon }) => {
                    const isActive = subPage === id;
                    return (
                        <button key={id} onClick={() => setSubPage(id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all relative ${
                                isActive
                                    ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                            }`}>
                            <Icon size={15} />
                            {label}
                            {id === "advances" && pendingAdvancesCount > 0 && (
                                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"}`}>
                                    {pendingAdvancesCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Current sub-page */}
            {PAGE_MAP[subPage] || <ExpenditureOverview />}
        </div>
    );
}

export default function Expenditure() {
    return (
        <ExpenditureProvider>
            <ExpenditureInner />
        </ExpenditureProvider>
    );
}
