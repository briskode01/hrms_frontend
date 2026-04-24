// @ts-nocheck

export const formatCurrency = (n) =>
  n ? `₹${Number(n).toLocaleString("en-IN")}` : "—";

export const formatTime = (t) => {
  if (!t) return "--";
  
  // If it's already a formatted time string (e.g., "10:30 AM"), return as-is
  if (typeof t === "string" && /^\d{1,2}:\d{2}\s*(AM|PM)?$/i.test(t)) {
    return t;
  }
  
  try {
    return new Date(t).toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "--";
  }
};

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};
