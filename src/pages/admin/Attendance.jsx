// @ts-nocheck
// client/src/pages/Attendance.jsx
// Slim orchestrator — all UI is delegated to sub-components

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "@/api/axios";

import AttendanceTable from "@/components/attendance/AttendanceTable";
import { formatDate, toDateInput } from "@/components/attendance/constants";
import EditAttendanceModal from "@/components/attendance/EditAttendanceModal";
import MarkAttendanceModal from "@/components/attendance/MarkAttendanceModal";
import SummaryCards from "@/components/attendance/SummaryCards";
import TimingsCard from "@/components/attendance/TimingsCard";

export default function Attendance() {
    const today = toDateInput(new Date());

    const [selectedDate, setSelectedDate] = useState(today);
    const [records, setRecords] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [markingAll, setMarkingAll] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const [showMarkModal, setShowMarkModal] = useState(false);
    const [markForm, setMarkForm] = useState({
        employee: "", status: "Present", checkIn: "", checkOut: "", leaveType: "", remarks: "",
    });

    // ─── Data Fetching ───────────────────────────────────────────
    const fetchSummary = async () => {
        try {
            const { data } = await API.get("/attendance/today/summary");
            setSummary(data.data);
        } catch { /* silent */ }
    };

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/attendance", { params: { date: selectedDate } });
            setRecords(data.data);
        } catch {
            toast.error("Failed to fetch attendance");
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const { data } = await API.get("/employees", { params: { status: "All" } });
            setEmployees((data.data || []).filter((emp) => emp.status !== "Inactive"));
        } catch {
            toast.error("Failed to fetch employees");
        }
    };

    useEffect(() => { fetchSummary(); fetchEmployees(); }, []);
    useEffect(() => { fetchAttendance(); }, [selectedDate]);

    // ─── Actions ─────────────────────────────────────────────────
    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        try {
            await API.post("/attendance", { ...markForm, date: selectedDate });
            toast.success("Attendance marked! ✅");
            setShowMarkModal(false);
            setMarkForm({ employee: "", status: "Present", checkIn: "", checkOut: "", leaveType: "", remarks: "" });
            fetchAttendance();
            fetchSummary();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to mark attendance");
        }
    };

    const handleMarkAllPresent = async () => {
        if (!window.confirm(`Mark attendance for all employees for ${formatDate(selectedDate)}?`)) return;
        try {
            setMarkingAll(true);
            const { data: leavesRes } = await API.get("/leaves", { params: { status: "Approved" } });

            const selectedDayStart = new Date(`${selectedDate}T00:00:00`);
            const selectedDayEnd = new Date(`${selectedDate}T23:59:59`);

            const approvedLeaves = (leavesRes?.data || []).filter((leave) => {
                const startDate = new Date(leave.startDate);
                const endDate = new Date(leave.endDate);
                return startDate <= selectedDayEnd && endDate >= selectedDayStart;
            });

            const leaveByEmployeeId = new Map(
                approvedLeaves.map((leave) => [
                    String(leave.employee?._id || leave.employee),
                    leave.leaveType || "Other",
                ])
            );

            const bulkRecords = employees.map((emp) => ({
                employee: emp._id,
                status: leaveByEmployeeId.has(String(emp._id)) ? "On Leave" : "Present",
                checkIn: leaveByEmployeeId.has(String(emp._id)) ? "" : "09:00 AM",
                checkOut: "",
                leaveType: leaveByEmployeeId.get(String(emp._id)) || "",
            }));
            const { data } = await API.post("/attendance/bulk", { date: selectedDate, records: bulkRecords });
            toast.success(data.message);
            fetchAttendance();
            fetchSummary();
        } catch (err) {
            toast.error(err.response?.data?.message || "Bulk mark failed");
        } finally {
            setMarkingAll(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/attendance/${editRecord._id}`, editRecord);
            toast.success("Attendance updated! ✅");
            setEditRecord(null);
            fetchAttendance();
            fetchSummary();
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this attendance record?")) return;
        try {
            await API.delete(`/attendance/${id}`);
            toast.success("Record deleted");
            fetchAttendance();
            fetchSummary();
        } catch {
            toast.error("Failed to delete record");
        }
    };

    const handleEdit = (rec) => {
        setEditRecord({ ...rec, employee: rec.employee?._id || rec.employee });
    };

    // ─── UI ──────────────────────────────────────────────────────
    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Attendance</h2>
                    <p className="text-sm text-slate-400 mt-0.5">Track daily attendance for all employees</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    <input type="date" value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none cursor-pointer shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors" />
                    <button onClick={handleMarkAllPresent} disabled={markingAll}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all">
                        {markingAll ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Marking...
                            </span>
                        ) : "✅ Mark All Present"}
                    </button>
                    <button onClick={() => setShowMarkModal(true)}
                        className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all">
                        + Mark Attendance
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <SummaryCards summary={summary} />

            {/* Timings Card */}
            <TimingsCard selectedDate={selectedDate} records={records} />

            {/* Attendance Table */}
            <AttendanceTable
                records={records}
                loading={loading}
                selectedDate={selectedDate}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Mark Attendance Modal */}
            {showMarkModal && (
                <MarkAttendanceModal
                    form={markForm}
                    setForm={setMarkForm}
                    employees={employees}
                    selectedDate={selectedDate}
                    onSubmit={handleMarkAttendance}
                    onClose={() => setShowMarkModal(false)}
                />
            )}

            {/* Edit Attendance Modal */}
            {editRecord && (
                <EditAttendanceModal
                    record={editRecord}
                    setRecord={setEditRecord}
                    onSubmit={handleUpdate}
                    onClose={() => setEditRecord(null)}
                />
            )}
        </div>
    );
}