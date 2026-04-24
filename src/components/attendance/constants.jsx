// @ts-nocheck
// client/src/components/attendance/constants.jsx
// Shared constants, style maps, and helpers for the Attendance module

export const STATUS_OPTIONS = ["Present", "Absent", "On Leave", "Half Day", "Late"];
export const LEAVE_TYPES = ["", "Sick Leave", "Casual Leave", "Paid Leave", "Unpaid Leave"];

export const STATUS_STYLES = {
    Present: "bg-emerald-100 text-emerald-700",
    Absent: "bg-red-100 text-red-600",
    "On Leave": "bg-amber-100 text-amber-700",
    "Half Day": "bg-blue-100 text-blue-600",
    Late: "bg-violet-100 text-violet-600",
};

export const STATUS_ICONS = {
    Present: "✅", Absent: "❌", "On Leave": "🏖️", "Half Day": "🕐", Late: "⏰",
};

const AVATAR_COLORS = [
    "bg-blue-500", "bg-violet-500", "bg-emerald-500",
    "bg-amber-500", "bg-pink-500", "bg-cyan-500", "bg-rose-500",
];

export const getAvatarColor = (name = "") =>
    AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export const toDateInput = (d) => new Date(d).toISOString().split("T")[0];
export const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

// ─── Format check-in/check-out time in Indian timezone (IST) ──────────────────────────────────────
export const formatCheckInTime = (time) => {
    if (!time) return "—";
    try {
        // If time is already a string in HH:MM AM/PM or HH:MM format, just return it
        if (typeof time === "string" && !time.includes("T") && !time.includes("-")) {
            return time;
        }
        // Otherwise parse as ISO date and format
        const date = new Date(time);
        if (isNaN(date.getTime())) return "—";
        
        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    } catch {
        return "—";
    }
};

// ─── Reusable field label ──────────────────────────────────────
export const FieldLabel = ({ label, required }) => (
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
    </label>
);
