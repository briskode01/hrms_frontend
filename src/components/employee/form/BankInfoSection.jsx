// @ts-nocheck
import React from "react";

export default function BankInfoSection({ form, errors, onChange }) {
    const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
    const labelClass = "block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider";

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3 mb-1">
                <span className="text-indigo-600 font-black text-sm">|</span>
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Bank & Identity Details</h3>
                <span className="text-[10px] text-slate-400 font-medium">(Required for Payroll)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Bank Name */}
                <div>
                    <label className={labelClass}>Bank Name</label>
                    <input
                        type="text" name="bankName" value={form.bankName} onChange={onChange}
                        placeholder="e.g. State Bank of India" className={inputClass}
                    />
                </div>

                {/* Account Number */}
                <div>
                    <label className={labelClass}>Account Number</label>
                    <input
                        type="text" name="accountNumber" value={form.accountNumber} onChange={onChange}
                        placeholder="e.g. 123456789012" className={inputClass}
                    />
                </div>

                {/* IFSC Code */}
                <div>
                    <label className={labelClass}>IFSC Code</label>
                    <input
                        type="text" name="ifscCode" value={form.ifscCode} onChange={onChange}
                        placeholder="e.g. SBIN0001234" className={inputClass}
                    />
                </div>

                {/* PAN Number */}
                <div>
                    <label className={labelClass}>PAN Number</label>
                    <input
                        type="text" name="panNumber" value={form.panNumber} onChange={onChange}
                        placeholder="e.g. ABCDE1234F" className={inputClass}
                    />
                </div>

                {/* PF Number */}
                <div>
                    <label className={labelClass}>PF Number (Optional)</label>
                    <input
                        type="text" name="pfNumber" value={form.pfNumber} onChange={onChange}
                        placeholder="e.g. OR/BBS/12345/678" className={inputClass}
                    />
                </div>

                {/* PF UAN */}
                <div>
                    <label className={labelClass}>PF UAN (Optional)</label>
                    <input
                        type="text" name="pfUAN" value={form.pfUAN} onChange={onChange}
                        placeholder="12-digit UAN number" className={inputClass}
                    />
                </div>
            </div>
        </div>
    );
}
