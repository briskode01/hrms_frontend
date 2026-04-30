// @ts-nocheck
// utils/navItems.js
// ─────────────────────────────────────────────────────────────
// Single source of truth for navigation items.
// AppLayout uses `label` + `icon` + `roles` to render the sidebar.
// AppRoutes uses `id` + `roles` to control page access.
// ─────────────────────────────────────────────────────────────

import {
    BarChart3,
    Briefcase,
    Calendar,
    Banknote,
    ClipboardList,
    CreditCard,
    FileText,
    House,
    MapPin,
    Settings,
    TrendingUp,
    User,
    Users,
    Gift,
    Megaphone,
} from "lucide-react";

const NAV_ITEMS = [
    { id: "dashboard", label: "Home", icon: House, roles: ["super_admin", "hr_admin", "manager", "finance_admin", "employee"] },
    { id: "employees", label: "Employees", icon: Users, roles: ["super_admin", "hr_admin", "manager"] },
    { id: "attendance", label: "Attendance", icon: Calendar, roles: ["super_admin", "hr_admin", "employee"] },
    { id: "tasks", label: "Tasks", icon: ClipboardList, roles: ["super_admin", "hr_admin", "manager", "employee"] },
    { id: "announcements", label: "News Feed", icon: Megaphone, roles: ["super_admin", "hr_admin", "employee"] },
    { id: "leaves", label: "Leaves", icon: FileText, roles: ["employee"] },
    { id: "payroll", label: "Payroll", icon: CreditCard, roles: ["super_admin", "finance_admin", "employee"] },
    { id: "wages-creation", label: "Wages Creation", icon: Banknote, roles: ["super_admin", "finance_admin"] },
    { id: "expenditure", label: "Expenditure", icon: TrendingUp, roles: ["super_admin", "finance_admin"] },
    { id: "holidays", label: "Holidays", icon: Gift, roles: ["super_admin", "hr_admin", "manager", "finance_admin", "employee"] },
    { id: "profile", label: "Profile", icon: User, roles: ["employee"] },
    { id: "performance", label: "Performance", icon: BarChart3, roles: ["super_admin", "hr_admin", "manager", "employee"] },
    { id: "tracking", label: "Tracking", icon: MapPin, roles: ["super_admin"] },
    { id: "recruitment", label: "Recruitment", icon: Briefcase, roles: ["super_admin", "hr_admin"] },
    { id: "settings", label: "Settings", icon: Settings, roles: ["super_admin", "hr_admin", "finance_admin", "manager"] },
];

export default NAV_ITEMS;
