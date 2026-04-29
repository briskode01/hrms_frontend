// @ts-nocheck

import { useState } from "react";
import { FaLock } from "react-icons/fa6";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ role: "admin", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.email || !form.password) {
            setError("Please enter both email and password");
            return;
        }
        setLoading(true);
        const result = await login(form.email, form.password, form.role);
        if (!result.success) {
            setError(result.message || "Invalid credentials");
        } else if (result.redirectPath) {
            navigate(result.redirectPath, { replace: true });
        }
        setLoading(false);
    };

    return (
        <div className="relative min-h-screen bg-white flex items-center justify-center p-0 sm:p-4">

            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            {/* ═══════════════════════════════════════════════════
                 Main Card — Two Columns
            ═══════════════════════════════════════════════════ */}
            <div className="w-full max-w-5xl relative flex flex-col lg:flex-row rounded-none sm:rounded-3xl overflow-hidden sm:shadow-2xl sm:shadow-black/40 sm:border border-white/10 min-h-dvh sm:min-h-0">

                {/* ─── LEFT: Image Panel ─────────────────────────── */}
                <div className="hidden lg:block w-1/2 relative">
                    <img
                        src="/textile.avif"
                        alt="HRFlow - All-in-One HR Software"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>

                {/* ─── RIGHT: Login Form ─────────────────────────── */}
                <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center">

                    {/* Mobile-only logo */}
                    <div className="lg:hidden px-6 pt-7 pb-5 text-center border-b border-slate-200 bg-white/95">
                        <img
                            src="/sportyfi.png"
                            alt="HRFlow"
                            className="mx-auto w-32 object-cover"
                        />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-5 sm:px-8 lg:px-12 py-7 sm:py-10 space-y-5">
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-800">Role-Based Login</h2>
                            <p className="text-slate-500 text-sm mt-1">Choose your role and sign in to the matching dashboard</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                <span className="text-red-500 text-sm">⚠️</span>
                                <p className="text-red-600 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                Login As
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { value: "admin", label: "Admin", description: "Management dashboard" },
                                    { value: "employee", label: "Employee", description: "Personal dashboard" },
                                ].map((roleOption) => {
                                    const isSelected = form.role === roleOption.value;

                                    return (
                                        <button
                                            key={roleOption.value}
                                            type="button"
                                            onClick={() => setForm((prev) => ({ ...prev, role: roleOption.value }))}
                                            className={`rounded-2xl border px-3 py-3 text-left transition-all ${isSelected
                                                ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-100"
                                                : "border-slate-200 bg-slate-50 hover:border-slate-300"
                                                }`}
                                        >
                                            <p className="text-sm font-bold text-slate-800">{roleOption.label}</p>
                                            <p className="mt-1 text-[11px] leading-4 text-slate-500">{roleOption.description}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"><MdEmail /></span>
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    value={form.email}
                                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"><FaLock /></span>
                                <input
                                    type={showPwd ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                                    className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-sm"
                                >
                                    {showPwd ? <IoMdEyeOff /> : <IoEye />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all
                                ${loading
                                    ? "bg-slate-400 cursor-not-allowed"
                                    : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : "Sign In →"}
                        </button>
                    </form>

                    <p className="text-center text-slate-400 text-xs pb-6 pt-1">
                        <Link
                            to="https://briskodetechnology.com"
                            target="_blank"
                            rel="noreferrer"
                            className="transition-colors hover:text-slate-500"
                        >
                            Designed By Briskode Technology Pvt. Ltd.
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}