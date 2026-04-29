// @ts-nocheck
// client/src/pages/Recruitment.jsx
// HR Recruitment Dashboard — manage jobs + view applicants

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "@/api/axios";
import ApplicationDetailModal from "@/components/recruitment/ApplicationDetailModal";
import ApplicationsPanel from "@/components/recruitment/ApplicationsPanel";
import JobFormModal from "@/components/recruitment/JobFormModal";
import JobsPanel from "@/components/recruitment/JobsPanel";
import RecruitmentHeader from "@/components/recruitment/RecruitmentHeader";
import RecruitmentStats from "@/components/recruitment/RecruitmentStats";
import RecruitmentTabs from "@/components/recruitment/RecruitmentTabs";
import { defaultJobForm } from "@/components/recruitment/constants";

export default function Recruitment() {
    const [activeTab, setActiveTab] = useState("applications");
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterJob, setFilterJob] = useState("All");
    const [viewApp, setViewApp] = useState(null);
    const [showJobForm, setShowJobForm] = useState(false);
    const [editJob, setEditJob] = useState(null);
    const [jobForm, setJobForm] = useState(defaultJobForm);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filterStatus !== "All") params.status = filterStatus;
            if (filterJob !== "All") params.jobId = filterJob;
            const { data } = await API.get("/applications", { params });
            setApplications(data.data);
        } catch {
            toast.error("Failed to fetch applications");
        } finally {
            setLoading(false);
        }
    };

    const fetchJobs = async () => {
        try {
            const { data } = await API.get("/jobs");
            setJobs(data.data);
        } catch {
            // silent
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await API.get("/jobs/stats");
            setStats(data.data);
        } catch {
            // silent
        }
    };

    useEffect(() => {
        fetchApplications();
        fetchJobs();
        fetchStats();
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [filterStatus, filterJob]);

    const markReviewed = async (id) => {
        try {
            await API.put(`/applications/${id}`, { status: "Reviewed" });
            toast.success("Marked as Reviewed ✅");
            fetchApplications();
            fetchStats();
            if (viewApp?._id === id) {
                setViewApp((prev) => ({ ...prev, status: "Reviewed" }));
            }
        } catch {
            toast.error("Failed to update");
        }
    };

    const saveNotes = async (id, hrNotes) => {
        try {
            await API.put(`/applications/${id}`, { hrNotes });
            toast.success("Notes saved");
        } catch {
            toast.error("Failed to save notes");
        }
    };

    const deleteApp = async (id) => {
        if (!window.confirm("Delete this application and its resume?")) return;
        try {
            await API.delete(`/applications/${id}`);
            toast.success("Deleted");
            setViewApp(null);
            fetchApplications();
            fetchStats();
        } catch {
            toast.error("Delete failed");
        }
    };

    const openJobForm = (job = null) => {
        setEditJob(job);
        setJobForm(job ? {
            title: job.title,
            department: job.department,
            location: job.location,
            jobType: job.jobType,
            experienceLevel: job.experienceLevel,
            salaryMin: job.salaryMin,
            salaryMax: job.salaryMax,
            description: job.description,
            requirements: job.requirements,
            responsibilities: job.responsibilities,
            status: job.status,
            deadline: job.deadline ? job.deadline.split("T")[0] : "",
        } : defaultJobForm);
        setShowJobForm(true);
    };

    const updateJobForm = (field, value) => {
        setJobForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleJobSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editJob) {
                await API.put(`/jobs/${editJob._id}`, jobForm);
                toast.success("Job updated ✅");
            } else {
                await API.post("/jobs", jobForm);
                toast.success("Job posted! 🎉");
            }
            setShowJobForm(false);
            fetchJobs();
            fetchStats();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save job");
        }
    };

    const handleDeleteJob = async (id, title) => {
        if (!window.confirm(`Delete "${title}" and all its applications?`)) return;
        try {
            await API.delete(`/jobs/${id}`);
            toast.success("Job deleted");
            fetchJobs();
            fetchApplications();
            fetchStats();
        } catch {
            toast.error("Delete failed");
        }
    };

    const openResume = async (applicationId) => {
        try {
            const { data } = await API.get(`/applications/${applicationId}/resume`, {
                responseType: "blob",
            });

            const fileUrl = URL.createObjectURL(data);
            window.open(fileUrl, "_blank", "noopener,noreferrer");
            setTimeout(() => URL.revokeObjectURL(fileUrl), 10000);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to open resume");
        }
    };

    return (
        <div className="space-y-6">
            <RecruitmentHeader onPostJob={() => openJobForm()} />
            <RecruitmentStats stats={stats} />
            <RecruitmentTabs activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === "applications" && (
                <ApplicationsPanel
                    loading={loading}
                    applications={applications}
                    jobs={jobs}
                    filterStatus={filterStatus}
                    filterJob={filterJob}
                    onFilterStatus={setFilterStatus}
                    onFilterJob={setFilterJob}
                    onView={setViewApp}
                    onMarkReviewed={markReviewed}
                    onOpenResume={openResume}
                />
            )}

            {activeTab === "jobs" && (
                <JobsPanel
                    jobs={jobs}
                    onEditJob={openJobForm}
                    onDeleteJob={handleDeleteJob}
                />
            )}

            <ApplicationDetailModal
                viewApp={viewApp}
                onClose={() => setViewApp(null)}
                onSaveNotes={saveNotes}
                onMarkReviewed={markReviewed}
                onDelete={deleteApp}
                onOpenResume={openResume}
            />

            <JobFormModal
                show={showJobForm}
                editJob={editJob}
                jobForm={jobForm}
                onClose={() => setShowJobForm(false)}
                onSubmit={handleJobSubmit}
                onChange={updateJobForm}
            />
        </div>
    );
}
