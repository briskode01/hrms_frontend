// @ts-nocheck
export default function TrackingHeader({ refreshing, onRefresh }) {
    return (
        <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Field Tracking</h2>
                <p className="text-sm text-slate-400 mt-0.5">
                    Live location of field agents
                    {refreshing && <span className="ml-2 text-blue-500 text-xs animate-pulse">● Refreshing...</span>}
                </p>
            </div>
            <button
                onClick={onRefresh}
                className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-400 text-slate-600 text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
                🔄 Refresh
            </button>
        </div>
    );
}
