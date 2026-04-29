// @ts-nocheck
// Shared attendance utilities & constants

export const STATUS_TONE = {
    Present:      "bg-emerald-100 text-emerald-700",
    Late:         "bg-amber-100  text-amber-700",
    "Late Entry": "bg-amber-100  text-amber-700",
    Absent:       "bg-rose-100   text-rose-700",
    "On Leave":   "bg-sky-100    text-sky-700",
    "Half Day":   "bg-violet-100 text-violet-700",
    "Not Marked": "bg-slate-100  text-slate-600",
};

export const monthInputFromDate = (date) => {
    const year  = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
};

export const formatDate = (value) => {
    if (!value) return "--";
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
    }).format(new Date(value));
};

/** Parse a time string and return total minutes since midnight */
const parseMinutes = (timeString) => {
    if (!timeString) return null;
    const parts = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!parts) return null;
    let hours = parseInt(parts[1], 10);
    const minutes = parseInt(parts[2], 10);
    const period  = parts[3]?.toUpperCase();
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
};

/** 10:30 AM – 1:00 PM = Late Entry */
export const isLateEntry = (timeString) => {
    const m = parseMinutes(timeString);
    if (m === null) return false;
    return m >= 630 && m < 780; // 10:30 → 13:00
};

/** After 1:00 PM = Half Day */
export const isHalfDay = (timeString) => {
    const m = parseMinutes(timeString);
    if (m === null) return false;
    return m >= 780; // 13:00
};

/** Derive display status from a check-in time + raw DB status */
export const deriveStatus = (checkIn, rawStatus) => {
    if (!checkIn) return rawStatus;
    if (isHalfDay(checkIn))  return "Half Day";
    if (isLateEntry(checkIn)) return "Late Entry";
    return rawStatus;
};
