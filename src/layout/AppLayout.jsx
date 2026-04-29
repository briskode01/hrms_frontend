// @ts-nocheck
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
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const NAV_ITEMS = [
    { id: "dashboard", label: "Home", icon: House, roles: ["admin", "employee"] },
    { id: "employees", label: "Employees", icon: Users, roles: ["admin"] },
    { id: "attendance", label: "Attendance", icon: Calendar, roles: ["admin", "employee"] },
    { id: "tasks", label: "Tasks", icon: ClipboardList, roles: ["admin", "employee"] },
    { id: "announcements", label: "News Feed", icon: Megaphone, roles: ["admin", "employee"] },
    { id: "leaves", label: "Leaves", icon: FileText, roles: ["employee"] },
    { id: "payroll", label: "Payroll", icon: CreditCard, roles: ["admin", "employee"] },
    { id: "wages-creation", label: "Wages Creation", icon: Banknote,     roles: ["admin"] },
    { id: "expenditure",    label: "Expenditure",   icon: TrendingUp,   roles: ["admin"] },
    { id: "holidays",       label: "Holidays",      icon: Gift,         roles: ["admin", "employee"] },
    { id: "profile", label: "Profile", icon: User, roles: ["employee"] },
    { id: "performance", label: "Performance", icon: BarChart3, roles: ["admin", "employee"] },
    { id: "tracking", label: "Tracking", icon: MapPin, roles: ["admin"] },
    { id: "recruitment", label: "Recruitment", icon: Briefcase, roles: ["admin"] },
    { id: "settings", label: "Settings", icon: Settings, roles: ["admin"] },
];

export default function AppLayout({ activeTab, setActiveTab, children }) {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1280);

    // Only show nav items allowed for the current user's role
    const visibleNavItems = NAV_ITEMS.filter((item) =>
        item.roles.includes(user?.role)
    );

    const activeItem = visibleNavItems.find((n) => n.id === activeTab) || visibleNavItems[0];
    const activeLabel = activeItem?.label;

    return (
        <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                navItems={visibleNavItems}
            />

            <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                <Navbar
                    activeLabel={activeLabel}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 min-w-0 overflow-auto p-3 sm:p-5 lg:p-7">
                    {children}
                </main>
            </div>
        </div>
    );
}
