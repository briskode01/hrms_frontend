// @ts-nocheck
import React from "react";

/**
 * TaskAssignmentForm - Component for employees to assign tasks to colleagues.
 */
const TaskAssignmentForm = ({ employees, form, setForm, onSubmit, submitting }) => {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 h-fit sticky top-6">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assign To</label>
        <select
          value={form.employee}
          onChange={(event) => setForm((prev) => ({ ...prev, employee: event.target.value }))}
          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
        >
          <option value="">Select employee</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.firstName} {emp.lastName} ({emp.department})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Task Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="e.g., Prepare report"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
        <textarea
          rows="2"
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Optional details..."
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Task Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
      >
        {submitting ? "Assigning..." : "Assign Task"}
      </button>
    </form>
  );
};

export default TaskAssignmentForm;
