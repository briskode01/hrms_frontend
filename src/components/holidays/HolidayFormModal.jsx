import React from "react";
import { Calendar, X } from "lucide-react";

const HolidayFormModal = ({
  showForm,
  editingHoliday,
  formData,
  handleInputChange,
  handleColorChange,
  handleSubmit,
  handleCloseForm,
}) => {
  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <Calendar size={28} className="text-indigo-600" />
              {editingHoliday ? "Edit Holiday" : "New Holiday"}
            </h2>
            <button
              onClick={handleCloseForm}
              className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
            >
              <X size={24} className="stroke-[3]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Holiday Name (e.g. New Year)"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-800 placeholder-slate-400 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-800 outline-none transition-all"
                >
                  <option value="National">National</option>
                  <option value="Regional">Regional</option>
                  <option value="Religious">Religious</option>
                  <option value="Company">Company</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-700 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-700 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add a description or note about this event..."
                rows="3"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-700 placeholder-slate-400 outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                Label Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleColorChange}
                  className="w-12 h-12 cursor-pointer rounded-xl border border-slate-200 p-1 bg-white"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={handleColorChange}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono font-bold text-slate-700 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-100 mt-6">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5"
              >
                {editingHoliday ? "Save Changes" : "Create Holiday"}
              </button>
              <button
                type="button"
                onClick={handleCloseForm}
                className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HolidayFormModal;
