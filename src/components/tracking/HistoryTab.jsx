// @ts-nocheck
import { formatTime, STATUS_ICONS, STATUS_STYLES } from "./constants";

export default function HistoryTab({
    liveAgents,
    historyAgent,
    setHistoryAgent,
    historyDate,
    setHistoryDate,
    histLoading,
    onFetchHistory,
    historyData,
}) {
    return (
        <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-extrabold text-slate-900 mb-4">Select Agent & Date</h3>
                <div className="flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-50">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Field Agent</label>
                        <select
                            value={historyAgent}
                            onChange={(e) => setHistoryAgent(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                        >
                            <option value="">-- Select Agent --</option>
                            {liveAgents.map((agent) => (
                                <option key={agent.agent._id} value={agent.agent._id}>
                                    {agent.agent.firstName} {agent.agent.lastName} ({agent.agent.employeeId})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date</label>
                        <input
                            type="date"
                            value={historyDate}
                            onChange={(e) => setHistoryDate(e.target.value)}
                            className="px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                        />
                    </div>
                    <button
                        onClick={onFetchHistory}
                        disabled={histLoading}
                        className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-200 transition-all disabled:bg-slate-300 disabled:shadow-none"
                    >
                        {histLoading ? "Loading..." : "View History"}
                    </button>
                </div>
            </div>

            {historyData && (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Total Pings", value: historyData.summary.totalPings, icon: "📍", style: "bg-blue-50 border-blue-200 text-blue-700" },
                            { label: "Clients Visited", value: historyData.summary.clientsVisited.length, icon: "🤝", style: "bg-emerald-50 border-emerald-200 text-emerald-700" },
                            { label: "Time on Field", value: `${historyData.summary.timeOnField}m`, icon: "⏱️", style: "bg-violet-50 border-violet-200 text-violet-700" },
                            { label: "First Ping", value: formatTime(historyData.summary.firstPing), icon: "🌅", style: "bg-amber-50 border-amber-200 text-amber-700" },
                        ].map((card) => (
                            <div key={card.label} className={`rounded-2xl border p-4 shadow-sm ${card.style}`}>
                                <div className="text-2xl mb-1">{card.icon}</div>
                                <div className="text-xl font-extrabold">{card.value}</div>
                                <div className="text-xs font-bold opacity-80 mt-0.5">{card.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h3 className="font-extrabold text-slate-900">
                                Visit Log — {historyData.agent.name}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">{historyDate} · {historyData.data.length} pings</p>
                        </div>

                        {historyData.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                <div className="text-4xl mb-3">📭</div>
                                <p className="text-sm font-semibold text-slate-600">No pings recorded on this date</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {historyData.data.map((ping, index) => (
                                    <div key={ping._id} className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex flex-col items-center shrink-0 mt-1">
                                            <div className={`w-3 h-3 rounded-full border-2 border-white shadow
                            ${ping.visitStatus === "At Client" ? "bg-emerald-500"
                                                        : ping.visitStatus === "Break" ? "bg-amber-500"
                                                            : "bg-blue-500"}`}
                                            />
                                            {index < historyData.data.length - 1 && (
                                                <div className="w-0.5 h-8 bg-slate-200 mt-1" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-bold text-slate-700">
                                                    {formatTime(ping.createdAt)}
                                                </span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[ping.visitStatus]}`}>
                                                    {STATUS_ICONS[ping.visitStatus]} {ping.visitStatus}
                                                </span>
                                                {ping.clientName && (
                                                    <span className="text-xs font-bold text-emerald-600">
                                                        🤝 {ping.clientName}
                                                    </span>
                                                )}
                                            </div>
                                            {ping.address && (
                                                <p className="text-xs text-slate-400 mt-1">📍 {ping.address}</p>
                                            )}
                                            {ping.notes && (
                                                <p className="text-xs text-slate-600 mt-1 bg-slate-50 rounded-lg px-3 py-2">
                                                    💬 {ping.notes}
                                                </p>
                                            )}
                                            <p className="text-[10px] text-slate-400 mt-1">
                                                {ping.latitude.toFixed(4)}, {ping.longitude.toFixed(4)}
                                                {ping.accuracy > 0 && ` · ±${ping.accuracy}m`}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
