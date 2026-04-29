import React from "react";
import { Calendar, Check, AlertCircle, Edit2, Trash2 } from "lucide-react";

const HolidayDataTable = ({
  holidays,
  loading,
  handleToggleApproval,
  handleEdit,
  setDeleteConfirm,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (holidays.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex flex-col items-center justify-center h-64">
          <Calendar size={48} className="text-slate-200 mb-4 stroke-1" />
          <p className="text-slate-400 font-bold">No holidays found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest pl-8">
                Holiday Name
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Type
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right pr-8">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {holidays.map((holiday) => (
              <tr
                key={holiday._id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="px-6 py-4 pl-8">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: holiday.color || "#6366f1",
                        boxShadow: `0 0 0 4px ${holiday.color || "#6366f1"}20`,
                      }}
                    ></div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-slate-800 truncate">
                        {holiday.name}
                      </p>
                      {holiday.description && (
                        <p className="text-xs font-medium text-slate-400 truncate max-w-[200px]">
                          {holiday.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">
                      {new Date(holiday.date).toLocaleDateString("default", {
                        month: "short",
                        day: "numeric",
                      })}
                      {holiday.endDate &&
                        ` - ${new Date(holiday.endDate).toLocaleDateString(
                          "default",
                          { month: "short", day: "numeric" }
                        )}`}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                      {new Date(holiday.date).getFullYear()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border"
                    style={{
                      color: holiday.color || "#6366f1",
                      backgroundColor: `${holiday.color || "#6366f1"}10`,
                      borderColor: `${holiday.color || "#6366f1"}30`,
                    }}
                  >
                    {holiday.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleApproval(holiday)}
                    title={
                      holiday.isApproved
                        ? "Click to unapprove"
                        : "Click to approve"
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      holiday.isApproved
                        ? "bg-teal-50 text-teal-600 border border-teal-100 hover:bg-teal-100"
                        : "bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100"
                    }`}
                  >
                    {holiday.isApproved ? (
                      <>
                        <Check size={14} className="stroke-[3]" /> Approved
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} className="stroke-[3]" /> Pending
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 text-right pr-8">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(holiday)}
                      className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(holiday._id)}
                      className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HolidayDataTable;
