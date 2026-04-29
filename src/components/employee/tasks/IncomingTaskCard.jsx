// @ts-nocheck
import React from "react";

const statusBadge = {
  Pending: "bg-amber-100 text-amber-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

/**
 * IncomingTaskCard - Displays a task assigned to the user.
 */
const IncomingTaskCard = ({ task, updateForm, onUpdateChange, onSubmitUpdate, updatingId }) => {
  return (
    <div key={task._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-800">{task.title}</p>
          {task.description && <p className="text-xs text-slate-500 mt-1">{task.description}</p>}
          <p className="text-[10px] text-slate-400 mt-2 italic">Assigned by: {task.assignedBy?.name || "Admin"}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge[task.status] || "bg-slate-100 text-slate-600"}`}>
          {task.status}
        </span>
      </div>

      <div className="space-y-2">
        {(task.updates || []).slice(0, 2).map((note) => (
          <div key={note._id || note.createdAt} className="text-xs text-slate-500">
            {note.message}
          </div>
        ))}
      </div>

      <div className="grid gap-3">
        <textarea
          rows="3"
          value={updateForm?.message || ""}
          onChange={(event) => onUpdateChange(task._id, "message", event.target.value)}
          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Share your update..."
        />
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={updateForm?.status || "In Progress"}
            onChange={(event) => onUpdateChange(task._id, "status", event.target.value)}
            className="px-3 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <button
            onClick={() => onSubmitUpdate(task._id)}
            disabled={updatingId === task._id}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            {updatingId === task._id ? "Sending..." : "Send Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingTaskCard;
