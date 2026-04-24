// @ts-nocheck
import API from "@/api/axios";
import BirthdayTodayCard from "@/components/dashboard/BirthdayTodayCard";
import AttendancePanel from "@/components/employee/dashboard/sections/AttendancePanel";
import PerformancePanel from "@/components/employee/dashboard/sections/PerformancePanel";
import QuickLinksSection from "@/components/employee/dashboard/sections/QuickLinksSection";
import StatsCardsSection from "@/components/employee/dashboard/sections/StatsCardsSection";
import TurtleAnimation from "@/components/employee/dashboard/sections/TurtleAnimation";
import WelcomeBannerSection from "@/components/employee/dashboard/sections/WelcomeBannerSection";
import { GRADE_CONFIG, STATUS_STYLES } from "@/components/employee/dashboard/shared/constants";
import NewsFeedPanel from "@/components/dashboard/NewsFeedPanel";
import RecentLeaveRequests from "@/components/dashboard/RecentLeaveRequests";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EmployeeDashboard({ setActiveTab }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const employeeId = user?.employee?._id || user?.employee || null;

  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [attendStats, setAttendStats] = useState({ present: 0, late: 0, halfDay: 0, onLeave: 0, absent: 0, total: 0 });
  const [todayStatus, setTodayStatus] = useState("Not Marked");
  const [todayRecord, setTodayRecord] = useState(null);
  const [payroll, setPayroll] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [birthdayEmployees, setBirthdayEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [recentLeaveRequests, setRecentLeaveRequests] = useState([]);

  const handleUpdateLeaveStatus = async (leaveId, status) => {
    try {
      await API.put(`/leaves/${leaveId}`, { status });
      toast.success(`Leave ${status.toLowerCase()} successfully`);
      if (employeeId) fetchAll(employeeId);
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to update leave status";
      toast.error(message);
      console.error(error);
    }
  };

  const fetchLatestPayroll = async (empId, month, year) => {
    try {
      const { data } = await API.get("/payroll", { params: { employeeId: empId, month, year } });
      const records = Array.isArray(data?.data) ? data.data : [];
      setPayroll(records[0] || null);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchAll(employeeId);
      return;
    }
    setLoading(false);
  }, [employeeId]);

  const fetchAll = async (empId) => {
    try {
      setLoading(true);
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const todayStr = now.toISOString().split("T")[0];

      const [empRes, attendRes, payrollRes, perfRes, statsRes, tasksRes] = await Promise.allSettled([
        API.get(`/employees/${empId}`),
        API.get(`/attendance/report/${empId}`, { params: { month, year } }),
        API.get("/payroll", { params: { employeeId: empId, month, year } }),
        API.get("/performance", { params: { employeeId: empId } }),
        API.get("/dashboard/stats"),
        API.get("/tasks", { params: { date: todayStr } }),
      ]);

      if (empRes.status === "fulfilled") {
        setEmployee(empRes.value.data.data);
      }

      if (attendRes.status === "fulfilled") {
        const attendanceData = attendRes.value.data?.data;
        const records = Array.isArray(attendanceData)
          ? attendanceData
          : Array.isArray(attendanceData?.records)
            ? attendanceData.records
            : [];

        setAttendance(records.slice(0, 5));

        const stats = { present: 0, late: 0, halfDay: 0, onLeave: 0, absent: 0, total: 0 };
        records.forEach((record) => {
          if (record.status === "Present") stats.present += 1;
          if (record.status === "Late") stats.late += 1;
          if (record.status === "Half Day") stats.halfDay += 1;
          if (record.status === "On Leave") stats.onLeave += 1;
          if (record.status === "Absent") stats.absent += 1;
        });
        stats.total = records.length;
        setAttendStats(stats);

        const todayText = now.toDateString();
        const todayRec = records.find((record) => new Date(record.date).toDateString() === todayText);
        if (todayRec) {
          setTodayStatus(todayRec.status);
          setTodayRecord(todayRec);
        }
      }

      if (payrollRes.status === "fulfilled") {
        const records = payrollRes.value.data.data || [];
        setPayroll(records[0] || null);
      }

      if (perfRes.status === "fulfilled") {
        const records = perfRes.value.data.data || [];
        if (records.length > 0) setPerformance(records[0]);
      }

      if (statsRes.status === "fulfilled") {
        const stats = statsRes.value.data?.data || {};
        setBirthdayEmployees(Array.isArray(stats.birthdayEmployees) ? stats.birthdayEmployees : []);
        setRecentLeaveRequests(Array.isArray(stats.recentLeaveRequests) ? stats.recentLeaveRequests : []);
      }

      if (tasksRes.status === "fulfilled") {
        const list = tasksRes.value.data?.data;
        setTasks(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!employeeId) return;

    const refreshPayroll = () => {
      const now = new Date();
      fetchLatestPayroll(employeeId, now.getMonth() + 1, now.getFullYear());
    };

    refreshPayroll();

    const intervalId = window.setInterval(refreshPayroll, 10000);
    const handleFocus = () => refreshPayroll();

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [employeeId]);

  const attendanceRate = attendStats.total > 0
    ? Math.round(((attendStats.present + attendStats.late) / attendStats.total) * 100)
    : 0;

  const todayStyle = STATUS_STYLES[todayStatus] || STATUS_STYLES["Not Marked"];
  const gradeConfig = performance?.grade ? (GRADE_CONFIG[performance.grade] || GRADE_CONFIG.Average) : null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="relative">
        <TurtleAnimation />
        <WelcomeBannerSection employee={employee} userName={user?.name} />
      </div>

      <StatsCardsSection
        attendanceRate={attendanceRate}
        attendStats={attendStats}
        todayStyle={todayStyle}
        todayStatus={todayStatus}
        todayRecord={todayRecord}
        payroll={payroll}
        performance={performance}
        gradeConfig={gradeConfig}
      />
      <BirthdayTodayCard employees={birthdayEmployees} />
      <NewsFeedPanel setActiveTab={setActiveTab} />

      <QuickLinksSection navigate={navigate} setActiveTab={setActiveTab} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <AttendancePanel
          attendance={attendance}
          attendStats={attendStats}
          attendanceRate={attendanceRate}
          setActiveTab={setActiveTab}
        />

        <div className="lg:col-span-2 flex flex-col gap-5">
          {employee?.department === "HR" && recentLeaveRequests.length > 0 && (
            <RecentLeaveRequests requests={recentLeaveRequests} onUpdateStatus={handleUpdateLeaveStatus} />
          )}
          <PerformancePanel performance={performance} gradeConfig={gradeConfig} navigate={navigate} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}
