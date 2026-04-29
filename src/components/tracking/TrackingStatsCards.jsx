// @ts-nocheck
import { FaCheckCircle, FaHandshake, FaMapMarkerAlt, FaUsers } from "react-icons/fa";

export default function TrackingStatsCards({ stats }) {
    if (!stats) return null;

    const statCards = [
        { label: "Field Agents", value: stats.totalFieldAgents, icon: <FaUsers className="text-2xl" />, style: "bg-blue-50 border-blue-200 text-blue-700" },
        { label: "Active Today", value: stats.activeToday, icon: <FaCheckCircle className="text-2xl" />, style: "bg-emerald-50 border-emerald-200 text-emerald-700" },
        { label: "At Client Now", value: stats.atClientNow, icon: <FaHandshake className="text-2xl" />, style: "bg-violet-50 border-violet-200 text-violet-700" },
        { label: "Pings Today", value: stats.totalPingsToday, icon: <FaMapMarkerAlt className="text-2xl" />, style: "bg-amber-50 border-amber-200 text-amber-700" },
        
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => (
                <div key={card.label} className={`rounded-2xl border p-4 shadow-sm ${card.style}`}>
                    <div className="mb-1">{card.icon}</div>
                    <div className="text-2xl font-extrabold">{card.value}</div>
                    <div className="text-xs font-bold opacity-80 mt-0.5">{card.label}</div>
                </div>
            ))}
        </div>
    );
}
