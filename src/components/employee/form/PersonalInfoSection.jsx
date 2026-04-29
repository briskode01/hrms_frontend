// @ts-nocheck
import Field from "./Field";
import SelectField from "./SelectField";

export default function PersonalInfoSection({ form, errors, onChange, genders }) {
    return (
        <div>
            <h3 className="text-xs font-extrabold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-5 h-0.5 bg-blue-600 rounded" /> Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" name="firstName" placeholder="Priya" required form={form} errors={errors} onChange={onChange} />
                <Field label="Last Name" name="lastName" placeholder="Sharma" required form={form} errors={errors} onChange={onChange} />
                <Field label="Email" name="email" type="email" placeholder="priya@company.com" required form={form} errors={errors} onChange={onChange} />
                <Field
                    label="Phone"
                    name="phone"
                    placeholder="9876543210"
                    required
                    form={form}
                    errors={errors}
                    onChange={onChange}
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                />
                <Field label="Date of Birth" name="dateOfBirth" type="date" form={form} errors={errors} onChange={onChange} />
                <SelectField label="Gender" name="gender" options={genders} form={form} onChange={onChange} />
            </div>
            <div className="mt-4">
                <Field label="Address" name="address" placeholder="Full residential address..." form={form} errors={errors} onChange={onChange} />
            </div>
        </div>
    );
}
