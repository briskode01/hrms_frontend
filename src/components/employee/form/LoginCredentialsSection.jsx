// @ts-nocheck
import Field from "./Field";

export default function LoginCredentialsSection({ form, errors, onChange, onToggleCreateLogin }) {
    return (
        <div>
            <h3 className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-5 h-0.5 bg-emerald-600 rounded" /> Employee Login Credentials
            </h3>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer">
                <input
                    type="checkbox"
                    name="createLogin"
                    checked={form.createLogin}
                    onChange={onToggleCreateLogin}
                    className="w-4 h-4"
                />
                <span className="text-sm font-semibold text-slate-700">Create login account for this employee</span>
            </label>

            <p className="text-xs text-slate-400 mt-2">
                Login email will be the employee email: <span className="font-semibold text-slate-600">{form.email || "(not set yet)"}</span>
            </p>

            {form.createLogin && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <Field
                        label="Temporary Password"
                        name="loginPassword"
                        type="password"
                        placeholder="Minimum 6 characters"
                        required
                        form={form}
                        errors={errors}
                        onChange={onChange}
                    />
                    <Field
                        label="Confirm Password"
                        name="confirmLoginPassword"
                        type="password"
                        placeholder="Re-enter password"
                        required
                        form={form}
                        errors={errors}
                        onChange={onChange}
                    />
                </div>
            )}
        </div>
    );
}
