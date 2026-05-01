// @ts-nocheck
// client/src/pages/Careers.jsx
// ─────────────────────────────────────────────────────────────
// PUBLIC page — no login needed. Anyone can visit /careers
// Browse jobs → click Apply → fill form → upload PDF → submit
// ─────────────────────────────────────────────────────────────

import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApplyJobModal from "../../components/careers/ApplyJobModal";
import CareersFilters from "../../components/careers/CareersFilters";
import JobDetailModal from "../../components/careers/JobDetailModal";
import JobsGrid from "../../components/careers/JobsGrid";
import { defaultForm, departments, jobTypes } from "../../components/careers/constants";

const PUBLIC_API = axios.create({ baseURL: "https://sportyfi.com/api" });

export default function Careers() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterDept, setFilterDept] = useState("All");
    const [filterType, setFilterType] = useState("All");
    const [selectedJob, setSelectedJob] = useState(null);
    const [applyJob, setApplyJob] = useState(null);
    const [form, setForm] = useState(defaultForm);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formError, setFormError] = useState("");
    const [dragOver, setDragOver] = useState(false);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const params = {};
            if (search) params.search = search;
            if (filterDept !== "All") params.department = filterDept;
            if (filterType !== "All") params.jobType = filterType;
            const { data } = await PUBLIC_API.get("/jobs/public", { params });
            setJobs(data.data);
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [search, filterDept, filterType]);

    const updateFormField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const openApply = (job) => {
        setApplyJob(job);
        setForm(defaultForm);
        setFormError("");
        setSubmitted(false);
        setSelectedJob(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) updateFormField("resume", file);
    };

    const handleApply = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!form.resume) {
            setFormError("Please upload your resume (PDF only)");
            return;
        }
        if (form.resume.type !== "application/pdf") {
            setFormError("Only PDF files are allowed");
            return;
        }
        if (form.resume.size > 5 * 1024 * 1024) {
            setFormError("File size must be less than 5MB");
            return;
        }

        const formData = new FormData();
        formData.append("jobId", applyJob._id);
        formData.append("firstName", form.firstName);
        formData.append("lastName", form.lastName);
        formData.append("email", form.email);
        formData.append("phone", form.phone);
        formData.append("currentLocation", form.currentLocation);
        formData.append("experienceYears", form.experienceYears || 0);
        formData.append("currentCompany", form.currentCompany);
        formData.append("coverLetter", form.coverLetter);
        formData.append("resume", form.resume);

        try {
            setSubmitting(true);
            await PUBLIC_API.post("/applications", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSubmitted(true);
        } catch (err) {
            setFormError(err.response?.data?.message || "Submission failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#f7f8fc_0%,#eef2f8_48%,#f7f8fc_100%)] text-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                    <Link to="/" className="flex items-center">
                        <img
                            src="/sportyfi.png"
                            alt="HRFlow"
                            className="w-32 object-cover shadow-sm"
                        />
                    </Link>

                    <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
                        <Link to="/" className="transition-colors hover:text-slate-950">Home</Link>
                        <Link to="#positions" className="transition-colors hover:text-slate-950">Open Positions</Link>
                        <Link to="#why-join" className="transition-colors hover:text-slate-950">Why Join</Link>
                    </nav>

                    <Link
                        to="/login"
                        className="inline-flex rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:bg-slate-800"
                    >
                        Sign In
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/career.jpg')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-white/45" />
                <div className="absolute inset-0">
                    <div className="absolute -left-32 top-12 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
                    <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
                    <div className="max-w-3xl">
                        <p className="text-sm font-bold uppercase tracking-[0.26em] text-sky-700">Join Our Team</p>
                        <h1 className="mt-4 text-5xl font-black leading-[1.1] tracking-tight text-slate-950 md:text-6xl">
                            Build HR systems that empower teams
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                            We're hiring talented professionals to help companies streamline workforce management. Explore open positions and apply today.
                        </p>
                        <div className="mt-8">
                            <Link to="#positions" className="inline-flex rounded-2xl bg-linear-to-r from-sky-600 to-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/30">
                                View Open Positions
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Positions Section */}
            <section id="positions" className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
                <div className="mb-10">
                    <p className="text-sm font-bold uppercase tracking-[0.26em] text-sky-700">Career Opportunities</p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                        {loading ? "Loading positions..." : `${jobs.length} open position${jobs.length !== 1 ? "s" : ""}`}
                    </h2>
                </div>

                {/* Filters */}
                <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <CareersFilters
                        departments={departments}
                        jobTypes={jobTypes}
                        filterDept={filterDept}
                        filterType={filterType}
                        onDeptChange={setFilterDept}
                        onTypeChange={setFilterType}
                    />
                </div>

                {/* Jobs Grid */}
                <JobsGrid
                    jobs={jobs}
                    loading={loading}
                    onSelectJob={setSelectedJob}
                    onApply={openApply}
                />
            </section>

            {/* Why Join Section */}
            <section id="why-join" className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
                <div className="rounded-4xl bg-[#0f172a] p-8 text-white shadow-xl shadow-slate-900/10 lg:p-12">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.26em] text-cyan-300">Career Growth</p>
                            <h2 className="mt-4 text-3xl font-black tracking-tight">Why join HRFlow?</h2>
                            <p className="mt-4 text-base leading-8 text-slate-300">
                                We believe great HR technology starts with great people. Join a team that values innovation, collaboration, and professional growth in a dynamic, supportive environment.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/10">
                                <p className="text-2xl font-black text-cyan-300">40+</p>
                                <p className="mt-2 text-sm text-slate-300">Team members across regions</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/10">
                                <p className="text-2xl font-black text-cyan-300">100%</p>
                                <p className="mt-2 text-sm text-slate-300">Remote-friendly positions</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/10">
                                <p className="text-2xl font-black text-cyan-300">5</p>
                                <p className="mt-2 text-sm text-slate-300">Departments and specialties</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/10">
                                <p className="text-2xl font-black text-cyan-300">24/7</p>
                                <p className="mt-2 text-sm text-slate-300">Learning and growth resources</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-16">
                <div className="overflow-hidden rounded-4xl  bg-[url('https://clarity.microsoft.com/blog/wp-content/uploads/2025/02/FI-CTAcall-to-actionThedesiretoclick-1536x768.png')] p-8 text-black shadow-2xl shadow-blue-900/15 lg:p-10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.26em] text-cyan-600">Ready to apply?</p>
                            <h2 className="mt-3 text-2xl font-black tracking-tight">Find your next opportunity above and apply now.</h2>
                        </div>
                        <Link
                            to="/"
                            className="inline-flex rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-slate-100"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="footer" className="border-t border-slate-200 bg-white/90">
                <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr_0.9fr] lg:px-8">
                    <div>
                        <div className="flex items-center gap-3">
                            <img
                                src="/sportyfi.png"
                                alt="HRFlow"
                                className=" w-32 object-cover shadow-sm"
                            />
                        </div>
                        <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
                            Professional HR management for attendance, payroll, performance, and workforce operations in one connected platform.
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.22em] text-slate-500">Quick Links</p>
                        <div className="mt-4 flex flex-col gap-3 text-sm font-medium text-slate-600">
                            <Link to="/" className="transition-colors hover:text-slate-950">Home</Link>
                            <Link to="/careers" className="transition-colors hover:text-slate-950">Careers</Link>
                            <Link to="/login" className="transition-colors hover:text-slate-950">Sign In</Link>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.22em] text-slate-500">Contact</p>
                        <div className="mt-4 space-y-3 text-sm text-slate-600">
                            <p>
                                <Link
                                    to="mailto:briskodetechnology@gmail.com"
                                    className="transition-colors hover:text-slate-950"
                                >
                                    briskodetechnology@gmail.com
                                </Link>
                            </p>
                            <p>
                                <Link
                                    to="tel:+919078534843"
                                    className="transition-colors hover:text-slate-950"
                                >
                                    +91 9078534843
                                </Link>
                            </p>
                            <p>Workforce operations and internal HR management</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200/80 px-6 py-4 text-center lg:px-8">
                    <Link
                        to="https://briskodetechnology.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-slate-600"
                    >
                        Designed By Briskode Technology Pvt. Ltd.
                    </Link>
                </div>
            </footer>

            {/* Modals */}
            <JobDetailModal
                selectedJob={selectedJob}
                onClose={() => setSelectedJob(null)}
                onApply={openApply}
            />
            <ApplyJobModal
                applyJob={applyJob}
                submitted={submitted}
                form={form}
                formError={formError}
                submitting={submitting}
                dragOver={dragOver}
                onClose={() => setApplyJob(null)}
                onSubmit={handleApply}
                onFieldChange={updateFormField}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            />
        </div>
    );
}
