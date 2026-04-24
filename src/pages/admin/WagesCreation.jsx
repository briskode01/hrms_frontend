// @ts-nocheck
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "@/api/axios";
import { Banknote } from "lucide-react";

import WorkerPanel   from "@/components/wages/WorkerPanel";
import WageForm, { calcTotal } from "@/components/wages/WageForm";
import WageTable     from "@/components/wages/WageTable";
import PaymentStepperModal from "@/components/payment-stepper/PaymentStepperModal";

// ─── Constants ────────────────────────────────────────────────
const today = new Date().toISOString().split("T")[0];
const EMPTY_FORM = {
    workerId:     "",
    workerType:   "Daily Worker",
    workingHours: "",
    workingDays:  "",
    rateAmount:   "",
    dateFrom:     today,
    dateTo:       today,
};

// Adapts a WageRecord into the shape PaymentStepperModal expects
function toPayrollShape(record) {
    const [firstName, ...rest] = (record.worker?.fullName || "").split(" ");
    return {
        _id:      record._id,
        employee: {
            _id:        record.worker?._id,
            firstName:  firstName || "",
            lastName:   rest.join(" ") || "",
            employeeId: record.worker?.phone || "",
            department: record.workerType,
        },
        earnings:   { basic: record.totalPayable, hra: 0, bonus: 0 },
        deductions: { pf: 0, esi: 0, ptax: 0, leaveDeduction: 0 },
        payment:    { status: record.status },
    };
}

// ─── Validation ───────────────────────────────────────────────
function validate(form) {
    if (!form.workerId)                 return "Please select a worker";
    if (!form.dateFrom || !form.dateTo) return "Date range is required";
    if (form.dateTo < form.dateFrom)    return "End date must be after start date";
    if (!(Number(form.rateAmount) > 0)) return "Rate must be greater than ₹0";
    if (form.workerType === "Daily Worker"  && (form.workingDays  === "" || Number(form.workingDays)  < 0)) return "Working days must be ≥ 0";
    if (form.workerType === "Hourly Worker" && (form.workingHours === "" || Number(form.workingHours) < 0)) return "Working hours must be ≥ 0";
    return null;
}

// ─── Page Component ───────────────────────────────────────────
export default function WagesCreation() {
    const now          = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear  = now.getFullYear();

    const [workers,      setWorkers]      = useState([]);
    const [wageRecords,  setWageRecords]  = useState([]);
    const [form,         setForm]         = useState(EMPTY_FORM);
    const [submitting,   setSubmitting]   = useState(false);
    const [loading,      setLoading]      = useState(true);
    const [payingRecord, setPayingRecord] = useState(null);

    // ─── Data fetching ────────────────────────────────────────
    const fetchWorkers = () =>
        API.get("/workers").then(({ data }) => setWorkers(data.data)).catch(() => {});

    const fetchWages = async () => {
        setLoading(true);
        try {
            const { data } = await API.get("/wages", { params: { month: currentMonth, year: currentYear } });
            setWageRecords(data.data);
        } catch {
            toast.error("Failed to load wage records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWorkers(); fetchWages(); }, []);

    // ─── Handlers ─────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validate(form);
        if (error) { toast.error(error); return; }

        setSubmitting(true);
        try {
            await API.post("/wages", {
                workerId:     form.workerId,
                month:        currentMonth,
                year:         currentYear,
                workerType:   form.workerType,
                rateAmount:   Number(form.rateAmount),
                workingDays:  form.workerType === "Daily Worker"  ? Number(form.workingDays)  : null,
                workingHours: form.workerType === "Hourly Worker" ? Number(form.workingHours) : null,
                totalPayable: calcTotal(form),
                dateFrom:     form.dateFrom,
                dateTo:       form.dateTo,
            });
            toast.success("Wage record created! 🎉");
            setForm(EMPTY_FORM);
            fetchWages();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create wage");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this wage record?")) return;
        try {
            await API.delete(`/wages/${id}`);
            toast.success("Deleted");
            setWageRecords(prev => prev.filter(r => r._id !== id));
        } catch {
            toast.error("Failed to delete");
        }
    };

    const handlePaymentSuccess = () => {
        setWageRecords(prev =>
            prev.map(r => r._id === payingRecord._id ? { ...r, status: "Paid" } : r)
        );
        setPayingRecord(null);
    };

    // ─── Render ───────────────────────────────────────────────
    return (
        <div className="space-y-6 max-w-7xl mx-auto">

            {/* Page Header */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <Banknote className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Wages Creation</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Register workers, define wage structures, and process payments</p>
                </div>
            </div>

            {/* 3-column layout */}
            <div className="grid grid-cols-1 xl:grid-cols-[300px_340px_1fr] gap-6 items-start">

                {/* Col 1 — Worker Registry */}
                <WorkerPanel
                    workers={workers}
                    onWorkerCreated={w  => setWorkers(prev => [w, ...prev])}
                    onWorkerDeleted={id => setWorkers(prev => prev.filter(w => w._id !== id))}
                />

                {/* Col 2 — Wage Entry Form */}
                <WageForm
                    form={form}
                    setForm={setForm}
                    workers={workers}
                    submitting={submitting}
                    onSubmit={handleSubmit}
                />

                {/* Col 3 — Wage Records Table */}
                <WageTable
                    records={wageRecords}
                    loading={loading}
                    month={currentMonth}
                    year={currentYear}
                    onPay={setPayingRecord}
                    onDelete={handleDelete}
                    onRefresh={fetchWages}
                />
            </div>

            {/* Payment Stepper Modal */}
            {payingRecord && (
                <PaymentStepperModal
                    payroll={toPayrollShape(payingRecord)}
                    apiPath="/wages"
                    onClose={() => setPayingRecord(null)}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
}
