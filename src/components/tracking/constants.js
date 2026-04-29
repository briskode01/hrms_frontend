// @ts-nocheck
export const AVATAR_COLORS = [
    "bg-blue-500", "bg-violet-500", "bg-emerald-500",
    "bg-amber-500", "bg-pink-500", "bg-cyan-500", "bg-rose-500",
];

export const STATUS_STYLES = {
    "Travelling": "bg-blue-100 text-blue-700",
    "At Client": "bg-emerald-100 text-emerald-700",
    "Break": "bg-amber-100 text-amber-700",
    "Checked In": "bg-violet-100 text-violet-700",
    "Checked Out": "bg-slate-100 text-slate-600",
    "Unknown": "bg-slate-100 text-slate-500",
};

export const STATUS_ICONS = {
    "Travelling": "🚗",
    "At Client": "🤝",
    "Break": "☕",
    "Checked In": "📍",
    "Checked Out": "🏠",
    "Unknown": "❓",
};

export const getAvatarColor = (name = "") =>
    AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export const toDateInput = (d) => new Date(d).toISOString().split("T")[0];

export const timeAgo = (date) => {
    if (!date) return "Never";
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
};

export const formatTime = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};
