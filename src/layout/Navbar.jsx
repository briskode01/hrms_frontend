// @ts-nocheck

import { useEffect, useRef, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ROLE_STYLES = {
    admin: "bg-rose-500/20 text-rose-400",
    hr: "bg-blue-500/20 text-blue-400",
    employee: "bg-emerald-500/20 text-emerald-400",
};

export default function Navbar({ activeLabel, onToggleSidebar }) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const containerRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const { data } = await API.get("/notifications", { params: { limit: 6 } });
            setNotifications(Array.isArray(data?.data) ? data.data : []);
        } catch {
            // silent
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await API.patch("/notifications/read-all");
            fetchNotifications();
        } catch {
            // silent
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter((note) => !note.isRead).length;

    const formatTime = (value) => {
        if (!value) return "";
        return new Date(value).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    return (
        <header className="bg-white border-b border-slate-100 px-4 lg:px-7 py-3 lg:py-4 flex items-center gap-3 lg:gap-4 flex-shrink-0 shadow-sm">
            <button
                onClick={onToggleSidebar}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <div className="flex-1 min-w-0">
                <h1 className="text-base lg:text-lg font-extrabold text-slate-900 truncate">{activeLabel}</h1>
                <p className="text-xs text-slate-400 hidden sm:block">HR Management</p>
            </div>

            {/* Role badge */}
            <span className={`hidden sm:block px-3 py-1 rounded-xl text-xs font-bold capitalize ${ROLE_STYLES[user?.role]}`}>
                {user?.role}
            </span>

            {/* Notification Bell */}
            <div className="relative" ref={containerRef}>
                <button
                    onClick={() => {
                        const nextOpen = !open;
                        setOpen(nextOpen);
                        if (!open) fetchNotifications();
                    }}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </button>
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                )}

                {open && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-extrabold text-slate-900">Notifications</p>
                                <p className="text-xs text-slate-400">Latest updates</p>
                            </div>
                            {notifications.length > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Mark all
                                </button>
                            )}
                        </div>

                        {notifications.length > 0 ? (
                            <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                                {notifications.map((note) => (
                                    <div key={note._id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-slate-900 truncate">{note.title}</p>
                                                <p className="text-xs text-slate-500 mt-1 leading-5 line-clamp-2">{note.message}</p>
                                                <p className="text-[11px] text-slate-400 mt-2">{formatTime(note.createdAt)}</p>
                                            </div>
                                            {!note.isRead && (
                                                <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 py-8 text-center text-slate-400">
                                <div className="text-2xl mb-2">🔔</div>
                                <p className="text-sm font-medium">No notifications</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
