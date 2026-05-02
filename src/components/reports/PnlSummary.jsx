// @ts-nocheck
import { FileDown, CloudUpload, Loader2, ExternalLink } from "lucide-react";

export default function PnlSummary({ filterDate, pnlRows, netAfterSalary, onUpload, isUploading, onExport, uploadedPnlUrl }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
                <div>
                    <p className="font-extrabold text-slate-800">Profit & Loss Summary</p>
                    <p className="text-xs text-slate-400 mt-0.5">{filterDate ? `Filtered period: ${filterDate}` : "Current month summary"}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                    <button
                        onClick={onUpload}
                        disabled={isUploading}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isUploading ? <Loader2 size={14} className="animate-spin" /> : <CloudUpload size={14} />}
                        {isUploading ? "Uploading..." : "Auto Upload P&L"}
                    </button>
                    <button
                        onClick={onExport}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        <FileDown size={14} /> Export PDF
                    </button>
                </div>
            </div>
            <div className="p-5 space-y-3">
                {pnlRows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                        <span className="text-sm text-slate-600">{row.label}</span>
                        <span className={`text-sm font-extrabold ${row.color || ""}`}>{row.value}</span>
                    </div>
                ))}
                <div className={`flex items-center justify-between py-3 rounded-xl px-3 mt-2 ${netAfterSalary >= 0 ? "bg-emerald-50" : "bg-rose-50"}`}>
                    <span className="text-sm font-extrabold text-slate-700">Net Profit / Loss</span>
                    <span className={`text-lg font-extrabold ${netAfterSalary >= 0 ? "text-emerald-700" : "text-rose-700"}`}>{pnlRows[pnlRows.length - 1]?.value}</span>
                </div>
                {uploadedPnlUrl && (
                    <a
                        href={`http://localhost:8000${uploadedPnlUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                        <ExternalLink size={13} /> Open uploaded copy
                    </a>
                )}
            </div>
        </div>
    );
}
