// @ts-nocheck
// client/src/routes/AppRoutes.jsx
// ─────────────────────────────────────────────────────────────
// Renders the correct page component based on the active tab.
// Also handles modals (Add/Edit/View Employee).
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// Pages
import Attendance from "../pages/admin/Attendance";
import Dashboard from "../pages/admin/Dashboard";
import Employees from "../pages/admin/Employees";
import Payroll from "../pages/admin/Payroll";
import Performance from "../pages/admin/Performance";
import Recruitment from "../pages/admin/Recruitment";
import Settings from "../pages/admin/Settings";
import Tasks from "../pages/admin/Tasks";
import Tracking from "../pages/admin/Tracking";
import Announcements from "../pages/admin/Announcements";
import WagesCreation from "../pages/admin/WagesCreation";
import EmployeeAttendance from "../pages/employee/EmployeeAttendance";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import EmployeeLeaves from "../pages/employee/EmployeeLeaves";
import EmployeePayroll from "../pages/employee/EmployeePayroll";
import EmployeePerformance from "../pages/employee/EmployeePerformance";
import EmployeeProfile from "../pages/employee/EmployeeProfile";
import EmployeeTasks from "../pages/employee/EmployeeTasks";
import HolidayPage from "../pages/HolidayPage";
import EmployeeAnnouncements from "../pages/employee/Announcements";
import Expenditure from "../pages/admin/expenditure/Expenditure";

// Modals
import EmployeeDetail from "../components/employee/EmployeeDetail";
import EmployeeForm from "../components/employee/EmployeeForm";

export default function AppRoutes({ activeTab, setActiveTab }) {
    const { user, isAdmin } = useAuth();

    const [showAddForm, setShowAddForm] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);
    const [viewEmployee, setViewEmployee] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const triggerRefresh = () => setRefreshTrigger((n) => n + 1);

    // Build visible nav IDs for the current role
    const NAV_ITEMS = [
        { id: "dashboard", roles: ["admin", "employee"] },
        { id: "employees", roles: ["admin"] },
        { id: "attendance", roles: ["admin", "employee"] },
        { id: "tasks", roles: ["admin", "employee"] },
        { id: "announcements", roles: ["admin", "employee"] },
        { id: "leaves", roles: ["employee"] },
        { id: "payroll", roles: ["admin", "employee"] },
        { id: "wages-creation", roles: ["admin"] },
        { id: "expenditure",    roles: ["admin"] },
        { id: "holidays",       roles: ["admin", "employee"] },
        { id: "profile", roles: ["employee"] },
        { id: "performance", roles: ["admin", "employee"] },
        { id: "tracking", roles: ["admin"] },
        { id: "recruitment", roles: ["admin"] },
        { id: "settings", roles: ["admin"] },
    ];
    const visibleNavIds = NAV_ITEMS
        .filter((n) => n.roles.includes(user?.role))
        .map((n) => n.id);

    return (
        <>
            {/* ✅ Dashboard */}
            {activeTab === "dashboard" && (user?.role === "employee" ? <EmployeeDashboard setActiveTab={setActiveTab} /> : <Dashboard setActiveTab={setActiveTab} />)}

            {/* ✅ Employees */}
            {activeTab === "employees" && isAdmin && (
                <Employees
                    key={refreshTrigger}
                    onAddClick={() => setShowAddForm(true)}
                    onViewClick={(emp) => setViewEmployee(emp)}
                    onEditClick={(emp) => setEditEmployee(emp)}
                />
            )}

            {/* ✅ Attendance */}
            {activeTab === "attendance" && (user?.role === "employee" ? <EmployeeAttendance /> : isAdmin && <Attendance />)}

            {/* ✅ Tasks */}
            {activeTab === "tasks" && (user?.role === "employee" ? <EmployeeTasks /> : isAdmin && <Tasks />)}

            {/* ✅ Announcements */}
            {activeTab === "announcements" && (user?.role === "employee" ? <EmployeeAnnouncements /> : isAdmin && <Announcements />)}

            {/* ✅ Leaves */}
            {activeTab === "leaves" && user?.role === "employee" && <EmployeeLeaves />}

            {/* ✅ Holidays */}
            {activeTab === "holidays" && <HolidayPage />}

            {/* ✅ Payroll */}
            {activeTab === "payroll" && (isAdmin ? <Payroll /> : user?.role === "employee" ? <EmployeePayroll /> : null)}

            {/* ✅ Wages Creation */}
            {activeTab === "wages-creation" && isAdmin && <WagesCreation />}

            {/* ✅ Expenditure */}
            {activeTab === "expenditure" && isAdmin && <Expenditure />}

            {/* ✅ Employee Profile */}
            {activeTab === "profile" && user?.role === "employee" && <EmployeeProfile />}

            {/* ✅ Performance */}
            {activeTab === "performance" && (isAdmin ? <Performance /> : user?.role === "employee" ? <EmployeePerformance /> : null)}

            {/* ✅ Settings */}
            {activeTab === "settings" && isAdmin && <Settings />}

            {/* ✅ Tracking */}
            {activeTab === "tracking" && isAdmin && <Tracking />}

            {/* ✅ Recruitment */}
            {activeTab === "recruitment" && isAdmin && <Recruitment />}

            {/* Access Denied */}
            {!visibleNavIds.includes(activeTab) && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 select-none">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-xl font-extrabold text-slate-700 mb-1">Access Denied</h2>
                    <p className="text-sm text-slate-400">You don't have permission to view this page.</p>
                </div>
            )}

            {/* ═══ Modals ═══ */}
            {showAddForm && <EmployeeForm onClose={() => setShowAddForm(false)} onSuccess={triggerRefresh} />}
            {editEmployee && <EmployeeForm employee={editEmployee} onClose={() => setEditEmployee(null)} onSuccess={triggerRefresh} />}
            {viewEmployee && (
                <EmployeeDetail
                    employee={viewEmployee}
                    onClose={() => setViewEmployee(null)}
                    onEdit={(emp) => { setViewEmployee(null); setEditEmployee(emp); }}
                />
            )}
        </>
    );
}
