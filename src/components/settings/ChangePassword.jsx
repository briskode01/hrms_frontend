// @ts-nocheck
// client/src/components/settings/ChangePassword.jsx
// ─────────────────────────────────────────────────────────────
// Change password form
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

export default function ChangePassword() {
    const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.currentPassword || !form.newPassword) return toast.error("Please fill all password fields");
        if (form.newPassword.length < 6) return toast.error("New password must be at least 6 characters");
        if (form.newPassword !== form.confirmPassword) return toast.error("Passwords do not match");
        try {
            setLoading(true);
            await API.put("/auth/change-password", {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            toast.success("Password changed! 🔒");
            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="mb-5">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-lg">🔑</span>
                    Change Password
                </h3>
                <p className="text-xs text-slate-400 mt-1 ml-10">Update your account password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 ml-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Current Password</label>
                        <input
                            name="currentPassword" type={showPasswords ? "text" : "password"}
                            value={form.currentPassword} onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">New Password</label>
                        <input
                            name="newPassword" type={showPasswords ? "text" : "password"}
                            value={form.newPassword} onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                            placeholder="Min 6 characters"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Confirm Password</label>
                        <input
                            name="confirmPassword" type={showPasswords ? "text" : "password"}
                            value={form.confirmPassword} onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                            placeholder="Re-enter new password"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
                        <input
                            type="checkbox" checked={showPasswords}
                            onChange={() => setShowPasswords(!showPasswords)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        Show passwords
                    </label>
                    <button
                        type="submit" disabled={loading}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-200 hover:shadow-lg hover:-translate-y-0.5"}`}
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </div>
            </form>
        </div>
    );
}
