// @ts-nocheck
import { FaBriefcase, FaCheckCircle, FaClipboardList, FaUsers } from "react-icons/fa";

export default function RecruitmentStats({ stats }) {
    if (!stats) return null;

    const cards = [
        { label: "Active Jobs", value: stats.activeJobs, icon: <FaBriefcase className="text-2xl" />, style: "bg-blue-50 border-blue-200 text-blue-700" },
        { label: "Total Applicants", value: stats.totalApplications, icon: <FaUsers className="text-2xl" />, style: "bg-violet-50 border-violet-200 text-violet-700" },
        { label: "New (Unreviewed)", value: stats.newApplications, icon: <FaClipboardList className="text-2xl" />, style: "bg-amber-50 border-amber-200 text-amber-700" },
        { label: "Reviewed", value: stats.reviewedApplications, icon: <FaCheckCircle className="text-2xl" />, style: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
                <div key={card.label} className={`rounded-2xl border p-5 shadow-sm ${card.style}`}>
                    <div className="mb-2">{card.icon}</div>
                    <div className="text-3xl font-extrabold">{card.value}</div>
                    <div className="text-xs font-bold opacity-80 mt-1">{card.label}</div>
                </div>
            ))}
        </div>
    );
}
