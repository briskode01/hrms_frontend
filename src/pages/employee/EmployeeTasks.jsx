import API from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

// Sub-components
import TaskAssignmentForm from "@/components/employee/tasks/TaskAssignmentForm";
import IncomingTaskCard from "@/components/employee/tasks/IncomingTaskCard";
import OutgoingTaskCard from "@/components/employee/tasks/OutgoingTaskCard";

const toDateInput = (value) => {
  const date = value ? new Date(value) : new Date();
  return date.toISOString().split("T")[0];
};

export default function EmployeeTasks() {
  const { user } = useAuth();
  const myEmployeeId = user?.employee?._id || user?.employee;

  const [selectedDate, setSelectedDate] = useState(toDateInput());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [assignForm, setAssignForm] = useState({ employee: "", title: "", description: "", date: toDateInput() });
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [updateForms, setUpdateForms] = useState({});

  const fetchTasks = async (dateValue = selectedDate) => {
    try {
      setLoading(true);
      const { data } = await API.get("/tasks", { params: { date: dateValue } });
      const list = Array.isArray(data?.data) ? data.data : [];
      setTasks(list);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data } = await API.get("/employees", { params: { status: "All" } });
      setEmployees((data.data || []).filter((emp) => emp.status !== "Inactive"));
    } catch {
      toast.error("Failed to load employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchTasks(selectedDate);
  }, [selectedDate]);

  const handleUpdateChange = (taskId, field, value) => {
    setUpdateForms((prev) => ({
      ...prev,
      [taskId]: {
        message: prev[taskId]?.message || "",
        status: prev[taskId]?.status || "In Progress",
        [field]: value,
      },
    }));
  };

  const handleSubmitUpdate = async (taskId) => {
    const form = updateForms[taskId] || {};
    if (!form.message) {
      toast.error("Please add an update message");
      return;
    }

    try {
      setUpdatingId(taskId);
      await API.patch(`/tasks/${taskId}/update`, form);
      toast.success("Update sent");
      setUpdateForms((prev) => ({ ...prev, [taskId]: { message: "", status: form.status } }));
      fetchTasks(selectedDate);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send update");
    } finally {
      setUpdatingId("");
    }
  };

  const handleAssignTask = async (event) => {
    event.preventDefault();
    if (!assignForm.employee || !assignForm.title || !assignForm.date) {
      toast.error("Employee, date, and title are required");
      return;
    }

    try {
      setSubmitting(true);
      await API.post("/tasks", assignForm);
      toast.success("Task assigned successfully");
      setAssignForm({ employee: "", title: "", description: "", date: assignForm.date });
      fetchTasks(selectedDate);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign task");
    } finally {
      setSubmitting(false);
    }
  };

  const groupedTasks = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        const isAssignedToMe = String(task.employee?._id || task.employee) === String(myEmployeeId);
        if (isAssignedToMe) acc.incoming.push(task);
        else acc.outgoing.push(task);
        return acc;
      },
      { incoming: [], outgoing: [] }
    );
  }, [tasks, myEmployeeId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daily Tasks</h2>
          <p className="text-sm text-slate-400 mt-1">Assign tasks to colleagues and track updates.</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none cursor-pointer shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Col: Assignment Form */}
        <TaskAssignmentForm
          employees={employees}
          form={assignForm}
          setForm={setAssignForm}
          onSubmit={handleAssignTask}
          submitting={submitting}
        />

        {/* Right Col: Task Lists */}
        <div className="lg:col-span-2 space-y-8">
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center text-slate-400">
              <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center text-slate-400 select-none">
              <div className="text-4xl mb-3 opacity-30">📋</div>
              No tasks for this day.
            </div>
          ) : (
            <>
              {/* Incoming Tasks (My Work) */}
              {groupedTasks.incoming.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] ml-1">My Work</h3>
                  {groupedTasks.incoming.map((task) => (
                    <IncomingTaskCard
                      key={task._id}
                      task={task}
                      updateForm={updateForms[task._id]}
                      onUpdateChange={handleUpdateChange}
                      onSubmitUpdate={handleSubmitUpdate}
                      updatingId={updatingId}
                    />
                  ))}
                </div>
              )}

              {/* Outgoing Tasks (Assigned by Me) */}
              {groupedTasks.outgoing.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] ml-1">Tasks I Assigned</h3>
                  {groupedTasks.outgoing.map((task) => (
                    <OutgoingTaskCard key={task._id} task={task} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
