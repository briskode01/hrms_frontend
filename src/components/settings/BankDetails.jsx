// @ts-nocheck
import { useState, useEffect } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

export default function BankDetails() {
    const [form, setForm] = useState({
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        panNumber: "",
    });
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        fetchBankDetails();
    }, []);

    const fetchBankDetails = async () => {
        try {
            const { data } = await API.get("/settings/bank");
            if (data.data) {
                setForm(data.data);
            }
        } catch (err) {
            // Bank data might not exist yet, that's okay
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
        if (!form.bankName.trim() || !form.accountNumber.trim() || !form.ifscCode.trim()) {
            return toast.error("Bank name, account number, and IFSC code are required");
        }
        try {
            setLoading(true);
            await API.post("/settings/bank", form);
            toast.success("Bank details updated! 🏦");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update bank details");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoad) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="mb-5">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-lg">🏦</span>
                    Bank Account Details
                </h3>
                <p className="text-xs text-slate-400 mt-1 ml-10">Organization bank account and payment information</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 ml-10">
                {/* Bank Name & IFSC */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bank Name *</label>
                        <input
                            name="bankName"
                            value={form.bankName}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors"
                            placeholder="e.g., State Bank of India"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">IFSC Code *</label>
                        <input
                            name="ifscCode"
                            value={form.ifscCode}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors"
                            placeholder="e.g., SBIN0001234"
                        />
                    </div>
                </div>

                {/* Account Number */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Account Number *</label>
                    <input
                        name="accountNumber"
                        value={form.accountNumber}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors"
                        placeholder="Account number"
                    />
                </div>

                {/* PAN Number */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">PAN Number</label>
                    <input
                        name="panNumber"
                        value={form.panNumber}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors"
                        placeholder="e.g., AAAPJ5055K"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${
                        loading
                            ? "bg-slate-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md shadow-green-200 hover:shadow-lg hover:-translate-y-0.5"
                    }`}
                >
                    {loading ? "Saving..." : "Save Bank Details"}
                </button>
            </form>
        </div>
    );
}
