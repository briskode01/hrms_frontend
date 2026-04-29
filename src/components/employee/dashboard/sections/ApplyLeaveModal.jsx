// @ts-nocheck
import { useState } from "react";
import API from "../../../../api/axios";

export default function ApplyLeaveModal({ employeeId, onClose }) {
  const [formData, setFormData] = useState({
    leaveType: "Casual Leave",
    startDate: "",
    endDate: "",
    numberOfDays: 1,
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    
    // Auto-calculate days
    if ((name === "startDate" || name === "endDate") && updated.startDate && updated.endDate) {
      const start = new Date(updated.startDate);
      const end = new Date(updated.endDate);
      if (start <= end) {
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        updated.numberOfDays = Math.max(days, 0.5);
      }
    }
    
    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.startDate || !formData.endDate) {
      setError("Please select start and end dates");
      return;
    }

    if (!formData.reason.trim()) {
      setError("Please provide a reason for the leave");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/leaves", {
        employee: employeeId,
        ...formData,
      });

      if (response.data.success || response.data.message) {
        alert("✅ Leave request submitted successfully!");
        onClose();
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to apply leave";
      setError(message);
      console.error("Leave submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Apply for Leave</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Leave Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Leave Type</label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option>Casual Leave</option>
              <option>Sick Leave</option>
              <option>Earned Leave</option>
              <option>Maternity Leave</option>
              <option>Special Leave</option>
              <option>Unpaid Leave</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate || new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          {/* Days */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Number of Days: <span className="font-bold text-violet-600">{formData.numberOfDays}</span>
            </label>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              placeholder="Please provide reason for leave..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          {/* Error */}
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
