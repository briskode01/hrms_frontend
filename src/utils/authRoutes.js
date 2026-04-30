// @ts-nocheck
import { ADMIN_ROLES } from "./permissions";

/**
 * Returns the correct dashboard path for a given role.
 * All admin-type roles land on /admin/dashboard.
 */
export const getDashboardPathByRole = (role) => {
    if (ADMIN_ROLES.includes(role)) return "/admin/dashboard";
    if (role === "employee") return "/employee/dashboard";
    return "/";
};