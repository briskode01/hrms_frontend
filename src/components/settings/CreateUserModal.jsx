import { X } from "lucide-react";

export default function CreateUserModal({
    createForm,
    setCreateForm,
    creatableRoles,
    creatingUser,
    onClose,
    onSubmit,
}) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-slate-900">Create New User</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Full Name *</label>
                        <input
                            type="text"
                            value={createForm.name}
                            onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                            className="w-full px-3 py-2 text-sm text-slate-800 bg-white rounded-lg border border-slate-200 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-colors"
                            placeholder="User full name"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email *</label>
                        <input
                            type="email"
                            value={createForm.email}
                            onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
                            className="w-full px-3 py-2 text-sm text-slate-800 bg-white rounded-lg border border-slate-200 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-colors"
                            placeholder="user@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Password *</label>
                        <input
                            type="password"
                            value={createForm.password}
                            onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))}
                            className="w-full px-3 py-2 text-sm text-slate-800 bg-white rounded-lg border border-slate-200 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-colors"
                            placeholder="Min 6 characters"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Role *</label>
                        <select
                            value={createForm.role}
                            onChange={(e) => setCreateForm((p) => ({ ...p, role: e.target.value }))}
                            className="w-full px-3 py-2 text-sm text-slate-800 bg-white rounded-lg border border-slate-200 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-colors"
                        >
                            {creatableRoles.map((r) => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={creatingUser}
                            className={`flex-1 px-4 py-2 rounded-lg text-white font-bold text-sm transition-all ${
                                creatingUser
                                    ? "bg-slate-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800"
                            }`}
                        >
                            {creatingUser ? "Creating..." : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
