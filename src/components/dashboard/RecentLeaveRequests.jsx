// @ts-nocheck
import { useState } from "react";

const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
  Cancelled: "bg-slate-100 text-slate-700",
};

export default function RecentLeaveRequests({ requests, onUpdateStatus }) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusUpdate = async (leaveId, status) => {
    if (typeof onUpdateStatus !== "function") return;
    try {
      setUpdatingId(leaveId);
      await onUpdateStatus(leaveId, status);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Recent Leave Requests</h3>
          <p className="text-xs text-slate-400 mt-0.5">Latest leave applications by employees</p>
        </div>
      </div>

      {requests && requests.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-215">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Employee", "Leave Type", "Duration", "Status", "Applied", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.map((request) => {
                const employeeName = request.employee
                  ? `${request.employee.firstName || ""} ${request.employee.lastName || ""}`.trim()
                  : "Unknown Employee";

                const startDate = new Date(request.startDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                });
                const endDate = new Date(request.endDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                });

                return (
                  <tr key={request._id} className="hover:bg-violet-50/40 transition-colors duration-150">
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-900">{employeeName}</p>
                      <p className="text-xs text-slate-400">{request.employee?.email || "No email"}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{request.leaveType}</td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                      {startDate} → {endDate}
                      <div className="text-[11px] text-slate-400 mt-0.5">{request.numberOfDays} day{request.numberOfDays > 1 ? "s" : ""}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[request.status] || "bg-slate-100 text-slate-700"}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                      {new Date(request.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      {request.status === "Pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStatusUpdate(request._id, "Approved")}
                            disabled={updatingId === request._id}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors disabled:opacity-60"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(request._id, "Rejected")}
                            disabled={updatingId === request._id}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <div className="text-4xl mb-3 opacity-60">📝</div>
          <p className="text-sm font-medium">No leave requests yet</p>
        </div>
      )}
    </div>
  );
}
