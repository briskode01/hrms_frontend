// @ts-nocheck
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import NAV_ITEMS from "../utils/navItems";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout({ activeTab, setActiveTab, children }) {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1280);

    const visibleNavItems = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));
    const activeItem  = visibleNavItems.find((n) => n.id === activeTab) || visibleNavItems[0];
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
