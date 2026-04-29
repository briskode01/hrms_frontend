// @ts-nocheck
import { getAvatarColor } from "./constants";

export default function ManageAgentsTab({ fieldAgents, nonFieldAgents, onToggleFieldAgent }) {
    return (
        <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-extrabold text-slate-900">✅ Current Field Agents</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{fieldAgents.length} employees marked as field agents</p>
                    </div>
                </div>

                {fieldAgents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                        <div className="text-4xl mb-3">👤</div>
                        <p className="text-sm font-semibold text-slate-600">No field agents yet</p>
                        <p className="text-xs mt-1">Mark employees below to add them</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                {["Employee", "Department", "Designation", "Action"].map((header) => (
                                    <th key={header} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {fieldAgents.map((employee) => (
                                <tr key={employee._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full ${getAvatarColor(employee.firstName)} text-white text-xs font-bold flex items-center justify-center`}>
                                                {employee.firstName[0]}{employee.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{employee.firstName} {employee.lastName}</p>
                                                <p className="text-xs text-slate-400">{employee.employeeId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-600">{employee.department}</td>
                                    <td className="px-5 py-4 text-sm text-slate-600">{employee.designation}</td>
                                    <td className="px-5 py-4">
                                        <button
                                            onClick={() => onToggleFieldAgent(employee._id, `${employee.firstName} ${employee.lastName}`)}
                                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold rounded-lg transition-colors"
                                        >
                                            ❌ Remove Agent
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-extrabold text-slate-900">➕ Add Field Agents</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Click "Mark as Agent" to add an employee to tracking</p>
                </div>

                {nonFieldAgents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                        <p className="text-sm">All employees are already field agents!</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                {["Employee", "Department", "Designation", "Action"].map((header) => (
                                    <th key={header} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {nonFieldAgents.map((employee) => (
                                <tr key={employee._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full ${getAvatarColor(employee.firstName)} text-white text-xs font-bold flex items-center justify-center`}>
                                                {employee.firstName[0]}{employee.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{employee.firstName} {employee.lastName}</p>
                                                <p className="text-xs text-slate-400">{employee.employeeId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-600">{employee.department}</td>
                                    <td className="px-5 py-4 text-sm text-slate-600">{employee.designation}</td>
                                    <td className="px-5 py-4">
                                        <button
                                            onClick={() => onToggleFieldAgent(employee._id, `${employee.firstName} ${employee.lastName}`)}
                                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold rounded-lg transition-colors"
                                        >
                                            ✅ Mark as Agent
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
