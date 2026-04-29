// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import API from "@/api/axios";
import { toDateInput } from "@/components/tracking/constants";
import HistoryTab from "@/components/tracking/HistoryTab";
import LiveTab from "@/components/tracking/LiveTab";
import ManageAgentsTab from "@/components/tracking/ManageAgentsTab";
import TrackingHeader from "@/components/tracking/TrackingHeader";
import TrackingStatsCards from "@/components/tracking/TrackingStatsCards";
import TrackingTabs from "@/components/tracking/TrackingTabs";

export default function Tracking() {
    const today = toDateInput(new Date());

    const [activeTab, setActiveTab] = useState("live");
    const [liveAgents, setLiveAgents] = useState([]);
    const [stats, setStats] = useState(null);
    const [allEmployees, setAllEmployees] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [historyAgent, setHistoryAgent] = useState("");
    const [historyDate, setHistoryDate] = useState(today);
    const [historyData, setHistoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [histLoading, setHistLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const refreshTimer = useRef(null);

    const fetchLive = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            else setRefreshing(true);
            const { data } = await API.get("/tracking/live");
            setLiveAgents(data.data);
        } catch {
            if (!silent) toast.error("Failed to fetch live locations");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await API.get("/tracking/stats");
            setStats(data.data);
        } catch {
            // silent
        }
    };

    const fetchEmployees = async () => {
        try {
            const { data } = await API.get("/employees");
            setAllEmployees(data.data);
        } catch {
            // silent
        }
    };

    useEffect(() => {
        fetchLive();
        fetchStats();
        fetchEmployees();

        refreshTimer.current = setInterval(() => {
            fetchLive(true);
            fetchStats();
        }, 30000);

        return () => clearInterval(refreshTimer.current);
    }, []);

    const fetchHistory = async () => {
        if (!historyAgent) {
            toast.error("Please select an agent");
            return;
        }

        try {
            setHistLoading(true);
            const { data } = await API.get(`/tracking/history/${historyAgent}`, {
                params: { date: historyDate },
            });
            setHistoryData(data);
        } catch {
            toast.error("Failed to fetch history");
        } finally {
            setHistLoading(false);
        }
    };

    const handleToggleFieldAgent = async (employeeId) => {
        try {
            const { data } = await API.put(`/tracking/agents/${employeeId}/toggle`);
            toast.success(data.message);
            fetchEmployees();
            fetchLive(true);
        } catch {
            toast.error("Failed to update field agent status");
        }
    };

    const fieldAgents = allEmployees.filter((employee) => employee.isFieldAgent);
    const nonFieldAgents = allEmployees.filter((employee) => !employee.isFieldAgent);

    return (
        <div className="space-y-6">
            <TrackingHeader
                refreshing={refreshing}
                onRefresh={() => {
                    fetchLive();
                    fetchStats();
                }}
            />

            <TrackingStatsCards stats={stats} />
            <TrackingTabs activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === "live" && (
                <LiveTab
                    liveAgents={liveAgents}
                    loading={loading}
                    selectedAgent={selectedAgent}
                    setSelectedAgent={setSelectedAgent}
                />
            )}

            {activeTab === "history" && (
                <HistoryTab
                    liveAgents={liveAgents}
                    historyAgent={historyAgent}
                    setHistoryAgent={setHistoryAgent}
                    historyDate={historyDate}
                    setHistoryDate={setHistoryDate}
                    histLoading={histLoading}
                    onFetchHistory={fetchHistory}
                    historyData={historyData}
                />
            )}

            {activeTab === "agents" && (
                <ManageAgentsTab
                    fieldAgents={fieldAgents}
                    nonFieldAgents={nonFieldAgents}
                    onToggleFieldAgent={handleToggleFieldAgent}
                />
            )}
        </div>
    );
}
