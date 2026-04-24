// @ts-nocheck
import { useEffect, useState } from "react";
import API from "../../../../api/axios";
import ApplyLeaveModal from "./ApplyLeaveModal";

export default function LeaveStatsWidget({ employeeId, onViewAll }) {
  const [stats, setStats] = useState({ totalApproved: 0, totalPending: 0, totalRejected: 0, totalDaysUsed: 0 });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (employeeId) {
      fetchLeaveData();
    }
  }, [employeeId]);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const [statsRes, recentRes] = await Promise.allSettled([
        API.get("/leaves/stats", { params: { employeeId } }),
        API.get("/leaves/recent", { params: { employeeId } }),
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value?.data?.data) {
        setStats(statsRes.value.data.data);
      }

      if (recentRes.status === "fulfilled" && Array.isArray(recentRes.value?.data?.data)) {
        setRecentLeaves(recentRes.value.data.data.slice(0, 2));
      }
    } catch (error) {
      console.warn("Leave stats fetch failed:", error?.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-3 bg-slate-800/60 rounded-xl border border-slate-700/70 overflow-hidden animate-pulse">
        <div className="px-3 py-3 border-b border-slate-700/70">
          <div className="h-4 bg-slate-600 rounded w-2/3 mb-2" />
          <div className="h-3 bg-slate-700 rounded w-1/2" />
        </div>
        <div className="p-3 space-y-2">
          <div className="h-10 bg-slate-700 rounded-lg" />
          <div className="h-10 bg-slate-700 rounded-lg" />
        </div>
      </div>
    );
  }

  const totalRequests = stats.totalApproved + stats.totalPending + (stats.totalRejected || 0);
  const approvalRate = totalRequests > 0 ? Math.round((stats.totalApproved / totalRequests) * 100) : 0;

  const STATUS_STYLES = {
    Approved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    Pending: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    Rejected: "bg-red-500/15 text-red-300 border-red-500/20",
    Cancelled: "bg-slate-500/15 text-slate-300 border-slate-500/20",
  };

  return (
    <div className="mt-2.5 bg-slate-800/60 rounded-xl border border-slate-700/70 overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-700/70">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-slate-200 text-[11px] font-extrabold">Recent Leaves</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Latest leave requests</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-[10px] px-2 py-0.5 bg-violet-600 hover:bg-violet-500 text-white rounded-md font-extrabold transition-colors"
          >
            Apply
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 mt-1.5">
          {[
            { label: "Approved", val: stats.totalApproved, color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" },
            { label: "Pending", val: stats.totalPending, color: "bg-amber-500/10 text-amber-300 border-amber-500/20" },
            { label: "Used", val: stats.totalDaysUsed, color: "bg-violet-500/10 text-violet-300 border-violet-500/20" },
          ].map((summary) => (
            <div key={summary.label} className={`rounded-lg border px-1 py-1 text-center ${summary.color}`}>
              <p className="text-xs font-extrabold leading-none">{summary.val}</p>
              <p className="text-[9px] font-bold mt-0.5 opacity-90">{summary.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="divide-y divide-slate-700/60">
        {recentLeaves.length === 0 ? (
          <div className="px-3 py-4 text-center">
            <p className="text-slate-400 text-xs font-medium">No leave requests yet</p>
          </div>
        ) : (
          recentLeaves.map((leave) => {
            const statusStyle = STATUS_STYLES[leave.status] || "bg-slate-500/10 text-slate-300 border-slate-500/20";
            const startDate = new Date(leave.startDate);
            const endDate = new Date(leave.endDate);
            return (
              <div key={leave._id} className="px-3 py-1.5 hover:bg-slate-700/20 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex items-start gap-2">
                    <div className="w-5.5 h-5.5 rounded-lg bg-violet-500/15 text-violet-300 flex items-center justify-center shrink-0 border border-violet-500/20">
                      <span className="text-[10px] font-extrabold">{startDate.getDate()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-200 truncate">{leave.leaveType}</p>
                      <p className="text-[9px] text-slate-400 truncate">
                        {startDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        {` - `}
                        {endDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        {` · ${leave.numberOfDays} day${leave.numberOfDays > 1 ? "s" : ""}`}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusStyle}`}>
                    {leave.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {typeof onViewAll === "function" && (
        <div className="px-3 py-2 border-t border-slate-700/70">
          <button
            onClick={onViewAll}
            className="w-full text-left text-[10px] font-bold text-violet-300 hover:text-violet-200 transition-colors"
          >
            View all leaves →
          </button>
        </div>
      )}

      {/* Apply Leave Modal */}
      {showModal && (
        <ApplyLeaveModal
          employeeId={employeeId}
          onClose={() => {
            setShowModal(false);
            fetchLeaveData();
          }}
        />
      )}
    </div>
  );
}

