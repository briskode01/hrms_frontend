// @ts-nocheck
import React from "react";

const statusBadge = {
  Pending: "bg-amber-100 text-amber-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

/**
 * OutgoingTaskCard - Displays a task assigned BY the user to someone else.
 */
const OutgoingTaskCard = ({ task }) => {
  return (
    <div key={task._id} className="bg-slate-50/50 rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-800">{task.title}</p>
          {task.description && <p className="text-xs text-slate-500 mt-1">{task.description}</p>}
          <p className="text-[10px] font-bold text-blue-600 mt-2 uppercase tracking-tight">
            Assigned to: {task.employee?.firstName} {task.employee?.lastName}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge[task.status] || "bg-slate-100 text-slate-600"}`}>
          {task.status}
        </span>
      </div>

      {task.updates?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Latest Status Updates</p>
          {task.updates.slice(0, 1).map((note) => (
            <div key={note._id} className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
              {note.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OutgoingTaskCard;
