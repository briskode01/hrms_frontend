export const DEPT_COLORS = {
    Engineering: "bg-blue-100 text-blue-700",
    Marketing: "bg-pink-100 text-pink-700",
    HR: "bg-violet-100 text-violet-700",
    Finance: "bg-emerald-100 text-emerald-700",
    Sales: "bg-amber-100 text-amber-700",
    Operations: "bg-cyan-100 text-cyan-700",
    Design: "bg-rose-100 text-rose-700",
};

export const STATUS_STYLES = {
    New: "bg-blue-100 text-blue-700",
    Reviewed: "bg-emerald-100 text-emerald-700",
};

export const JOB_STATUS_STYLES = {
    Active: "bg-emerald-100 text-emerald-700",
    Closed: "bg-red-100 text-red-600",
    Draft: "bg-slate-100 text-slate-600",
};

export const DEPARTMENTS = ["Engineering", "Marketing", "HR", "Finance", "Sales", "Operations", "Design"];
export const JOB_TYPES = ["Full-Time", "Part-Time", "Contract", "Intern", "Remote"];
export const EXP_LEVELS = ["Fresher", "1-2 Years", "3-5 Years", "5+ Years"];

export const defaultJobForm = {
    title: "", department: "Engineering", location: "",
    jobType: "Full-Time", experienceLevel: "Fresher",
    salaryMin: "", salaryMax: "",
    description: "", requirements: "", responsibilities: "",
    status: "Active", deadline: "",
};

export const AVATAR_COLORS = [
    "bg-blue-500", "bg-violet-500", "bg-emerald-500",
    "bg-amber-500", "bg-pink-500", "bg-cyan-500",
];
