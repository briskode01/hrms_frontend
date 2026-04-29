// @ts-nocheck
import { TYPE_ICONS } from "./constants";

export default function CareersFilters({
    departments,
    jobTypes,
    filterDept,
    filterType,
    onDeptChange,
    onTypeChange,
}) {
    return (
        <div className="flex flex-wrap gap-3 mb-8 items-center">
            <span className="text-sm font-bold text-slate-500">Filter by:</span>
            <div className="flex flex-wrap gap-2">
                {departments.map((department) => (
                    <button
                        key={department}
                        onClick={() => onDeptChange(department)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border
                  ${filterDept === department
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
                    >
                        {department}
                    </button>
                ))}
            </div>
            <div className="w-px h-5 bg-slate-200 hidden sm:block" />
            <div className="flex flex-wrap gap-2">
                {jobTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => onTypeChange(type)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border
                  ${filterType === type
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}
                    >
                        {type === "All" ? "All Types" : `${TYPE_ICONS[type]} ${type}`}
                    </button>
                ))}
            </div>
        </div>
    );
}
