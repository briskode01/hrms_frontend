// @ts-nocheck
// client/src/components/EmployeeForm.jsx
// Add / Edit Employee modal — fully styled with Tailwind CSS

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../api/axios";
import JobInfoSection from "./form/JobInfoSection";
import LoginCredentialsSection from "./form/LoginCredentialsSection";
import PersonalInfoSection from "./form/PersonalInfoSection";
import DocumentsSection from "./form/DocumentsSection";
import BankInfoSection from "./form/BankInfoSection";
import { defaultForm, DEPARTMENTS, EMP_TYPES, GENDERS, STATUSES } from "./form/constants";

export default function EmployeeForm({ employee, onClose, onSuccess }) {
    const isEditMode = Boolean(employee);
    const [form, setForm] = useState(defaultForm);
    const [docs, setDocs] = useState({ bankDetails: null, aadhar: null, resume: null, offerLetter: null });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Pre-fill in edit mode
    useEffect(() => {
        if (isEditMode && employee) {
            setForm({
                firstName: employee.firstName || "",
                lastName: employee.lastName || "",
                email: employee.email || "",
                phone: employee.phone || "",
                dateOfBirth: employee.dateOfBirth?.slice(0, 10) || "",
                gender: employee.gender || "Male",
                address: employee.address || "",
                department: employee.department || "Engineering",
                designation: employee.designation || "",
                employmentType: employee.employmentType || "Full-Time",
                joiningDate: employee.joiningDate?.slice(0, 10) || "",
                endingDate: employee.endingDate?.slice(0, 10) || "",
                status: employee.status || "Active",
                salary: employee.salary || "",
                createLogin: false,
                loginPassword: "",
                confirmLoginPassword: "",
                // Bank Info
                bankName: employee.bankInfo?.bankName || "",
                accountNumber: employee.bankInfo?.accountNumber || "",
                ifscCode: employee.bankInfo?.ifscCode || "",
                panNumber: employee.bankInfo?.panNumber || "",
                pfNumber: employee.bankInfo?.pfNumber || "",
                pfUAN: employee.bankInfo?.pfUAN || "",
            });
        }
    }, [employee, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const nextValue = name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
        setForm((p) => ({ ...p, [name]: nextValue }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    };

    const handleCreateLoginToggle = (e) => {
        setForm((prev) => ({ ...prev, createLogin: e.target.checked }));
    };

    const handleFileChange = (field, file) => {
        setDocs((prev) => ({ ...prev, [field]: file }));
    };

    const validate = () => {
        const e = {};
        if (!form.firstName.trim()) e.firstName = "Required";
        if (!form.lastName.trim()) e.lastName = "Required";
        if (!form.email.trim()) e.email = "Required";
        if (!form.phone.trim()) e.phone = "Required";
        else if (!/^\d{10}$/.test(form.phone)) e.phone = "Phone number must be exactly 10 digits";
        if (!form.designation.trim()) e.designation = "Required";
        if (!form.salary) e.salary = "Required";
        if (!form.joiningDate) e.joiningDate = "Required";

        if (!isEditMode && form.createLogin) {
            if (!form.loginPassword) {
                e.loginPassword = "Required";
            } else if (form.loginPassword.length < 6) {
                e.loginPassword = "Minimum 6 characters";
            }

            if (!form.confirmLoginPassword) {
                e.confirmLoginPassword = "Required";
            } else if (form.confirmLoginPassword !== form.loginPassword) {
                e.confirmLoginPassword = "Passwords do not match";
            }
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            setLoading(true);

            // Build multipart FormData to support file uploads
            const fd = new FormData();
            const payloadBase = {
                ...form,
                createLogin: form.createLogin,
                loginPassword: form.createLogin ? form.loginPassword : undefined,
            };
            const { confirmLoginPassword, ...payload } = payloadBase;

            Object.entries(payload).forEach(([k, v]) => {
                if (v !== undefined && v !== null) fd.append(k, String(v));
            });

            // Attach document files if selected (only actual files, not strings)
            Object.entries(docs).forEach(([k, file]) => {
                if (file instanceof File || file instanceof Blob) {
                    fd.append(k, file);
                }
            });

            if (isEditMode) {
                await API.put(`/employees/${employee._id}`, fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Employee updated! ✅");
            } else {
                const { data } = await API.post("/employees", fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                if (data?.data?.loginCreated) {
                    toast.success("Employee + login credentials created! 🎉");
                } else {
                    toast.success("Employee added! 🎉");
                }
            }
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.error || err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Backdrop
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            {/* Modal */}
            <div
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900">
                            {isEditMode ? "✏️ Edit Employee" : "➕ Add New Employee"}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {isEditMode
                                ? `Editing ${employee.firstName} ${employee.lastName}`
                                : "Fill in the details to add a new employee"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors text-lg font-bold"
                    >✕</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-7 py-6 space-y-7">
                    <PersonalInfoSection
                        form={form}
                        errors={errors}
                        onChange={handleChange}
                        genders={GENDERS}
                    />

                    {/* Divider */}
                    <div className="border-t border-dashed border-slate-200" />

                    <JobInfoSection
                        form={form}
                        errors={errors}
                        onChange={handleChange}
                        departments={DEPARTMENTS}
                        empTypes={EMP_TYPES}
                        statuses={STATUSES}
                    />

                    {/* Divider */}
                    {!isEditMode && <div className="border-t border-dashed border-slate-200" />}

                    {!isEditMode && (
                        <LoginCredentialsSection
                            form={form}
                            errors={errors}
                            onChange={handleChange}
                            onToggleCreateLogin={handleCreateLoginToggle}
                        />
                    )}

                    {/* Divider */}
                    <div className="border-t border-dashed border-slate-200" />

                    {/* Bank Info — always shown */}
                    <BankInfoSection form={form} errors={errors} onChange={handleChange} />

                    {/* Divider */}
                    <div className="border-t border-dashed border-slate-200" />

                    {/* Documents — always shown */}
                    <DocumentsSection docs={docs} onFileChange={handleFileChange} />

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button" onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold transition-colors"
                        >Cancel</button>
                        <button
                            type="submit" disabled={loading}
                            className={`flex-2 py-3 rounded-xl text-white text-sm font-bold transition-all
                ${loading
                                    ? "bg-slate-400 cursor-not-allowed"
                                    : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-200 hover:shadow-lg hover:-translate-y-0.5"
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </span>
                            ) : isEditMode ? "Update Employee" : "Add Employee"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}