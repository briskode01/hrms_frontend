// @ts-nocheck
import API from "@/api/axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const toDateInput = (value) => {
  const date = value ? new Date(value) : new Date();
  return date.toISOString().split("T")[0];
};

const statusBadge = {
  Pending: "bg-amber-100 text-amber-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

export default function Tasks() {
  const [selectedDate, setSelectedDate] = useState(toDateInput());
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ employee: "", title: "", description: "", date: toDateInput() });

  const fetchEmployees = async () => {
    try {
      const { data } = await API.get("/employees", { params: { status: "All" } });
      setEmployees((data.data || []).filter((emp) => emp.status !== "Inactive"));
    } catch {
      toast.error("Failed to load employees");
    }
  };

  const fetchTasks = async (dateValue = selectedDate) => {
    try {
      setLoading(true);
      const { data } = await API.get("/tasks", { params: { date: dateValue } });
      setTasks(Array.isArray(data?.data) ? data.data : []);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchTasks(selectedDate);
  }, [selectedDate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.employee || !form.title || !form.date) {
      toast.error("Employee, date, and title are required");
      return;
    }

    try {
      setSubmitting(true);
      await API.post("/tasks", form);
      toast.success("Task assigned successfully");
      setForm({ employee: "", title: "", description: "", date: form.date });
      fetchTasks(form.date);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign task");
    } finally {
      setSubmitting(false);
    }
  };

  const grouped = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const key = task.employee?._id || "unknown";
      if (!acc[key]) acc[key] = { employee: task.employee, items: [] };
      acc[key].items.push(task);
      return acc;
    }, {});
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Daily Tasks</h2>
          <p className="text-sm text-slate-400 mt-1">Assign tasks to employees and track updates.</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none cursor-pointer shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Employee</label>
            <select
              value={form.employee}
              onChange={(event) => setForm((prev) => ({ ...prev, employee: event.target.value }))}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName} ({emp.employeeId})
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
              placeholder="e.g., Prepare daily report"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Optional details"
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

        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center text-slate-400">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center text-slate-400">
              No tasks assigned for this day.
            </div>
          ) : (
            Object.values(grouped).map((group) => (
              <div key={group.employee?._id || group.employee?.employeeId} className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900">
                    {group.employee?.firstName} {group.employee?.lastName}
                  </p>
                  <p className="text-xs text-slate-400">{group.employee?.department || ""}</p>
                </div>
                <div className="divide-y divide-slate-50">
                  {group.items.map((task) => {
                    const lastUpdate = task.updates?.[0];
                    return (
                      <div key={task._id} className="px-6 py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-slate-800">{task.title}</p>
                            {task.description && (
                              <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                            )}
                            {lastUpdate && (
                              <p className="text-xs text-slate-400 mt-2">
                                Latest update: {lastUpdate.message}
                              </p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge[task.status] || "bg-slate-100 text-slate-600"}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
