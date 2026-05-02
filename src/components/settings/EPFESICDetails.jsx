// @ts-nocheck
import { useState, useEffect } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

export default function EPFESICDetails() {
    const [form, setForm] = useState({
        pfNumber: "",
        pfUAN: "",
        esicNumber: "",
    });
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        fetchEPFESICDetails();
    }, []);

    const fetchEPFESICDetails = async () => {
        try {
            const { data } = await API.get("/settings/epf-esic");
            if (data.data) {
                setForm(data.data);
            }
        } catch (err) {
            // EPF/ESIC data might not exist yet, that's okay
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
        try {
            setLoading(true);
            await API.post("/settings/epf-esic", form);
            toast.success("EPF/ESIC details updated! ✅");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update EPF/ESIC details");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoad) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="mb-5">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-lg">📋</span>
                    EPF & ESIC Details
                </h3>
                <p className="text-xs text-slate-400 mt-1 ml-10">Provident fund and social security registration details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 ml-10">
                {/* PF Number & UAN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">PF Establishment Code</label>
                        <input
                            name="pfNumber"
                            value={form.pfNumber}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-colors"
                            placeholder="e.g., TN/ABC/12345"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Universal Account Number (UAN)</label>
                        <input
                            name="pfUAN"
                            value={form.pfUAN}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-colors"
                            placeholder="e.g., 100123456789"
                        />
                    </div>
                </div>

                {/* ESIC Number */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">ESIC Registration Number</label>
                    <input
                        name="esicNumber"
                        value={form.esicNumber}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-colors"
                        placeholder="e.g., 33000123456789"
                    />
                </div>

                {/* Info Box */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3">
                    <p className="text-xs text-purple-700 font-medium">
                        <strong>Note:</strong> These details are used for employee compliance and statutory reporting.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${
                        loading
                            ? "bg-slate-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-200 hover:shadow-lg hover:-translate-y-0.5"
                    }`}
                >
                    {loading ? "Saving..." : "Save EPF/ESIC Details"}
                </button>
            </form>
        </div>
    );
}
