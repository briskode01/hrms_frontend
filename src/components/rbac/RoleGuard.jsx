// @ts-nocheck
// components/rbac/RoleGuard.jsx
// Conditionally renders children based on role or permission.
//
// Usage:
//   <RoleGuard roles={["super_admin", "hr_admin"]}>...</RoleGuard>
//   <RoleGuard permission="manage_payroll">...</RoleGuard>
//   <RoleGuard roles={["manager"]} fallback={<p>No access</p>}>...</RoleGuard>

import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../utils/permissions";

export default function RoleGuard({ roles, permission, fallback = null, children }) {
    const { user } = useAuth();
    const role = user?.role;

    if (roles && roles.length > 0) {
        if (!roles.includes(role)) return fallback;
    }

    if (permission) {
        if (!hasPermission(role, permission)) return fallback;
    }

    return children;
}
