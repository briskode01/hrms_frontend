// @ts-nocheck
// client/src/components/performance/ReviewForm.jsx

import { CYCLES_NO_ALL, YEARS, STAR_LABELS, SectionLabel, FieldLabel } from "./constants";

export default function ReviewForm({ form, setForm, employees, editReview, onSubmit, onClose, updateKpi }) {

    // ─── StarRating (uses form + setForm from props) ──────────
    const StarRating = ({ field, label }) => (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
                <span className="text-xs text-slate-400">{STAR_LABELS[form[field]]}</span>
            </div>
            <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setForm((p) => ({ ...p, [field]: star }))}
                        className={`text-xl transition-all ${form[field] >= star ? "text-amber-400 scale-110" : "text-slate-200 hover:text-amber-200"}`}>
                        ★
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="sticky top-0 bg-white flex items-center justify-between px-7 py-5 border-b border-slate-100 z-10 rounded-t-2xl">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900">
                            {editReview ? "✏️ Edit Review" : "➕ New Performance Review"}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {editReview ? "Update review details" : "Fill in scores and feedback"}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors text-lg font-bold">✕</button>
                </div>

                <form onSubmit={onSubmit} className="px-7 py-6 space-y-7">

                    {/* ── Section 1: Basic Info ── */}
                    <div>
                        <SectionLabel color="blue" title="Basic Information" />
                        <div className="grid grid-cols-3 gap-4">
                            {/* Employee */}
                            <div className="col-span-3">
                                <FieldLabel label="Employee" required />
                                <select required value={form.employee} onChange={(e) => setForm((p) => ({ ...p, employee: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors">
                                    <option value="">-- Select Employee --</option>
                                    {employees.map((emp) => (
                                        <option key={emp._id} value={emp._id}>
                                            {emp.firstName} {emp.lastName} ({emp.employeeId})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Cycle */}
                            <div>
                                <FieldLabel label="Review Cycle" required />
                                <select value={form.reviewCycle} onChange={(e) => setForm((p) => ({ ...p, reviewCycle: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors">
                                    {CYCLES_NO_ALL.map((c) => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            {/* Year */}
                            <div>
                                <FieldLabel label="Year" required />
                                <select value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: Number(e.target.value) }))}
                                    className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors">
                                    {YEARS.map((y) => <option key={y}>{y}</option>)}
                                </select>
                            </div>
                            {/* Status */}
                            <div>
                                <FieldLabel label="Status" />
                                <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors">
                                    {["Draft", "Submitted", "Acknowledged", "Closed"].map((s) => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-slate-200" />

                    {/* ── Section 2: KPI Scores ── */}
                    <div>
                        <SectionLabel color="violet" title="KPI Scores" />
                        <div className="space-y-3">
                            {form.kpis.map((kpi, i) => (
                                <div key={i} className="bg-slate-50 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-bold text-slate-800">{kpi.title}</p>
                                        <span className="text-xs text-slate-500">Weight: {kpi.weight}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 items-center">
                                        <div>
                                            <label className="text-xs text-slate-500 mb-1 block">Target</label>
                                            <input type="number" min="0" max="100" value={kpi.target}
                                                onChange={(e) => updateKpi(i, "target", e.target.value)}
                                                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 mb-1 block">Achieved</label>
                                            <input type="number" min="0" max="100" value={kpi.achieved}
                                                onChange={(e) => updateKpi(i, "achieved", e.target.value)}
                                                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 mb-1 block">Score</label>
                                            <div className="px-3 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl text-center">
                                                {kpi.target > 0 ? Math.round((kpi.achieved / kpi.target) * 100) : 0}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-dashed border-slate-200" />

                    {/* ── Section 3: Rating Categories ── */}
                    <div>
                        <SectionLabel color="amber" title="Skill Ratings (1–5 Stars)" />
                        <div className="grid grid-cols-2 gap-5">
                            <StarRating field="technicalSkills" label="Technical Skills" />
                            <StarRating field="communication" label="Communication" />
                            <StarRating field="teamwork" label="Teamwork" />
                            <StarRating field="leadership" label="Leadership" />
                            <StarRating field="punctuality" label="Punctuality" />
                            <StarRating field="problemSolving" label="Problem Solving" />
                        </div>
                    </div>

                    <div className="border-t border-dashed border-slate-200" />

                    {/* ── Section 4: Feedback ── */}
                    <div>
                        <SectionLabel color="emerald" title="Qualitative Feedback" />
                        <div className="space-y-3">
                            {[
                                { label: "Strengths", field: "strengths", placeholder: "What did the employee do well?" },
                                { label: "Areas of Improvement", field: "areasOfImprovement", placeholder: "What can be improved?" },
                                { label: "Goals for Next Cycle", field: "goals", placeholder: "Targets and objectives for next review..." },
                                { label: "Manager Comments", field: "managerComments", placeholder: "Overall manager feedback..." },
                            ].map(({ label, field, placeholder }) => (
                                <div key={field}>
                                    <FieldLabel label={label} />
                                    <textarea rows={2} placeholder={placeholder} value={form[field]}
                                        onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                                        className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none resize-none placeholder-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-dashed border-slate-200" />

                    {/* ── Section 5: Increment / Promotion ── */}
                    <div>
                        <SectionLabel color="rose" title="Increment & Promotion" />
                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl cursor-pointer">
                                <input type="checkbox" checked={form.incrementRecommended}
                                    onChange={(e) => setForm((p) => ({ ...p, incrementRecommended: e.target.checked }))}
                                    className="w-5 h-5 accent-emerald-600 rounded" />
                                <div>
                                    <p className="text-sm font-bold text-emerald-800">Recommend Increment</p>
                                    <p className="text-xs text-emerald-600">Suggest a salary hike</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-4 bg-violet-50 border border-violet-200 rounded-xl cursor-pointer">
                                <input type="checkbox" checked={form.promotionRecommended}
                                    onChange={(e) => setForm((p) => ({ ...p, promotionRecommended: e.target.checked }))}
                                    className="w-5 h-5 accent-violet-600 rounded" />
                                <div>
                                    <p className="text-sm font-bold text-violet-800">Recommend Promotion</p>
                                    <p className="text-xs text-violet-600">Suggest a role upgrade</p>
                                </div>
                            </label>
                        </div>
                        {form.incrementRecommended && (
                            <div className="mt-3">
                                <FieldLabel label="Increment Percentage (%)" />
                                <input type="number" min="0" max="100"
                                    value={form.incrementPercent}
                                    onChange={(e) => setForm((p) => ({ ...p, incrementPercent: Number(e.target.value) }))}
                                    placeholder="e.g. 10"
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors" />
                            </div>
                        )}
                    </div>

                    {/* ── Action Buttons ── */}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold transition-colors">
                            Cancel
                        </button>
                        <button type="submit"
                            className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5">
                            {editReview ? "Update Review" : "Submit Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
