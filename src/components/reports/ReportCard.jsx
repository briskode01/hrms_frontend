// @ts-nocheck
import React from "react";
import { FileDown } from "lucide-react";

export default function ReportCard({ title, rows, total, totalLabel, color, onExport }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between`}>
                <p className="font-extrabold text-slate-800">{title}</p>
                {onExport && (
                    <button 
                        onClick={onExport}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        <FileDown size={14} /> Export PDF
                    </button>
                )}
            </div>
            <div className="divide-y divide-slate-50 max-h-[320px] overflow-y-auto">
                {rows.map((r, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3">
                        <span className="text-sm text-slate-600">{r.label}</span>
                        <span className={`text-sm font-extrabold ${color}`}>{r.value}</span>
                    </div>
                ))}
            </div>
            {total !== undefined && (
                <div className={`px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between`}>
                    <span className="text-sm font-extrabold text-slate-700">{totalLabel}</span>
                    <span className={`text-base font-extrabold ${color}`}>{total}</span>
                </div>
            )}
        </div>
    );
}
