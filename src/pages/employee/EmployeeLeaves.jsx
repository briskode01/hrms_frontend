// @ts-nocheck
import { useEffect, useState } from "react";
import API from "../../api/axios";
import ApplyLeaveModal from "../../components/employee/dashboard/sections/ApplyLeaveModal";
import { useAuth } from "../../context/AuthContext";

const STATUS_STYLES = {
  Approved: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-700",
  Cancelled: "bg-slate-100 text-slate-700",
};

export default function EmployeeLeaves() {
  const { user } = useAuth();
  const employeeId = user?.employee?._id || user?.employee || null;

  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({ totalApproved: 0, totalPending: 0, totalRejected: 0, totalDaysUsed: 0 });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!employeeId) {
      setLoading(false);
      return;
    }
    fetchLeaveData();
  }, [employeeId]);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const [statsRes, leavesRes] = await Promise.allSettled([
        API.get("/leaves/stats", { params: { employeeId } }),
        API.get("/leaves", { params: { employeeId } }),
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value?.data?.data) {
        setStats(statsRes.value.data.data);
      }

      if (leavesRes.status === "fulfilled" && Array.isArray(leavesRes.value?.data?.data)) {
        setLeaves(leavesRes.value.data.data);
      }
    } catch (error) {
      console.error("Leaves fetch error:", error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        <p className="text-sm font-medium">Loading your leaves...</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl pb-8">
      <div className="absolute inset-0 bg-[url('/Leave.png')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-white/10" />

      <div className="relative z-10 space-y-6">
      <div className="bg-white/74 rounded-2xl border border-slate-100 shadow-sm p-6 backdrop-blur-[1px]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">My Leaves</h2>
            <p className="text-sm text-slate-500 mt-1">View all leave requests and apply for new leave</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-colors"
          >
            + Apply Leave
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          {[
            { label: "Approved", val: stats.totalApproved, style: "bg-emerald-50 text-emerald-700 border-emerald-100" },
            { label: "Pending", val: stats.totalPending, style: "bg-amber-50 text-amber-700 border-amber-100" },
            { label: "Rejected", val: stats.totalRejected || 0, style: "bg-red-50 text-red-700 border-red-100" },
            { label: "Days Used", val: stats.totalDaysUsed, style: "bg-violet-50 text-violet-700 border-violet-100" },
          ].map((card) => (
            <div key={card.label} className={`border rounded-xl px-4 py-3 ${card.style}`}>
              <p className="text-xl font-extrabold">{card.val}</p>
              <p className="text-xs font-bold opacity-80 mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/74 rounded-2xl border border-slate-100 shadow-sm overflow-hidden backdrop-blur-[1px]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900">Leave History</h3>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">{leaves.length} requests</span>
        </div>

        <div className="divide-y divide-slate-50">
          {leaves.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <div className="text-3xl mb-2">📭</div>
              <p className="text-sm font-medium">No leave requests yet</p>
            </div>
          ) : (
            leaves.map((leave) => {
              const statusClass = STATUS_STYLES[leave.status] || "bg-slate-100 text-slate-700";
              const startDate = new Date(leave.startDate);
              const endDate = new Date(leave.endDate);
              return (
                <div key={leave._id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800">{leave.leaveType}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {startDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                        {` → `}
                        {endDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{leave.numberOfDays} day{leave.numberOfDays > 1 ? "s" : ""}</p>
                      {leave.reason && <p className="text-xs text-slate-600 mt-2 leading-5">{leave.reason}</p>}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass}`}>{leave.status}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

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
    </div>
  );
}
