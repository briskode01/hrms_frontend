// @ts-nocheck
import LiveMap from "./LiveMap";
import { getAvatarColor, STATUS_ICONS, STATUS_STYLES, timeAgo } from "./constants";

export default function LiveTab({ liveAgents, loading, selectedAgent, setSelectedAgent }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="font-extrabold text-slate-900">Field Agents</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{liveAgents.length} agents · auto-refreshes every 30s</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3" />
                        <p className="text-sm">Loading agents...</p>
                    </div>
                ) : liveAgents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 px-4 text-center">
                        <div className="text-4xl mb-3">👥</div>
                        <p className="text-sm font-semibold text-slate-600">No field agents yet</p>
                        <p className="text-xs mt-1">Go to "Manage Agents" tab to mark employees as field agents</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50 max-h-120 overflow-y-auto">
                        {liveAgents.map((agentData) => {
                            const name = `${agentData.agent.firstName} ${agentData.agent.lastName}`;
                            const isSelected = selectedAgent?.agent?.employeeId === agentData.agent.employeeId;

                            return (
                                <button
                                    key={agentData.agent.employeeId}
                                    onClick={() => setSelectedAgent(isSelected ? null : agentData)}
                                    className={`w-full text-left px-5 py-4 transition-colors hover:bg-blue-50/50
                        ${isSelected ? "bg-blue-50 border-l-4 border-blue-500" : ""}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative shrink-0">
                                            <div className={`w-10 h-10 rounded-full ${getAvatarColor(agentData.agent.firstName)} text-white text-xs font-bold flex items-center justify-center`}>
                                                {agentData.agent.firstName[0]}{agentData.agent.lastName[0]}
                                            </div>
                                            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                            ${agentData.hasLocation ? "bg-emerald-500" : "bg-slate-300"}`}
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">{name}</p>
                                            <p className="text-xs text-slate-400 truncate">{agentData.agent.department}</p>
                                            {agentData.hasLocation ? (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLES[agentData.visitStatus]}`}>
                                                        {STATUS_ICONS[agentData.visitStatus]} {agentData.visitStatus}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">{timeAgo(agentData.lastSeen)}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-slate-400 mt-1 block">No location data</span>
                                            )}
                                        </div>
                                    </div>

                                    {agentData.clientName && (
                                        <div className="mt-2 ml-13 pl-13">
                                            <p className="text-xs text-emerald-600 font-medium ml-12 truncate">
                                                🤝 {agentData.clientName}
                                            </p>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{ minHeight: "520px" }}>
                {liveAgents.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                        <div className="text-6xl mb-4">🗺️</div>
                        <p className="text-base font-semibold text-slate-600">Map will appear here</p>
                        <p className="text-sm mt-1">Once field agents start sending location data, they'll appear on this map</p>
                    </div>
                ) : (
                    <LiveMap
                        agents={liveAgents}
                        selectedAgent={selectedAgent}
                        onAgentClick={setSelectedAgent}
                    />
                )}
            </div>
        </div>
    );
}
