// @ts-nocheck
import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AdminProfileCard from "./AdminProfileCard";
import EmployeeProfileCard from "./EmployeeProfileCard";

const ROLE_STYLES = {
    admin: "bg-rose-500/20 text-rose-400",
    employee: "bg-emerald-500/20 text-emerald-400",
};

const BUILT_MODULES = ["dashboard", "employees", "attendance", "tasks", "announcements", "leaves", "payroll", "wages-creation", "expenditure", "profile", "performance", "tracking", "recruitment", "settings", "holidays"];

export default function Sidebar({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab, navItems }) {
    const { user, logout } = useAuth();
    const [empProfile, setEmpProfile] = useState(null);
    const expandedDesktopWidthClass = user?.role === "employee" ? "md:w-60" : "md:w-64";
    const isEmployee = user?.role === "employee";

    useEffect(() => {
        if (user?.role !== "employee") return;
        API.get("/dashboard/employee")
            .then((res) => {
                if (res.data?.data?.profile?.hasEmployeeRecord) {
                    setEmpProfile(res.data.data.profile);
                }
            })
            .catch(() => { });
    }, [user?.role]);

    const handleNavClick = (id) => {
        setActiveTab(id);
        // Close sidebar on mobile after navigation
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    return (
        <>
            {/* ── Mobile backdrop ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <aside className={`
                ${sidebarOpen ? `translate-x-0 ${expandedDesktopWidthClass}` : "-translate-x-full md:translate-x-0 md:w-20"}
                fixed md:relative inset-y-0 left-0 z-40
                w-64
                bg-slate-900 flex flex-col shrink-0
                transition-all duration-300 overflow-hidden
            `}>

                {/* Logo */}
                <div className={`flex items-center ${sidebarOpen ? "justify-start" : "justify-center"} px-4 ${isEmployee ? "py-3.5" : "py-4"} border-b border-slate-800`}>
                    <div className="rounded-xl bg-white px-2 py-1">
                        <img
                            src="/sportyfi.png"
                            alt="HRMS"
                            className={`${sidebarOpen ? "w-28" : "w-9"} object-contain`}
                        />
                    </div>
                </div>

                {/* Scrollable area: nav + profile */}
                <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-slate-900 [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">

                    {/* Nav */}
                    <nav className={`flex-1 px-2 ${isEmployee ? "py-2.5" : "py-3"} ${isEmployee ? "space-y-0" : "space-y-0.5"}`}>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`w-full flex items-center gap-2.5 px-3 ${isEmployee ? "py-1.5" : "py-2"} rounded-xl ${isEmployee ? "text-sm" : "text-[15px]"} font-semibold transition-all duration-200
                            ${activeTab === item.id
                                            ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/30"
                                            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                        }`}
                                >
                                    <span className="shrink-0 inline-flex items-center justify-center w-5 h-5">
                                        {Icon && typeof Icon !== "string" ? (
                                            <Icon size={18} strokeWidth={2} className="text-current" />
                                        ) : typeof Icon === "string" ? (
                                            <span className="text-sm">{Icon}</span>
                                        ) : (
                                            <span className="text-sm">•</span>
                                        )}
                                    </span>
                                    {sidebarOpen && (
                                        <span className="truncate flex-1 text-left">{item.label}</span>
                                    )}
                                    {/* On mobile, sidebar is always full width when open, so show labels */}
                                    {!sidebarOpen && (
                                        <span className="truncate flex-1 text-left md:hidden">{item.label}</span>
                                    )}
                                    {sidebarOpen && !BUILT_MODULES.includes(item.id) && item.id !== "dashboard" && (
                                        <span className="text-[10px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded-md font-bold">SOON</span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* User Profile + Logout */}
                    <div className={`px-2 ${isEmployee ? "py-2.5" : "py-3"} border-t border-slate-800 space-y-1`}>
                        {/* Mobile: always show full profile */}
                        <div className="px-3 py-3 bg-slate-800/60 rounded-xl md:hidden">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                                    {user?.name?.[0]?.toUpperCase()}
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <p className="text-white text-xs font-bold truncate">{user?.name}</p>
                                    <p className="text-slate-500 text-xs truncate">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`px-2 py-0.5 rounded-md text-xs font-bold capitalize ${ROLE_STYLES[user?.role]}`}>
                                    {user?.role}
                                </span>
                                <button onClick={logout} className="text-xs text-slate-500 hover:text-red-400 font-bold transition-colors">
                                    Sign out
                                </button>
                            </div>
                        </div>

                        {/* Desktop expanded */}
                        {sidebarOpen ? (
                            <div className="hidden md:block">
                                {user?.role === "employee" && empProfile ? (
                                    <EmployeeProfileCard
                                        empProfile={empProfile}
                                        employeeId={user?.employee?._id || user?.employee}
                                        onLogout={logout}
                                        onViewAllLeaves={() => handleNavClick("leaves")}
                                    />
                                ) : (
                                    <AdminProfileCard user={user} onLogout={logout} />
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={logout}
                                title="Sign out"
                                className="w-full items-center justify-center px-3 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors hidden md:flex"
                            >
                                <span className="text-lg">🚪</span>
                            </button>
                        )}
                    </div>

                </div> {/* end scrollable area */}
            </aside>
        </>
    );
}
