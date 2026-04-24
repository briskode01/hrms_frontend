// @ts-nocheck
// client/src/pages/Performance.jsx
// Slim orchestrator — all UI is delegated to sub-components

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "@/api/axios";

import { DEFAULT_FORM, DEFAULT_KPIS, REVIEW_CYCLES, STATUSES, YEARS } from "@/components/performance/constants";
import ReviewCard from "@/components/performance/ReviewCard";
import ReviewDetail from "@/components/performance/ReviewDetail";
import ReviewForm from "@/components/performance/ReviewForm";
import StatsTab from "@/components/performance/StatsTab";

export default function PerformancePage() {
    const [reviews, setReviews] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCycle, setSelectedCycle] = useState("All");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [showForm, setShowForm] = useState(false);
    const [editReview, setEditReview] = useState(null);
    const [viewReview, setViewReview] = useState(null);
    const [form, setForm] = useState(DEFAULT_FORM);
    const [activeTab, setActiveTab] = useState("reviews");

    // ─── Data Fetching ───────────────────────────────────────────
    const fetchReviews = async () => {
        try {
            setLoading(true);
            const params = { year: selectedYear };
            if (selectedCycle !== "All") params.reviewCycle = selectedCycle;
            if (selectedStatus !== "All") params.status = selectedStatus;
            const { data } = await API.get("/performance", { params });
            setReviews(data.data);
        } catch {
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await API.get("/performance/stats/summary", { params: { year: selectedYear } });
            setStats(data.data);
        } catch { /* silent */ }
    };

    const fetchEmployees = async () => {
        try {
            const { data } = await API.get("/employees", { params: { status: "Active" } });
            setEmployees(data.data);
        } catch { /* silent */ }
    };

    useEffect(() => { fetchEmployees(); }, []);
    useEffect(() => { fetchReviews(); fetchStats(); }, [selectedCycle, selectedYear, selectedStatus]);

    // ─── Actions ─────────────────────────────────────────────────
    const openAddForm = () => {
        setForm(DEFAULT_FORM);
        setEditReview(null);
        setShowForm(true);
    };

    const openEditForm = (review) => {
        setForm({
            employee: review.employee?._id || review.employee,
            reviewCycle: review.reviewCycle,
            year: review.year,
            reviewerName: review.reviewerName,
            kpis: review.kpis?.length ? review.kpis : DEFAULT_KPIS,
            technicalSkills: review.technicalSkills,
            communication: review.communication,
            teamwork: review.teamwork,
            leadership: review.leadership,
            punctuality: review.punctuality,
            problemSolving: review.problemSolving,
            strengths: review.strengths,
            areasOfImprovement: review.areasOfImprovement,
            goals: review.goals,
            managerComments: review.managerComments,
            employeeComments: review.employeeComments,
            incrementRecommended: review.incrementRecommended,
            incrementPercent: review.incrementPercent,
            promotionRecommended: review.promotionRecommended,
            status: review.status,
        });
        setEditReview(review);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editReview) {
                await API.put(`/performance/${editReview._id}`, form);
                toast.success("Review updated! ✅");
            } else {
                await API.post("/performance", form);
                toast.success("Review created! 🎉");
            }
            setShowForm(false);
            fetchReviews();
            fetchStats();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save review");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this performance review?")) return;
        try {
            await API.delete(`/performance/${id}`);
            toast.success("Deleted successfully");
            fetchReviews();
            fetchStats();
        } catch {
            toast.error("Failed to delete");
        }
    };

    const updateKpi = (i, field, value) => {
        const updated = [...form.kpis];
        updated[i] = { ...updated[i], [field]: field === "remarks" ? value : Number(value) };
        setForm((p) => ({ ...p, kpis: updated }));
    };

    // ─── UI ──────────────────────────────────────────────────────
    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Performance</h2>
                    <p className="text-sm text-slate-400 mt-0.5">Manage employee performance reviews & KPIs</p>
                </div>
                <button onClick={openAddForm}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5">
                    + New Review
                </button>
            </div>

            {/* Sub Tabs */}
            <div className="flex gap-2">
                {["reviews", "stats"].map((t) => (
                    <button key={t} onClick={() => setActiveTab(t)}
                        className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all
                            ${activeTab === t
                                ? "bg-slate-900 text-white shadow-md"
                                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"}`}>
                        {t === "reviews" ? "📋 Reviews" : "📊 Stats & Insights"}
                    </button>
                ))}
            </div>

            {/* ═══ Reviews Tab ═══ */}
            {activeTab === "reviews" && (
                <>
                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 items-center">
                        {[
                            { value: selectedCycle, setter: setSelectedCycle, options: REVIEW_CYCLES, label: "Cycle" },
                            { value: selectedYear, setter: setSelectedYear, options: YEARS, label: "Year", isNum: true },
                            { value: selectedStatus, setter: setSelectedStatus, options: STATUSES, label: "Status" },
                        ].map(({ value, setter, options, label, isNum }) => (
                            <select key={label} value={value} onChange={(e) => setter(isNum ? Number(e.target.value) : e.target.value)}
                                className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none cursor-pointer shadow-sm hover:border-blue-400 transition-colors">
                                {options.map((o) => <option key={o} value={o}>{o}</option>)}
                            </select>
                        ))}
                    </div>

                    {/* Reviews Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                            <p className="text-sm font-medium">Loading reviews...</p>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <div className="text-5xl mb-3">📈</div>
                            <p className="text-base font-semibold text-slate-600">No reviews found</p>
                            <p className="text-sm mt-1">Click "+ New Review" to create the first review</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {reviews.map((r) => (
                                <ReviewCard
                                    key={r._id}
                                    review={r}
                                    onView={setViewReview}
                                    onEdit={openEditForm}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* ═══ Stats Tab ═══ */}
            {activeTab === "stats" && <StatsTab stats={stats} selectedYear={selectedYear} />}

            {/* ═══ Add / Edit Modal ═══ */}
            {showForm && (
                <ReviewForm
                    form={form}
                    setForm={setForm}
                    employees={employees}
                    editReview={editReview}
                    onSubmit={handleSubmit}
                    onClose={() => setShowForm(false)}
                    updateKpi={updateKpi}
                />
            )}

            {/* ═══ View Detail Modal ═══ */}
            {viewReview && (
                <ReviewDetail
                    review={viewReview}
                    onClose={() => setViewReview(null)}
                    onEdit={(review) => { setViewReview(null); openEditForm(review); }}
                />
            )}
        </div>
    );
}