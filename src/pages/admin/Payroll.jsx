// @ts-nocheck
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "@/api/axios";

import { DEFAULT_GEN_FORM, MONTHS, STATUS_OPTIONS, YEARS } from "@/components/payroll/constants";
import GeneratePayrollModal from "@/components/payroll/GeneratePayrollModal";
import PayrollTable from "@/components/payroll/PayrollTable";
import PayslipModal from "@/components/payroll/PayslipModal";
import StatsCards from "@/components/payroll/StatsCards";
import PaymentStepperModal from "@/components/payment-stepper/PaymentStepperModal";

const currentMonth = new Date().getMonth() + 1;
const currentYear  = new Date().getFullYear();

export default function Payroll() {
    const [payrolls,      setPayrolls]      = useState([]);
    const [employees,     setEmployees]     = useState([]);
    const [stats,         setStats]         = useState(null);
    const [loading,       setLoading]       = useState(true);
    const [runningAll,    setRunningAll]     = useState(false);

    // Filters
    const [selectedMonth,  setSelectedMonth]  = useState(currentMonth);
    const [selectedYear,   setSelectedYear]   = useState(currentYear);
    const [selectedStatus, setSelectedStatus] = useState("All");

    // Modals
    const [showGenModal,   setShowGenModal]   = useState(false);
    const [genForm,        setGenForm]        = useState(DEFAULT_GEN_FORM);
    const [showSlipModal,  setShowSlipModal]  = useState(null);
    const [payingPayroll,  setPayingPayroll]  = useState(null);

    // ─── Fetch ──────────────────────────────────────────────────
    const fetchPayrolls = async () => {
        try {
            setLoading(true);
            const params = { month: selectedMonth, year: selectedYear };
            if (selectedStatus !== "All") params.status = selectedStatus;
            const { data } = await API.get("/payroll", { params });
            setPayrolls(data.data);
        } catch {
            toast.error("Failed to fetch payroll records");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await API.get("/payroll/stats/summary", {
                params: { month: selectedMonth, year: selectedYear },
            });
            setStats(data.data);
        } catch { /* silent */ }
    };

    const fetchEmployees = async () => {
        try {
            const { data } = await API.get("/employees", { params: { status: "Active" } });
            setEmployees(data.data);
        } catch { /* silent */ }
    };

    useEffect(() => { fetchPayrolls(); fetchStats(); }, [selectedMonth, selectedYear, selectedStatus]);
    useEffect(() => { fetchEmployees(); }, []);

    // ─── Actions ────────────────────────────────────────────────
    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            const hraRupees = Math.round(
                Number(genForm.earnings.basic || 0) * (Number(genForm.earnings.hraPercent || 0) / 100)
            );
            await API.post("/payroll/generate", {
                employeeId: genForm.employeeId,
                month: selectedMonth,
                year:  selectedYear,
                attendance: genForm.attendance,
                earnings: {
                    basic: Number(genForm.earnings.basic || 0),
                    hra:   hraRupees,
                    bonus: Number(genForm.earnings.bonus || 0),
                },
                deductions: genForm.deductions,
                payment:    genForm.payment,
            });
            toast.success("Payroll generated! 🎉");
            setShowGenModal(false);
            setGenForm(DEFAULT_GEN_FORM);
            fetchPayrolls();
            fetchStats();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to generate payroll");
        }
    };

    const handleRunAll = async () => {
        if (!window.confirm(`Run payroll for ALL active employees for ${MONTHS[selectedMonth - 1]} ${selectedYear}?`)) return;
        try {
            setRunningAll(true);
            const { data } = await API.post("/payroll/run-all", { month: selectedMonth, year: selectedYear });
            toast.success(data.message);
            fetchPayrolls();
            fetchStats();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to run payroll");
        } finally {
            setRunningAll(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this payroll record?")) return;
        try {
            await API.delete(`/payroll/${id}`);
            toast.success("Deleted successfully");
            fetchPayrolls();
            fetchStats();
        } catch {
            toast.error("Failed to delete");
        }
    };

    // ─── UI ─────────────────────────────────────────────────────
    return (
        <div className="space-y-6 max-w-7xl mx-auto">

            {/* Page Header */}
            <div className="flex items-center justify-between flex-wrap gap-4 bg-white rounded-3xl shadow-xs border border-slate-200 p-6">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        <span className="text-3xl">🏦</span> Payroll Ledger
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm">
                        Generate, view and process employee payroll records.
                    </p>
                </div>

                {/* Action Buttons + Filters */}
                <div className="flex flex-wrap gap-3 items-center">
                    {/* Month */}
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                        {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                    </select>

                    {/* Year */}
                    <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                        {YEARS.map((y) => <option key={y}>{y}</option>)}
                    </select>

                    {/* Status */}
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                        {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                    </select>

                    {/* Run All */}
                    <button onClick={handleRunAll} disabled={runningAll}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-200 text-sm transition-all active:scale-[0.98]">
                        {runningAll
                            ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing...</>
                            : "⚡ Run All"}
                    </button>

                    {/* Generate Individual */}
                    <button onClick={() => setShowGenModal(true)}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl shadow-md text-sm transition-all active:scale-[0.98]">
                        + Generate Payroll
                    </button>
                </div>
            </div>

            {/* Stats */}
            <StatsCards stats={stats} selectedMonth={selectedMonth} selectedYear={selectedYear} />

            {/* Table */}
            <PayrollTable
                payrolls={payrolls}
                loading={loading}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onViewSlip={setShowSlipModal}
                onOpenPaymentStepper={setPayingPayroll}
                onDelete={handleDelete}
            />

            {/* Generate Payroll Modal */}
            {showGenModal && (
                <GeneratePayrollModal
                    form={genForm}
                    setForm={setGenForm}
                    employees={employees}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onSubmit={handleGenerate}
                    onClose={() => { setShowGenModal(false); setGenForm(DEFAULT_GEN_FORM); }}
                />
            )}

            {/* Payment Gateway Stepper */}
            {payingPayroll && (
                <PaymentStepperModal
                    payroll={payingPayroll}
                    onClose={() => setPayingPayroll(null)}
                    onSuccess={() => { fetchPayrolls(); fetchStats(); setPayingPayroll(null); }}
                />
            )}

            {/* Payslip Modal */}
            {showSlipModal && (
                <PayslipModal
                    payroll={showSlipModal}
                    onClose={() => setShowSlipModal(null)}
                />
            )}
        </div>
    );
}