// @ts-nocheck
import { QUICK_LINKS } from "../shared/constants";

export default function QuickLinksSection({ navigate, setActiveTab }) {
  const handleQuickLinkClick = (link) => {
    if (setActiveTab && !String(link.path).startsWith("/")) {
      setActiveTab(link.path);
      return;
    }
    navigate(link.path);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {QUICK_LINKS.map((link) => (
        <button
          key={link.label}
          onClick={() => handleQuickLinkClick(link)}
          className={`bg-white border border-slate-200 p-4 flex items-center gap-3 text-left transition-all hover:shadow-md hover:-translate-y-0.5 ${link.color} group`}
        >
          <span className="text-2xl">{link.icon}</span>
          <div>
            <p className="text-sm font-bold text-slate-700 group-hover:text-inherit transition-colors">{link.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">View →</p>
          </div>
        </button>
      ))}
    </div>
  );
}
