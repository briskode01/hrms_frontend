// @ts-nocheck
// client/src/components/settings/ProfileSettings.jsx
// ─────────────────────────────────────────────────────────────
// Update name and email
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function ProfileSettings() {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim()) return toast.error("Name and email are required");
        try {
            setLoading(true);
            const { data } = await API.put("/auth/update-profile", form);
            // Update auth context + localStorage in one call
            updateUser({ name: data.data.name, email: data.data.email });
            toast.success("Profile updated! ✅");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="mb-5">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-lg">👤</span>
                    Profile Information
                </h3>
                <p className="text-xs text-slate-400 mt-1 ml-10">Update your name and email address</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 ml-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                        <input
                            name="name" value={form.name} onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                            placeholder="Your full name"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                        <input
                            name="email" type="email" value={form.email} onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>
                <button
                    type="submit" disabled={loading}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-200 hover:shadow-lg hover:-translate-y-0.5"}`}
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
