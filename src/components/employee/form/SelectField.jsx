// @ts-nocheck
export default function SelectField({ label, name, options, colSpan = "", form, onChange }) {
    return (
        <div className={colSpan}>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                {label}
            </label>
            <select
                name={name}
                value={form[name]}
                onChange={onChange}
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
            >
                {options.map((option) => <option key={option}>{option}</option>)}
            </select>
        </div>
    );
}
