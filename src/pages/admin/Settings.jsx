// client/src/pages/Settings.jsx
// ─────────────────────────────────────────────────────────────
// Settings page — Organization, Profile, Bank, EPF/ESIC,
// Password, User Management (Admin), and Access Control
// ─────────────────────────────────────────────────────────────

import ChangePassword from "@/components/settings/ChangePassword";
import ProfileSettings from "@/components/settings/ProfileSettings";
import OrganizationProfile from "@/components/settings/OrganizationProfile";
import BankDetails from "@/components/settings/BankDetails";
import EPFESICDetails from "@/components/settings/EPFESICDetails";
import UserManagement from "@/components/settings/UserManagement";
import { useAuth } from "@/context/AuthContext";

export default function Settings() {
    const { isSuperAdmin } = useAuth();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h2>
                <p className="text-sm text-slate-400 mt-0.5">Manage your account, organization, and system preferences</p>
            </div>

            {/* Organization Settings — Super Admin only */}
            {isSuperAdmin && (
                <>
                    <OrganizationProfile />
                    <BankDetails />
                    <EPFESICDetails />
                </>
            )}

            {/* Profile Settings — All users */}
            <ProfileSettings />

            {/* Change Password — All users */}
            <ChangePassword />

            {/* User Management & Access Control — Super Admin only */}
            {isSuperAdmin && <UserManagement />}
        </div>
    );
}
