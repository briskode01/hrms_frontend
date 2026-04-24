// @ts-nocheck
import Field from "./Field";
import SelectField from "./SelectField";

export default function JobInfoSection({ form, errors, onChange, departments, empTypes, statuses }) {
    return (
        <div>
            <h3 className="text-xs font-extrabold text-violet-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-5 h-0.5 bg-violet-600 rounded" /> Job Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <SelectField label="Department" name="department" options={departments} form={form} onChange={onChange} />
                <Field label="Designation" name="designation" placeholder="Software Engineer" required form={form} errors={errors} onChange={onChange} />
                <SelectField label="Employment Type" name="employmentType" options={empTypes} form={form} onChange={onChange} />
                <Field label="Joining Date" name="joiningDate" type="date" required form={form} errors={errors} onChange={onChange} />
                <Field label="Ending Date (Contract/Interns)" name="endingDate" type="date" form={form} errors={errors} onChange={onChange} />
                <SelectField label="Status" name="status" options={statuses} form={form} onChange={onChange} />
                <Field label="Monthly Salary (₹)" name="salary" type="number" placeholder="60000" required form={form} errors={errors} onChange={onChange} />
            </div>
        </div>
    );
}
