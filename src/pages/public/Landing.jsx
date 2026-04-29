import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User, ChevronDown, LogOut } from "lucide-react";

const featureCards = [
    {
        title: "Attendance Control",
        description: "Monitor check-ins, leave records, and shift trends from a single operational view.",
    },
    {
        title: "Payroll Accuracy",
        description: "Generate salary cycles with clearer breakdowns, payout visibility, and month-end confidence.",
    },
    {
        title: "Performance Reviews",
        description: "Run structured evaluations with traceable goals, ratings, and improvement notes.",
    },
    {
        title: "Recruitment Pipeline",
        description: "Track roles, incoming applications, and hiring progress without scattered spreadsheets.",
    },
];

const metrics = [
    { value: "01", label: "Unified platform for HR operations" },
    { value: "24/7", label: "Access to employee and payroll data" },
    { value: "100%", label: "Visibility across workforce workflows" },
];

const highlights = [
    "Role-based access for admins and employees",
    "Centralized workforce data and attendance records",
    "Clean payroll and review workflows for growing teams",
];

export default function Landing() {
    const [userName, setUserName] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("hrflow_token");
        if (token) {
            try {
                const userInfo = JSON.parse(localStorage.getItem("hrflow_user"));
                if (userInfo?.name) {
                    setUserName(userInfo.name);
                }
            } catch (error) {
                console.error("Error reading user info:", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("hrflow_token");
        localStorage.removeItem("hrflow_user");
        setUserName(null);
        setDropdownOpen(false);
        navigate("/login");
    };

    const handleDashboard = () => {
        navigate("/dashboard");
        setDropdownOpen(false);
    };

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#f7f8fc_0%,#eef2f8_48%,#f7f8fc_100%)] text-slate-900">
            <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                    <div className="flex items-center">
                        <img
                            src="/sportyfi.png"
                            alt="HRFlow"
                            className=" w-32 object-cover shadow-sm"
                        />
                    </div>

                    <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
                        <Link to="#features" className="transition-colors hover:text-slate-950">Features</Link>
                        <Link to="#operations" className="transition-colors hover:text-slate-950">Operations</Link>
                        <Link to="#footer" className="transition-colors hover:text-slate-950">Contact</Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        {userName ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 hover:text-slate-700 transition-colors"
                                >
                                    <User size={18} />
                                    {userName}
                                    <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white border border-slate-200 shadow-lg z-50">
                                        <button
                                            onClick={handleDashboard}
                                            className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 border-b border-slate-100 flex items-center gap-2"
                                        >
                                            Dashboard
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="inline-flex rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:bg-slate-800"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main>
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0  bg-cover bg-center" />
                    <div className="absolute inset-0 bg-white/40" />
                    <div className="absolute inset-0">
                        <div className="absolute -left-32 top-12 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
                        <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
                        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
                    </div>

                    <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
                        <div className="max-w-3xl">

                            <h1 className="mt-6 text-5xl font-black leading-[1.02] tracking-tight text-slate-950 md:text-6xl">
                                Run HR operations with a cleaner system, not a patchwork of tools.
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                                HRFlow helps teams manage employee records, attendance, payroll, recruitment, and performance from a single structured workspace designed for daily operations.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link
                                    to={userName ? "/dashboard" : "/login"}
                                    className="inline-flex rounded-2xl bg-linear-to-r from-sky-600 to-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/30"
                                >
                                    {userName ? "Go to Dashboard" : "Open Platform"}
                                </Link>
                                <Link
                                    to="/careers"
                                    className="inline-flex rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:text-slate-950"
                                >
                                    Explore Careers
                                </Link>
                            </div>

                            <div className="mt-10 grid gap-3 sm:grid-cols-3">
                                {metrics.map((item) => (
                                    <div key={item.label} className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur-sm">
                                        <p className="text-2xl font-black text-slate-950">{item.value}</p>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className=" border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl rounded-2xl shadow-slate-900/15">
                                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">Operations Snapshot</p>
                                        <h2 className="mt-2 text-2xl font-black">Built for structured HR work</h2>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-bold text-white">Workforce Overview</p>
                                                <p className="mt-1 text-sm text-slate-300">Employee records, attendance, payroll and reviews connected in one system.</p>
                                            </div>
                                            <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">
                                                Centralized
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-linear-to-br from-sky-500 to-blue-700 p-5 shadow-lg shadow-blue-900/20">
                                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">Attendance</p>
                                            <p className="mt-3 text-3xl font-black">Real-time</p>
                                            <p className="mt-2 text-sm text-blue-50/90">Track status, hours, and daily workforce presence cleanly.</p>
                                        </div>
                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-300">Payroll</p>
                                            <p className="mt-3 text-3xl font-black">Month-End Ready</p>
                                            <p className="mt-2 text-sm text-slate-300">Salary records and payout visibility without spreadsheet drift.</p>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-300">Included capabilities</p>
                                        <div className="mt-4 space-y-3">
                                            {highlights.map((item) => (
                                                <div key={item} className="flex items-start gap-3">
                                                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                                                    <p className="text-sm leading-6 text-slate-200">{item}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-14">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-sm font-bold uppercase tracking-[0.26em] text-sky-700">Core Modules</p>
                            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">A more credible front door for your HR product</h2>
                        </div>
                        <p className="max-w-2xl text-base leading-7 text-slate-600">
                            The landing experience now reflects a business platform instead of a placeholder page, with stronger hierarchy, trust signals, and clearer user paths.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        {featureCards.map((card) => (
                            <article key={card.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                                    {card.title.slice(0, 2).toUpperCase()}
                                </div>
                                <h3 className="mt-5 text-xl font-black text-slate-950">{card.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="operations" className="mx-auto max-w-7xl px-6 py-6 lg:px-8 lg:py-14">
                    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                        <div className="rounded-4xl bg-[#0f172a] p-8 text-white shadow-xl shadow-slate-900/10">
                            <p className="text-sm font-bold uppercase tracking-[0.26em] text-cyan-300">Why It Feels Better</p>
                            <h2 className="mt-4 text-3xl font-black tracking-tight">Professional structure matters on first impression.</h2>
                            <p className="mt-4 text-base leading-8 text-slate-300">
                                A public homepage should reassure visitors that the platform is real, organized, and ready for daily operations. The new layout does that with a clear header, focused content blocks, and a footer that closes the page properly.
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-400">Navigation</p>
                                <h3 className="mt-3 text-xl font-black text-slate-950">Header with clear actions</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">Visitors can move to careers, contact, or sign-in paths without guessing where to go.</p>
                            </div>
                            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-400">Hierarchy</p>
                                <h3 className="mt-3 text-xl font-black text-slate-950">Sharper information flow</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">The page now reads like a product site: promise first, proof second, calls to action throughout.</p>
                            </div>
                            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-400">Presentation</p>
                                <h3 className="mt-3 text-xl font-black text-slate-950">Less generic visual language</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">The new gradients, card shapes, spacing, and contrast feel more intentional and more product-ready.</p>
                            </div>
                            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-400">Trust</p>
                                <h3 className="mt-3 text-xl font-black text-slate-950">Footer and contact framing</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">A structured footer makes the page feel complete instead of abruptly ending after a few cards.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-16">
                    <div className="overflow-hidden rounded-4xl bg-linear-to-r from-sky-600 via-blue-700 to-slate-900 bg-cover bg-center p-8 text-black shadow-2xl shadow-blue-900/15 lg:p-10">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="max-w-2xl">
                                <p className="text-sm font-bold uppercase tracking-[0.26em] text-white">Get Started</p>
                                <h2 className="mt-3 text-3xl text-white tracking-tight">Use the platform that keeps HR operations readable and controlled.</h2>
                                <p className="mt-4 text-base leading-8 text-white">
                                    Sign in to continue to the operational workspace or review active openings from the careers page.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link
                                    to="/login"
                                    className="inline-flex rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-slate-100"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/careers"
                                    className="inline-flex rounded-2xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/15"
                                >
                                    View Careers
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer id="footer" className="border-t border-slate-200 bg-white/90">
                <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr_0.9fr] lg:px-8">
                    <div>
                        <div className="flex items-center gap-3">
                            <img
                                src="/sportyfi.png"
                                alt="HRFlow"
                                className=" w-32 object-cover shadow-sm"
                            />
                        </div>
                        <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
                            Professional HR management for attendance, payroll, performance, and workforce operations in one connected platform.
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.22em] text-slate-500">Quick Links</p>
                        <div className="mt-4 flex flex-col gap-3 text-sm font-medium text-slate-600">
                            <Link to="/" className="transition-colors hover:text-slate-950">Home</Link>
                            <Link to="/careers" className="transition-colors hover:text-slate-950">Careers</Link>
                            <Link to="/login" className="transition-colors hover:text-slate-950">Sign In</Link>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.22em] text-slate-500">Contact</p>
                        <div className="mt-4 space-y-3 text-sm text-slate-600">
                            <p>
                                <Link
                                    to="mailto:briskodetechnology@gmail.com"
                                    className="transition-colors hover:text-slate-950"
                                >
                                    briskodetechnology@gmail.com
                                </Link>
                            </p>
                            <p>
                                <Link
                                    to="tel:+919078534843"
                                    className="transition-colors hover:text-slate-950"
                                >
                                    +91 9078534843
                                </Link>
                            </p>
                            <p>Workforce operations and internal HR management</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200/80 px-6 py-4 text-center lg:px-8">
                    <Link
                        to="https://briskodetechnology.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-slate-600"
                    >
                        Designed By Briskode Technology Pvt. Ltd.
                    </Link>
                </div>
            </footer>
        </div>
    );
}
