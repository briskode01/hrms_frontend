// @ts-nocheck

const ROLE_STYLES = {
    admin: "bg-rose-500/20 text-rose-400",
    hr: "bg-blue-500/20 text-blue-400",
    employee: "bg-emerald-500/20 text-emerald-400",
};

export default function AdminProfileCard({ user, onLogout }) {
    return (
        <div className="px-3 py-3 bg-slate-800/60 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="overflow-hidden flex-1">
                    <p className="text-white text-xs font-bold truncate">{user?.name}</p>
                    <p className="text-slate-500 text-xs truncate">{user?.email}</p>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold capitalize ${ROLE_STYLES[user?.role]}`}>
                    {user?.role}
                </span>
                <button onClick={onLogout} className="text-xs text-slate-500 hover:text-red-400 font-bold transition-colors">
                    Sign out
                </button>
            </div>
        </div>
    );
}
