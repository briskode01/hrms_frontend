// client/src/components/dashboard/WelcomeBanner.jsx
// ─────────────────────────────────────────────────────────────

import { useAuth } from "../../context/AuthContext";

export default function WelcomeBanner() {
    const { user } = useAuth();

    return (
        <div
            className="min-h-28 sm:min-h-28 p-6 text-white shadow-xl shadow-slate-300/30 relative overflow-hidden bg-cover bg-center flex items-center"
            style={{ backgroundImage: "url('https://img.freepik.com/free-vector/office-interior-open-space-flat-design-vector-illustration-businessmen-talking-modern-meeting-room-conference-hall_126523-3102.jpg?semt=ais_hybrid&w=740&q=80')" }}
        >
            <div className="absolute inset-0" />
            <div className="absolute inset-0 " />

            <div className="relative z-10 text-left">
                <h2 className="text-2xl font-bold text-black">
                    Welcome back, {user?.name?.split(" ")[0]}!
                </h2>
            </div>
        </div>
    );
}
