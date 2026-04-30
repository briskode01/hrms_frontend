// client/src/pages/Settings.jsx
// ─────────────────────────────────────────────────────────────
// Settings page — Profile, Password, User Management (Admin)
// ─────────────────────────────────────────────────────────────

import ChangePassword from "@/components/settings/ChangePassword";
import ProfileSettings from "@/components/settings/ProfileSettings";
import UserManagement from "@/components/settings/UserManagement";
import { useAuth } from "@/context/AuthContext";

export default function Settings() {
    const { isSuperAdmin } = useAuth();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h2>
                <p className="text-sm text-slate-400 mt-0.5">Manage your account and system preferences</p>
            </div>

            {/* Profile Settings */}
            <ProfileSettings />

            {/* Change Password */}
            <ChangePassword />

            {/* User Management — Super Admin only */}
            {isSuperAdmin && <UserManagement />}
        </div>
    );
}
