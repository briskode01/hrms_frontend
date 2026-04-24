// @ts-nocheck
import { createContext, useContext, useEffect, useState } from "react";
import API from "../../../api/axios";
import toast from "react-hot-toast";

// ─── Shared helpers ───────────────────────────────────────────
export const fmtINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
export const today  = () => new Date().toISOString().slice(0, 10);

const ExpenditureContext = createContext(null);

export function ExpenditureProvider({ children }) {
    const [expenses, setExpenses]   = useState([]);
    const [income,   setIncome]     = useState([]);
    const [advances, setAdvances]   = useState([]);
    const [stats,    setStats]      = useState(null);
    const [loading,  setLoading]    = useState(true);
    const [subPage,  setSubPage]    = useState("overview");

    // ─── Fetch all data ───────────────────────────────────────
    const fetchAll = async () => {
        try {
            setLoading(true);
            const [expRes, incRes, advRes, statRes] = await Promise.all([
                API.get("/expenditure/expenses"),
                API.get("/expenditure/income"),
                API.get("/expenditure/advances"),
                API.get("/expenditure/stats"),
            ]);
            setExpenses(expRes.data?.data  || []);
            setIncome(incRes.data?.data    || []);
            setAdvances(advRes.data?.data  || []);
            setStats(statRes.data?.data    || null);
        } catch (e) {
            toast.error("Failed to load expenditure data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    // ─── Expenses CRUD ────────────────────────────────────────
    const addExpense = async (data) => {
        try {
            const res = await API.post("/expenditure/expenses", data);
            setExpenses(p => [res.data.data, ...p]);
            toast.success("Expense added");
        } catch (e) { toast.error(e.response?.data?.message || "Failed to add expense"); }
    };

    const editExpense = async (data) => {
        try {
            const res = await API.put(`/expenditure/expenses/${data._id || data.id}`, data);
            setExpenses(p => p.map(x => (x._id === res.data.data._id ? res.data.data : x)));
            toast.success("Expense updated");
        } catch (e) { toast.error(e.response?.data?.message || "Failed to update expense"); }
    };

    const deleteExpense = async (id) => {
        try {
            await API.delete(`/expenditure/expenses/${id}`);
            setExpenses(p => p.filter(x => x._id !== id && x.id !== id));
            toast.success("Expense deleted");
        } catch (e) { toast.error(e.response?.data?.message || "Failed to delete expense"); }
    };

    // ─── Income CRUD ──────────────────────────────────────────
    const addIncome = async (data) => {
        try {
            const res = await API.post("/expenditure/income", data);
            setIncome(p => [res.data.data, ...p]);
            toast.success("Income record added");
        } catch (e) { toast.error(e.response?.data?.message || "Failed to add income"); }
    };

    const editIncome = async (data) => {
        try {
            const res = await API.put(`/expenditure/income/${data._id || data.id}`, data);
            setIncome(p => p.map(x => (x._id === res.data.data._id ? res.data.data : x)));
            toast.success("Income updated");
        } catch (e) { toast.error(e.response?.data?.message || "Failed to update income"); }
    };

    const deleteIncome = async (id) => {
        try {
            await API.delete(`/expenditure/income/${id}`);
            setIncome(p => p.filter(x => x._id !== id && x.id !== id));
            toast.success("Income record deleted");
        } catch (e) { toast.error(e.response?.data?.message || "Failed to delete income"); }
    };

    // ─── Advances CRUD ────────────────────────────────────────
    const addAdvance = async (data) => {
        try {
            const res = await API.post("/expenditure/advances", data);
            setAdvances(p => [res.data.data, ...p]);
            toast.success("Advance recorded");
        } catch (e) { toast.error(e.response?.data?.message || "Failed to add advance"); }
    };

    const editAdvance = async (data) => {
        try {
            const res = await API.put(`/expenditure/advances/${data._id || data.id}`, data);
            setAdvances(p => p.map(x => (x._id === res.data.data._id ? res.data.data : x)));
            toast.success("Advance updated");
        } catch (e) { toast.error(e.response?.data?.message || "Failed to update advance"); }
    };

    const deleteAdvance = async (id) => {
        try {
            await API.delete(`/expenditure/advances/${id}`);
            setAdvances(p => p.filter(x => x._id !== id && x.id !== id));
            toast.success("Advance deleted");
        } catch (e) { toast.error(e.response?.data?.message || "Failed to delete advance"); }
    };

    const clearAdvance = async (id) => {
        try {
            const res = await API.patch(`/expenditure/advances/${id}/clear`);
            setAdvances(p => p.map(x => (x._id === res.data.data._id ? res.data.data : x)));
            toast.success("Advance marked as cleared");
        } catch (e) { toast.error(e.response?.data?.message || "Failed to clear advance"); }
    };

    // ─── Derived totals (from live state) ─────────────────────
    const totalIncome   = income.reduce((s, i)   => s + Number(i.amount), 0);
    const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const totalAdvances = advances.reduce((s, a) => s + Number(a.amount), 0);
    const pendingAdvancesCount = advances.filter(a => a.status === "Active").length;

    // Normalize id for items from DB (_id) vs local
    const getId = (item) => item._id || item.id;

    return (
        <ExpenditureContext.Provider value={{
            expenses, income, advances, stats, loading, subPage, setSubPage,
            addExpense, editExpense, deleteExpense,
            addIncome, editIncome, deleteIncome,
            addAdvance, editAdvance, deleteAdvance, clearAdvance,
            totalIncome, totalExpenses, totalAdvances, pendingAdvancesCount,
            fmtINR, getId, fetchAll,
        }}>
            {children}
        </ExpenditureContext.Provider>
    );
}

export const useExpenditure = () => useContext(ExpenditureContext);
