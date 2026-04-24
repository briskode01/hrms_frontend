import { useEffect, useState } from "react";

export default function TodayDateCard() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const today = now.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

    return (
        <div className="rounded-xl bg-violet-400 px-4 py-3 text-white shadow-sm">
            <div className="flex items-center justify-between text-white/90">
                <p className="text-sm font-bold">Time Today - {today}</p>
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-wide text-white/80">Current Time</p>
            <p className="mt-1 text-2xl font-bold leading-none text-white">{time}</p>
        </div>
    );
}
