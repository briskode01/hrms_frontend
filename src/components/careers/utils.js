export const formatSalary = (min, max) => {
    if (!min && !max) return null;
    const fmt = (n) => n >= 100000
        ? `₹${(n / 100000).toFixed(1)}L`
        : `₹${(n / 1000).toFixed(0)}K`;
    return `${fmt(min)} – ${fmt(max)} / year`;
};
