import React from "react";
import { Calendar, Gift } from "lucide-react";

export default function HolidayDetailsSidebar({ 
    selectedDate, 
    dateHolidays, 
    onSelectHoliday, 
    onNavigateToForm 
}) {
    return (
        <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/50 p-6 sm:p-8 flex flex-col h-full">
            <div className="flex-1">
            {selectedDate ? (
                <>
                    <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">
                        {selectedDate.toLocaleString("default", { month: "long" })}
                    </div>
                    <h3 className="font-extrabold text-3xl text-slate-900 mb-6 flex gap-2 items-baseline">
                    {selectedDate.getDate()}
                    <span className="text-base text-slate-500 font-semibold lowercase">
                        {selectedDate.toLocaleString("default", { weekday: "long" })}
                    </span>
                    </h3>

                    <div className="space-y-4">
                    {dateHolidays.length > 0 ? (
                        dateHolidays.map((holiday) => (
                        <div
                            key={holiday._id}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group cursor-pointer hover:shadow-md transition-all"
                            onClick={() => onSelectHoliday?.(holiday)}
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: holiday.color || "#6366f1" }}></div>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2" style={{ backgroundColor: `${holiday.color}20`, color: holiday.color || "#6366f1" }}>
                                {holiday.type}
                            </span>
                            <h4 className="font-extrabold text-slate-800 text-base leading-tight mb-1">
                            {holiday.name}
                            </h4>
                            {holiday.description && (
                            <p className="text-xs text-slate-500 line-clamp-3 mt-2 pr-2">
                                {holiday.description}
                            </p>
                            )}
                        </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-10 opacity-60">
                            <Gift className="w-12 h-12 text-slate-300 mb-3" />
                            <p className="text-sm font-bold text-slate-500 mb-1">No Holidays</p>
                            <p className="text-xs text-slate-400">Regular working day.</p>
                        </div>
                    )}
                    </div>
                </>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60 py-20">
                    <Calendar className="w-16 h-16 text-slate-300 mb-4 stroke-1" />
                    <h3 className="font-bold text-slate-600 mb-1">Select a Date</h3>
                    <p className="text-xs text-slate-400 font-medium max-w-[180px]">Click any date to view scheduled holidays or events.</p>
                </div>
            )}
            </div>

            {onNavigateToForm && (
            <div className="mt-8 pt-6 border-t border-slate-200">
                <button
                onClick={() => onNavigateToForm?.(selectedDate || new Date())}
                className="w-full py-3.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                Add Holiday
                </button>
            </div>
            )}
        </div>
    );
}
