// @ts-nocheck
// routes/AppRoutes.jsx
// ─────────────────────────────────────────────────────────────
// Renders the correct page component based on the active tab
// and the current user's RBAC role.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { isAdminRole } from "../utils/permissions";
import NAV_ITEMS from "../utils/navItems";

// Admin pages
import Attendance    from "../pages/admin/Attendance";
import Dashboard     from "../pages/admin/Dashboard";
import Employees     from "../pages/admin/Employees";
import Payroll       from "../pages/admin/Payroll";
import Performance   from "../pages/admin/Performance";
import Recruitment   from "../pages/admin/Recruitment";
import Settings      from "../pages/admin/Settings";
import Tasks         from "../pages/admin/Tasks";
import Tracking      from "../pages/admin/Tracking";
import Announcements from "../pages/admin/Announcements";
import WagesCreation from "../pages/admin/WagesCreation";
import Expenditure   from "../pages/admin/expenditure/Expenditure";

// Employee pages
import EmployeeAttendance   from "../pages/employee/EmployeeAttendance";
import EmployeeDashboard    from "../pages/employee/EmployeeDashboard";
import EmployeeLeaves       from "../pages/employee/EmployeeLeaves";
import EmployeePayroll      from "../pages/employee/EmployeePayroll";
import EmployeePerformance  from "../pages/employee/EmployeePerformance";
import EmployeeProfile      from "../pages/employee/EmployeeProfile";
import EmployeeTasks        from "../pages/employee/EmployeeTasks";
import EmployeeAnnouncements from "../pages/employee/Announcements";

// Shared pages
import HolidayPage from "../pages/HolidayPage";

// Modals
import EmployeeDetail from "../components/employee/EmployeeDetail";
import EmployeeForm   from "../components/employee/EmployeeForm";


export default function AppRoutes({ activeTab, setActiveTab }) {
    const { user, isSuperAdmin, isHRAdmin, isManager, isFinanceAdmin, hasPermission } = useAuth();
    const role = user?.role;
    const userIsAdmin = isAdminRole(role);

    const [showAddForm,     setShowAddForm]     = useState(false);
    const [editEmployee,    setEditEmployee]     = useState(null);
    const [viewEmployee,    setViewEmployee]     = useState(null);
    const [refreshTrigger,  setRefreshTrigger]   = useState(0);

    const triggerRefresh = () => setRefreshTrigger((n) => n + 1);

    const visibleNavIds = NAV_ITEMS
        .filter((n) => n.roles.includes(role))
        .map((n) => n.id);

    // ── Convenience booleans ──────────────────────────────────────
    const canManageEmployees  = hasPermission("manage_employees");
    const canManagePayroll    = hasPermission("manage_payroll");
    const canManageExpenditure = hasPermission("manage_expenditure");
    const canApproveLeave     = hasPermission("approve_leave");
    const canManageSettings   = hasPermission("manage_settings");
    const canManageTracking   = hasPermission("manage_tracking");
    const canManageRecruitment = hasPermission("manage_recruitment");
    const canManageAttendance = hasPermission("manage_attendance");

    return (
        <>
            {/* ── Dashboard ── */}
            {activeTab === "dashboard" && (
                role === "employee"
                    ? <EmployeeDashboard setActiveTab={setActiveTab} />
                    : <Dashboard setActiveTab={setActiveTab} />
            )}

            {/* ── Employees (super_admin, hr_admin, manager can view) ── */}
            {activeTab === "employees" && canManageEmployees && (
                <Employees
                    key={refreshTrigger}
                    onAddClick={() => setShowAddForm(true)}
                    onViewClick={(emp) => setViewEmployee(emp)}
                    onEditClick={(emp) => setEditEmployee(emp)}
                />
            )}
            {activeTab === "employees" && !canManageEmployees && isManager && (
                <Employees
                    key={refreshTrigger}
                    readOnly
                    onViewClick={(emp) => setViewEmployee(emp)}
                />
            )}

            {/* ── Attendance ── */}
            {activeTab === "attendance" && (
                role === "employee"
                    ? <EmployeeAttendance />
                    : userIsAdmin && <Attendance />
            )}


            {/* ── Tasks ── */}
            {activeTab === "tasks" && (
                role === "employee" ? <EmployeeTasks /> : userIsAdmin && <Tasks />
            )}

            {/* ── Announcements ── */}
            {activeTab === "announcements" && (
                role === "employee" ? <EmployeeAnnouncements /> : userIsAdmin && <Announcements />
            )}

            {/* ── Leaves ── */}
            {activeTab === "leaves" && (
                role === "employee"
                    ? <EmployeeLeaves />
                    : canApproveLeave && <EmployeeLeaves adminView />
            )}

            {/* ── Holidays ── */}
            {activeTab === "holidays" && <HolidayPage />}

            {/* ── Payroll ── */}
            {activeTab === "payroll" && (
                canManagePayroll
                    ? <Payroll />
                    : role === "employee"
                        ? <EmployeePayroll />
                        : null
            )}

            {/* ── Wages Creation (super_admin, finance_admin) ── */}
            {activeTab === "wages-creation" && canManagePayroll && <WagesCreation />}

            {/* ── Expenditure (super_admin, finance_admin) ── */}
            {activeTab === "expenditure" && canManageExpenditure && <Expenditure />}

            {/* ── Employee Profile ── */}
            {activeTab === "profile" && role === "employee" && <EmployeeProfile />}

            {/* ── Performance ── */}
            {activeTab === "performance" && (
                userIsAdmin
                    ? <Performance />
                    : role === "employee"
                        ? <EmployeePerformance />
                        : null
            )}

            {/* ── Settings — visible to any admin role; page controls what each role sees ── */}
            {activeTab === "settings" && userIsAdmin && <Settings />}


            {/* ── Tracking (super_admin only) ── */}
            {activeTab === "tracking" && canManageTracking && <Tracking />}

            {/* ── Recruitment (super_admin, hr_admin) ── */}
            {activeTab === "recruitment" && canManageRecruitment && <Recruitment />}

            {/* ── Access Denied ── */}
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
