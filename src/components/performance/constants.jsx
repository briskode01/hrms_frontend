// @ts-nocheck
// client/src/components/performance/constants.js
// Shared constants, style maps, and helpers for the Performance module

export const REVIEW_CYCLES = ["All", "Q1", "Q2", "Q3", "Q4", "Annual", "Probation"];
export const CYCLES_NO_ALL = ["Q1", "Q2", "Q3", "Q4", "Annual", "Probation"];
export const STATUSES = ["All", "Draft", "Submitted", "Acknowledged", "Closed"];
export const YEARS = [2024, 2025, 2026, 2027];

export const GRADE_STYLES = {
    Excellent: { badge: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-500" },
    Good: { badge: "bg-blue-100 text-blue-700", bar: "bg-blue-500" },
    Average: { badge: "bg-amber-100 text-amber-700", bar: "bg-amber-500" },
    "Needs Improvement": { badge: "bg-orange-100 text-orange-600", bar: "bg-orange-500" },
    Poor: { badge: "bg-red-100 text-red-600", bar: "bg-red-500" },
};

export const STATUS_STYLES = {
    Draft: "bg-slate-100 text-slate-600",
    Submitted: "bg-blue-100 text-blue-700",
    Acknowledged: "bg-violet-100 text-violet-700",
    Closed: "bg-emerald-100 text-emerald-700",
};

const AVATAR_COLORS = [
    "bg-blue-500", "bg-violet-500", "bg-emerald-500",
    "bg-amber-500", "bg-pink-500", "bg-cyan-500", "bg-rose-500",
];

export const getAvatarColor = (name = "") =>
    AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export const STAR_LABELS = { 1: "Poor", 2: "Below Avg", 3: "Average", 4: "Good", 5: "Excellent" };

export const DEFAULT_KPIS = [
    { title: "Goals & Targets", target: 100, achieved: 0, weight: 2, remarks: "" },
    { title: "Quality of Work", target: 100, achieved: 0, weight: 2, remarks: "" },
    { title: "Productivity", target: 100, achieved: 0, weight: 2, remarks: "" },
    { title: "Initiative", target: 100, achieved: 0, weight: 1, remarks: "" },
    { title: "Deadline Adherence", target: 100, achieved: 0, weight: 1, remarks: "" },
];

export const DEFAULT_FORM = {
    employee: "", reviewCycle: "Q1", year: new Date().getFullYear(),
    reviewerName: "HR Admin",
    kpis: DEFAULT_KPIS,
    technicalSkills: 3, communication: 3, teamwork: 3,
    leadership: 3, punctuality: 3, problemSolving: 3,
    strengths: "", areasOfImprovement: "", goals: "",
    managerComments: "", employeeComments: "",
    incrementRecommended: false, incrementPercent: 0,
    promotionRecommended: false, status: "Submitted",
};

// ─── Reusable tiny UI helpers ─────────────────────────────────
export const SectionLabel = ({ color, title }) => {
    const colors = {
        blue: "text-blue-600 bg-blue-600",
        violet: "text-violet-600 bg-violet-600",
        amber: "text-amber-600 bg-amber-600",
        emerald: "text-emerald-600 bg-emerald-600",
        rose: "text-rose-600 bg-rose-600",
    };
    return (
        <h3 className={`text-xs font-extrabold ${colors[color].split(" ")[0]} uppercase tracking-widest mb-4 flex items-center gap-2`}>
            <span className={`w-5 h-0.5 ${colors[color].split(" ")[1]} rounded`} />
            {title}
        </h3>
    );
};

export const FieldLabel = ({ label, required }) => (
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
    </label>
);
