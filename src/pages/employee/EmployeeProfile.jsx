// @ts-nocheck

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../api/axios";


export default function EmployeeProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/dashboard/employee");
        const empProfile = data?.data?.profile;
        setProfile(empProfile?.hasEmployeeRecord ? empProfile : null);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load employee profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const fmtDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl pb-8">
      <div className="absolute inset-0 bg-[url('/profile.png')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-white/15" />

      <div className="relative z-10 space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight p-1">My Profile</h2>
      </div>

      <div className="bg-white/78 rounded-2xl shadow-sm border border-slate-100 p-6 backdrop-blur-[1px]">
        <h3 className="text-base font-extrabold text-slate-900 mb-4">Employment Details</h3>

        {loading ? (
          <div className="flex items-center gap-3 text-slate-400 py-2">
            <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm">Loading employee details...</p>
          </div>
        ) : !profile ? (
          <p className="text-sm text-slate-500">Your account is not linked to an employee profile yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              ["Employee ID", profile.employeeId],
              ["Full Name", profile.name],
              ["Email", profile.email],
              ["Phone", profile.phone],
              ["Department", profile.department],
              ["Designation", profile.designation],
              ["Employment Type", profile.employmentType],
              ["Status", profile.status],
              ["Joining Date", fmtDate(profile.joiningDate)],
              ["Date of Birth", fmtDate(profile.dateOfBirth)],
              ["Gender", profile.gender],
              ["Field Agent", profile.isFieldAgent ? "Yes" : "No"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                <p className="text-sm font-bold text-slate-800 mt-1 truncate">{value || "—"}</p>
              </div>
            ))}

            <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Address</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{profile.address || "—"}</p>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
