// @ts-nocheck
import { useMemo } from "react";

function matchDate(filterDate, value) {
    return value && value.startsWith(filterDate);
}

export default function useExpenditureReportData({ filterDate, allExpenses, allIncome, allAdvances, allPayrolls, fmtINR }) {
    const expenses = useMemo(() => {
        return filterDate ? allExpenses.filter((expense) => matchDate(filterDate, expense.date)) : allExpenses;
    }, [filterDate, allExpenses]);

    const income = useMemo(() => {
        return filterDate ? allIncome.filter((item) => matchDate(filterDate, item.date)) : allIncome;
    }, [filterDate, allIncome]);

    const advances = useMemo(() => {
        return filterDate
            ? allAdvances.filter((advance) => matchDate(filterDate, advance.date) || matchDate(filterDate, advance.createdAt))
            : allAdvances;
    }, [filterDate, allAdvances]);

    const reportMonth = useMemo(() => {
        return filterDate ? Number(filterDate.split("-")[1]) : new Date().getMonth() + 1;
    }, [filterDate]);

    const reportYear = useMemo(() => {
        return filterDate ? Number(filterDate.split("-")[0]) : new Date().getFullYear();
    }, [filterDate]);

    const payrolls = useMemo(() => {
        return (allPayrolls || []).filter((payroll) => payroll.year === reportYear && payroll.month === reportMonth);
    }, [allPayrolls, reportMonth, reportYear]);

    const totalIncome = useMemo(() => income.reduce((sum, item) => sum + Number(item.amount), 0), [income]);
    const totalExpenses = useMemo(() => expenses.reduce((sum, expense) => sum + Number(expense.amount), 0), [expenses]);
    const totalAdvances = useMemo(() => advances.reduce((sum, advance) => sum + Number(advance.amount), 0), [advances]);

    const expCatRows = useMemo(() => {
        const byCategory = {};
        expenses.forEach((expense) => {
            byCategory[expense.category] = (byCategory[expense.category] || 0) + Number(expense.amount);
        });
        return Object.entries(byCategory).map(([label, value]) => ({ label, value: fmtINR(value) }));
    }, [expenses, fmtINR]);

    const incSrcRows = useMemo(() => {
        const bySource = {};
        income.forEach((item) => {
            bySource[item.source] = (bySource[item.source] || 0) + Number(item.amount);
        });
        return Object.entries(bySource).map(([label, value]) => ({ label, value: fmtINR(value) }));
    }, [income, fmtINR]);

    const expDateRows = useMemo(() => {
        const byDate = {};
        expenses.forEach((expense) => {
            const dateKey = expense.date?.split("T")[0] || expense.date;
            byDate[dateKey] = (byDate[dateKey] || 0) + Number(expense.amount);
        });
        return Object.entries(byDate)
            .sort((a, b) => new Date(b[0]) - new Date(a[0]))
            .map(([label, value]) => ({ label, value: fmtINR(value) }));
    }, [expenses, fmtINR]);

    const incDateRows = useMemo(() => {
        const byDate = {};
        income.forEach((item) => {
            const dateKey = item.date?.split("T")[0] || item.date;
            byDate[dateKey] = (byDate[dateKey] || 0) + Number(item.amount);
        });
        return Object.entries(byDate)
            .sort((a, b) => new Date(b[0]) - new Date(a[0]))
            .map(([label, value]) => ({ label, value: fmtINR(value) }));
    }, [income, fmtINR]);

    const advRows = useMemo(() => {
        return advances.map((advance) => ({
            label: `${advance.employee} (${advance.employeeId})`,
            value: `${fmtINR(advance.amount)} — ${advance.status}`,
        }));
    }, [advances, fmtINR]);

    const salaryCost = useMemo(() => {
        return payrolls.reduce((sum, payroll) => {
            const grossSalary = Number(
                payroll.netSalary ??
                (Number(payroll.earnings?.basic) || 0) +
                (Number(payroll.earnings?.hra) || 0) +
                (Number(payroll.earnings?.bonus) || 0)
            );
            const totalDeductions = Number(payroll.deductions?.pf || 0)
                + Number(payroll.deductions?.esi || 0)
                + Number(payroll.deductions?.ptax || 0)
                + Number(payroll.deductions?.leaveDeduction || 0);

            const netSalary = payroll.netSalary != null
                ? Number(payroll.netSalary)
                : grossSalary - totalDeductions;

            return sum + Math.max(0, netSalary);
        }, 0);
    }, [payrolls]);

    const profit = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);
    const netAfterSalary = useMemo(() => profit - salaryCost, [profit, salaryCost]);
    const reportLabel = useMemo(() => (filterDate ? `P&L ${filterDate}` : `P&L ${new Date().toISOString().slice(0, 7)}`), [filterDate]);
    const outstandingAdvances = useMemo(() => {
        return advances.filter((advance) => advance.status === "Active").reduce((sum, advance) => sum + (advance.amount - (advance.paid || 0)), 0);
    }, [advances]);
    const monthlyExpenseRows = useMemo(() => [
        ...expCatRows,
        { label: "Salary Costs", value: fmtINR(salaryCost), color: "text-rose-600" },
    ], [expCatRows, salaryCost, fmtINR]);
    const monthlyExpenseTotal = useMemo(() => totalExpenses + salaryCost, [totalExpenses, salaryCost]);
    const pnlRows = useMemo(() => [
        { label: "Total Revenue", value: fmtINR(totalIncome), color: "text-emerald-600" },
        { label: "Total Expenses", value: fmtINR(totalExpenses), color: "text-rose-600" },
        { label: "Salary Costs", value: fmtINR(salaryCost), color: "text-rose-600" },
        { label: "Advances Outstanding", value: fmtINR(outstandingAdvances), color: "text-amber-600" },
        { label: "Net Profit / Loss", value: fmtINR(netAfterSalary) },
    ], [totalIncome, totalExpenses, salaryCost, netAfterSalary, outstandingAdvances, fmtINR]);

    return {
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
    };
}
