// @ts-nocheck
export default function CareersHero({ search, onSearchChange }) {
    return (
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-extrabold text-lg shadow-lg">H</div>
                    <span className="font-extrabold text-lg tracking-tight">HRFlow</span>
                </div>

                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                        Find Your Next<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            Dream Job
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg mb-8">
                        Browse open positions and apply with your resume. We'll review and get back to you soon.
                    </p>

                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
                        <input
                            type="text"
                            placeholder="Search jobs by title, department or location..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-12 pr-5 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl text-white placeholder-slate-400 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
