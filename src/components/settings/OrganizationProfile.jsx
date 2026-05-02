// @ts-nocheck
import { useState, useEffect } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

export default function OrganizationProfile() {
    const [form, setForm] = useState({
        organizationName: "",
        registrationNumber: "",
        industry: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: "",
        email: "",
        website: "",
    });
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        fetchOrganizationData();
    }, []);

    const fetchOrganizationData = async () => {
        try {
            const { data } = await API.get("/settings/organization");
            if (data.data) {
                setForm(data.data);
            }
        } catch (err) {
            // Organization data might not exist yet, that's okay
        } finally {
            setInitialLoad(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.organizationName.trim()) return toast.error("Organization name is required");
        try {
            setLoading(true);
            await API.post("/settings/organization", form);
            toast.success("Organization profile updated! 🏢");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update organization");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoad) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="mb-5">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-lg">🏢</span>
                    Organization Profile
                </h3>
                <p className="text-xs text-slate-400 mt-1 ml-10">Manage your organization details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 ml-10">
                {/* Organization Name & Registration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Organization Name *</label>
                        <input
                            name="organizationName"
                            value={form.organizationName}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                            placeholder="Your company name"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Registration Number</label>
                        <input
                            name="registrationNumber"
                            value={form.registrationNumber}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                            placeholder="CIN / Registration Number"
                        />
                    </div>
                </div>

                {/* Industry */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Industry</label>
                    <input
                        name="industry"
                        value={form.industry}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                        placeholder="e.g., Technology, Manufacturing, Services"
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Address</label>
                    <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                        placeholder="Street address"
                    />
                </div>

                {/* City, State, Zip, Country */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">City</label>
                        <input
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                            placeholder="City"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">State</label>
                        <input
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                            placeholder="State"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Zip Code</label>
                        <input
                            name="zipCode"
                            value={form.zipCode}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                            placeholder="Zip/Postal Code"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Country</label>
                        <input
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                            placeholder="Country"
                        />
                    </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone</label>
                        <input
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                            placeholder="+91 XXXXX XXXXX"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                            placeholder="org@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Website</label>
                        <input
                            name="website"
                            value={form.website}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                            placeholder="https://example.com"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${
                        loading
                            ? "bg-slate-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5"
                    }`}
                >
                    {loading ? "Saving..." : "Save Organization"}
                </button>
            </form>
        </div>
    );
}
