// @ts-nocheck

export const STATUS_STYLES = {
  Present: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  Late: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  "Half Day": { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  "On Leave": { bg: "bg-violet-100", text: "text-violet-700", dot: "bg-violet-500" },
  Absent: { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" },
  "Not Marked": { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" },
};

export const GRADE_CONFIG = {
  Excellent: { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", bar: "bg-emerald-500", emoji: "🌟" },
  Good: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", bar: "bg-blue-500", emoji: "👍" },
  Average: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", bar: "bg-amber-500", emoji: "📊" },
  "Needs Improvement": { color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", bar: "bg-orange-500", emoji: "📈" },
  Poor: { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", bar: "bg-red-500", emoji: "⚠️" },
};

export const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const QUICK_LINKS = [
  { icon: "📅", label: "My Attendance", path: "attendance", color: "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600" },
  { icon: "📈", label: "My Reviews", path: "performance", color: "hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600" },
  { icon: "👤", label: "My Profile", path: "profile", color: "hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600" },
];
