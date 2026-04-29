// @ts-nocheck
import { useEffect, useState } from "react";
import API from "../../../../api/axios";
import ApplyLeaveModal from "./ApplyLeaveModal";

export default function LeavePanel({ employeeId, navigate }) {
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({ totalApproved: 0, totalPending: 0, totalDaysUsed: 0 });
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employeeId) {
      fetchLeaveData(employeeId);
    }
  }, [employeeId]);

  const fetchLeaveData = async (empId) => {
    try {
      setLoading(true);
      const [statsRes, leavesRes] = await Promise.allSettled([
        API.get("/leaves/stats", { params: { employeeId: empId } }),
        API.get("/leaves/recent", { params: { employeeId: empId } }),
      ]);

      if (statsRes.status === "fulfilled") {
        const data = statsRes.value?.data?.data;
        if (data) setStats(data);
      } else if (statsRes.status === "rejected") {
        console.warn("Leave stats fetch failed:", statsRes.reason?.message);
      }

      if (leavesRes.status === "fulfilled") {
        const data = leavesRes.value?.data?.data;
        if (Array.isArray(data)) setLeaves(data);
      } else if (leavesRes.status === "rejected") {
        console.warn("Leave list fetch failed:", leavesRes.reason?.message);
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
    } finally {
      setLoading(false);
    }
  };

  const LEAVE_BG = {
    Approved: "bg-emerald-50",
    Pending: "bg-amber-50",
    Rejected: "bg-red-50",
  };

  const LEAVE_COLOR = {
    Approved: "text-emerald-700",
    Pending: "text-amber-700",
    Rejected: "text-red-700",
  };

  const LEAVE_BADGE = {
    Approved: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Rejected: "bg-red-100 text-red-700",
  };

  if (loading) {
    return (
      <div className="bg-slate-50 rounded-lg border border-slate-200 p-5 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/2 mb-4" />
        <div className="space-y-2">
          <div className="h-10 bg-slate-200 rounded" />
          <div className="h-10 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-violet-50 to-purple-50 border-b border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <span className="text-2xl">📋</span> My Leaves
          </h3>
          <button
            onClick={() => setShowApplyModal(true)}
            className="px-3 py-1 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
          >
            + Apply Leave
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">{stats.totalApproved}</p>
            <p className="text-xs text-slate-600">Approved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">{stats.totalPending}</p>
            <p className="text-xs text-slate-600">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-violet-600">{stats.totalDaysUsed}</p>
            <p className="text-xs text-slate-600">Days Used</p>
          </div>
        </div>
      </div>

      {/* Leave List */}
      <div className="divide-y divide-slate-200">
        {leaves.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500 text-sm mb-2">No leave requests yet</p>
            <button
              onClick={() => setShowApplyModal(true)}
              className="text-violet-600 hover:text-violet-700 font-medium text-sm"
            >
              Apply for leave
            </button>
          </div>
        ) : (
          leaves.map((leave) => {
            const startDate = new Date(leave.startDate).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            });
            const endDate = new Date(leave.endDate).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={leave._id}
                className={`p-4 hover:bg-slate-50 transition-colors ${LEAVE_BG[leave.status] || "bg-slate-50"}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{leave.leaveType}</p>
                    <p className="text-xs text-slate-600">{`${startDate} - ${endDate}`}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${LEAVE_BADGE[leave.status] || "bg-slate-100 text-slate-700"}`}>
                    {leave.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{leave.reason}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-slate-50 border-t border-slate-200 p-4">
        <button
          onClick={() => navigate("/leaves")}
          className="w-full py-2 text-center text-slate-700 hover:text-violet-600 font-medium text-sm transition-colors"
        >
          View all leaves →
        </button>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <ApplyLeaveModal
          employeeId={employeeId}
          onClose={() => {
            setShowApplyModal(false);
            fetchLeaveData(employeeId);
          }}
        />
      )}
    </div>
  );
}

