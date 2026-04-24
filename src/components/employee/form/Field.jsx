// @ts-nocheck
export default function Field({ label, name, type = "text", placeholder, required, colSpan = "", form, errors, onChange, ...inputProps }) {
    return (
        <div className={colSpan}>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={form[name]}
                onChange={onChange}
                placeholder={placeholder}
                {...inputProps}
                className={`w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border outline-none transition-colors placeholder-slate-300
          ${errors[name]
                        ? "border-red-400 focus:border-red-500 bg-red-50"
                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
            />
            {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
        </div>
    );
}
