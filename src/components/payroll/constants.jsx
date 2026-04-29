// @ts-nocheck
// client/src/components/payroll/constants.jsx
// Shared constants, style maps, and helpers for the Payroll module

export const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

export const YEARS = [2024, 2025, 2026, 2027];
export const STATUS_OPTIONS = ["All", "Draft", "Processed", "Paid", "Hold"];
export const PAYMENT_METHODS = ["Bank Transfer", "Cash", "Cheque"];

export const STATUS_STYLES = {
    Draft: "bg-slate-100 text-slate-600",
    Processed: "bg-blue-100 text-blue-700",
    Paid: "bg-emerald-100 text-emerald-700",
    Hold: "bg-amber-100 text-amber-700",
};

const AVATAR_COLORS = [
    "bg-blue-500", "bg-violet-500", "bg-emerald-500",
    "bg-amber-500", "bg-pink-500", "bg-cyan-500", "bg-rose-500",
];

export const getAvatarColor = (name = "") =>
    AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export const DEFAULT_GEN_FORM = {
    employeeId: "",
    attendance: {
        workingDays: 0,
        presentDays: 0,
        lopDays: 0,
    },
    earnings: {
        basic: 0,
        hraPercent: 0, // HRA as % of basic
        bonus: 0,
    },
    deductions: {
        pf: 0,       // auto: 12% of basic
        esi: 0,      // auto: 3.67% of basic
        ptax: 0,     // Professional Tax
        leaveDeduction: 0,
    },
    payment: {
        status: "Processed",
        mode: "Bank Transfer",
        date: "",
    },
};

// ─── Reusable field label ──────────────────────────────────────
export const FieldLabel = ({ label, required }) => (
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
    </label>
);
