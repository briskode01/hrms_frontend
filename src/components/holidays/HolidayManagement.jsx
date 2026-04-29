import React, { useState, useEffect } from "react";
import {
  Plus,
  AlertCircle,
  Settings,
} from "lucide-react";
import {
  getAllHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  toggleHolidayApproval,
} from "../../api/holidayAPI";
import toast from "react-hot-toast";

import HolidayFormModal from "./HolidayFormModal";

import HolidayDataTable from "./HolidayDataTable";

const HolidayManagement = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterType, setFilterType] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    endDate: "",
    type: "National",
    color: "#FF6B6B",
  });

  // Ensure form is closed on initial mount
  useEffect(() => {
    setShowForm(false);
    setEditingHoliday(null);
  }, []);

  // Fetch holidays on component mount and when filters change
  useEffect(() => {
    fetchHolidays();
  }, [filterYear, filterType]);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const filters = { year: filterYear };
      if (filterType) filters.type = filterType;

      const response = await getAllHolidays(filters);
      setHolidays(response.data || []);
    } catch (error) {
      const errorMsg = error?.errors?.join(", ") || error?.message || "Failed to fetch holidays";
      toast.error(errorMsg);
      console.error("Fetch holidays error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      color: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      date: "",
      endDate: "",
      type: "National",
      color: "#FF6B6B",
    });
    setEditingHoliday(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.date) {
      toast.error("Holiday name and date are required");
      return;
    }

    const toastId = toast.loading(
      editingHoliday ? "Updating holiday..." : "Creating holiday..."
    );

    try {
      // Send dates as YYYY-MM-DD strings to avoid timezone issues
      const submitData = {
        ...formData,
        date: formData.date, // Already in YYYY-MM-DD format from input
        endDate: formData.endDate ? formData.endDate : null,
      };

      if (editingHoliday) {
        await updateHoliday(editingHoliday._id, submitData);
        toast.success("Holiday updated successfully", { id: toastId });
      } else {
        await createHoliday(submitData);
        toast.success("Holiday created successfully", { id: toastId });
      }

      resetForm();
      setShowForm(false);
      fetchHolidays();
    } catch (error) {
      const errorMsg = error?.errors?.join(", ") || error?.message || "Failed to save holiday";
      toast.error(errorMsg, { id: toastId });
      console.error("Holiday save error:", error);
    }
  };

  const handleEdit = (holiday) => {
    setEditingHoliday(holiday);
    setFormData({
      name: holiday.name,
      description: holiday.description || "",
      date: holiday.date.split("T")[0],
      endDate: holiday.endDate ? holiday.endDate.split("T")[0] : "",
      type: holiday.type,
      color: holiday.color,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const toastId = toast.loading("Deleting holiday...");
    try {
      await deleteHoliday(id);
      toast.success("Holiday deleted successfully", { id: toastId });
      setDeleteConfirm(null);
      fetchHolidays();
    } catch (error) {
      const errorMsg = error?.errors?.join(", ") || error?.message || "Failed to delete holiday";
      toast.error(errorMsg, { id: toastId });
      console.error("Holiday delete error:", error);
    }
  };

  const handleToggleApproval = async (holiday) => {
    const toastId = toast.loading("Updating approval status...");
    try {
      await toggleHolidayApproval(holiday._id, !holiday.isApproved);
      toast.success(
        `Holiday ${!holiday.isApproved ? "approved" : "unapproved"}`,
        { id: toastId }
      );
      fetchHolidays();
    } catch (error) {
      const errorMsg = error?.errors?.join(", ") || error?.message || "Failed to update approval";
      toast.error(errorMsg, { id: toastId });
      console.error("Approval toggle error:", error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Settings size={28} className="text-indigo-600" />
            Holiday Settings
          </h2>
          <p className="text-slate-500 font-medium mt-1">Add, edit, and manage company holidays and observances</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-200 hover:-translate-y-0.5"
        >
          <Plus size={18} className="stroke-[3]" />
          Add Holiday
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-50 rounded-2xl p-2 border border-slate-200">
        <div className="flex-1">
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(parseInt(e.target.value))}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-bold text-slate-700 outline-none transition-all"
          >
            {[2023, 2024, 2025, 2026, 2027].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-bold text-slate-700 outline-none transition-all"
          >
            <option value="">All Types</option>
            <option value="National">National</option>
            <option value="Regional">Regional</option>
            <option value="Religious">Religious</option>
            <option value="Company">Company</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Form Modal */}
      <HolidayFormModal
        showForm={showForm}
        editingHoliday={editingHoliday}
        formData={formData}
        handleInputChange={handleInputChange}
        handleColorChange={handleColorChange}
        handleSubmit={handleSubmit}
        handleCloseForm={handleCloseForm}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-8 text-center border border-slate-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <AlertCircle size={32} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Delete Holiday?</h3>
            <p className="text-slate-500 text-sm font-medium mb-8">
              Are you sure? This action cannot be undone and will remove it from the calendar.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-md shadow-red-200 transition-all hover:-translate-y-0.5"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Holidays Table */}
      <HolidayDataTable
        holidays={holidays}
        loading={loading}
        handleToggleApproval={handleToggleApproval}
        handleEdit={handleEdit}
        setDeleteConfirm={setDeleteConfirm}
      />
    </div>
  );
};

export default HolidayManagement;
