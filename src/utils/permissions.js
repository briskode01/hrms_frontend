// @ts-nocheck
// utils/permissions.js
// ─────────────────────────────────────────────────────────────
// Client-side mirror of the backend ROLE_PERMISSIONS map.
// Used for UI gating — hiding/showing buttons, tabs, pages.
// NOTE: This is for UX only. Real enforcement lives on the backend.
// ─────────────────────────────────────────────────────────────

/** All roles that are considered "admin-side" (non-employee) */
export const ADMIN_ROLES = ["super_admin", "hr_admin", "manager", "finance_admin"];

/** Role display names for UI */
export const ROLE_LABELS = {
    super_admin:  "Super Admin",
    hr_admin:     "HR Admin",
    manager:      "Manager",
    finance_admin:"Finance Admin",
    employee:     "Employee",
};

/**
 * Role → permission strings map (mirrors backend).
 * "admin" and "hr" are kept as legacy aliases.
 */
export const ROLE_PERMISSIONS = {
    super_admin: [
        "manage_users", "manage_employees", "manage_attendance", "approve_leave",
        "manage_payroll", "manage_expenditure", "manage_wages", "view_reports",
        "manage_settings", "manage_recruitment", "manage_tasks", "manage_announcements",
        "manage_performance", "manage_tracking", "manage_holidays",
    ],
    hr_admin: [
        "manage_employees", "manage_attendance", "approve_leave", "view_reports",
        "manage_recruitment", "manage_tasks", "manage_announcements",
        "manage_performance", "manage_holidays",
    ],
    manager: [
        "approve_leave", "view_reports", "manage_performance", "manage_tasks",
    ],
    finance_admin: [
        "manage_payroll", "manage_expenditure", "manage_wages", "view_reports",
    ],
    employee: [
        "view_own_attendance", "request_leave", "view_own_payroll", "view_own_performance",
    ],
};

/**
 * Check if a role has a specific permission.
 * @param {string} role
 * @param {string} permission
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
    const perms = ROLE_PERMISSIONS[role] || [];
    return perms.includes(permission);
};

/**
 * Check if the role is any kind of admin (non-employee).
 * @param {string} role
 * @returns {boolean}
 */
export const isAdminRole = (role) => ADMIN_ROLES.includes(role);
