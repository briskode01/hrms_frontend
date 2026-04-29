// @ts-nocheck
export default function RecruitmentTabs({ activeTab, onChange }) {
    const tabs = [
        { id: "applications", label: "📥 Applications" },
        { id: "jobs", label: "💼 Job Listings" },
    ];

    return (
        <div className="flex gap-2">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all
              ${activeTab === tab.id
                            ? "bg-slate-900 text-white shadow-md"
                            : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
