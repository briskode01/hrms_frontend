// @ts-nocheck
// client/src/components/attendance/TimingsCard.jsx

import { useMemo } from "react";
import { FaRegClock } from "react-icons/fa";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const SHIFT_START = "9:30 AM";
const SHIFT_END = "7:00 PM";
const SHIFT_TOTAL_MINUTES = 9 * 60 + 30;

const parseTimeOnDate = (dateValue, timeValue) => {
    if (!timeValue) return null;

    const date = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(date.getTime())) return null;

    const value = String(timeValue).trim();
    const twelveHour = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (twelveHour) {
        let hour = Number(twelveHour[1]);
        const minute = Number(twelveHour[2]);
        const meridian = twelveHour[3].toUpperCase();

        if (meridian === "PM" && hour !== 12) hour += 12;
        if (meridian === "AM" && hour === 12) hour = 0;

        date.setHours(hour, minute, 0, 0);
        return date;
    }

    const twentyFourHour = value.match(/^(\d{1,2}):(\d{2})$/);
    if (twentyFourHour) {
        date.setHours(Number(twentyFourHour[1]), Number(twentyFourHour[2]), 0, 0);
        return date;
    }

    return null;
};

const formatMinutes = (minutes) => {
    const safeMinutes = Math.max(0, Math.round(minutes));
    const hours = Math.floor(safeMinutes / 60);
    const mins = safeMinutes % 60;
    return `${hours}h ${mins}m`;
};

const getDayIndex = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return new Date().getDay();
    return date.getDay();
};

export default function TimingsCard({ selectedDate, records = [] }) {
    const dayIndex = getDayIndex(selectedDate);
    const mondayFirstIndex = dayIndex === 0 ? 6 : dayIndex - 1;

    const timingStats = useMemo(() => {
        const workingRecords = (records || []).filter((record) =>
            ["Present", "Late", "Half Day"].includes(record?.status)
        );

        const checkIns = workingRecords
            .map((record) => parseTimeOnDate(selectedDate, record?.checkIn))
            .filter(Boolean)
            .sort((a, b) => a - b);

        const checkOuts = workingRecords
            .map((record) => parseTimeOnDate(selectedDate, record?.checkOut))
            .filter(Boolean)
            .sort((a, b) => a - b);

        const earliestCheckIn = checkIns[0] || null;
        const latestCheckOut = checkOuts[checkOuts.length - 1] || null;

        const durations = workingRecords
            .map((record) => {
                const checkIn = parseTimeOnDate(selectedDate, record?.checkIn);
                const checkOut = parseTimeOnDate(selectedDate, record?.checkOut);
                if (!checkIn || !checkOut) return null;
                const mins = Math.round((checkOut - checkIn) / 60000);
                return mins > 0 ? mins : null;
            })
            .filter(Boolean);

        const avgDurationMins = durations.length
            ? durations.reduce((sum, mins) => sum + mins, 0) / durations.length
            : 0;

        const shiftStartDate = parseTimeOnDate(selectedDate, SHIFT_START);
        const totalLateMinutes = workingRecords
            .filter((record) => record?.status === "Late")
            .reduce((sum, record) => {
                const checkIn = parseTimeOnDate(selectedDate, record?.checkIn);
                if (!checkIn || !shiftStartDate || checkIn <= shiftStartDate) return sum;
                return sum + Math.round((checkIn - shiftStartDate) / 60000);
            }, 0);

        const progress = Math.min(100, Math.max(0, Math.round((avgDurationMins / SHIFT_TOTAL_MINUTES) * 100)));

        return {
            earliestCheckIn: earliestCheckIn
                ? earliestCheckIn.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
                : SHIFT_START,
            latestCheckOut: latestCheckOut
                ? latestCheckOut.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
                : SHIFT_END,
            durationLabel: formatMinutes(avgDurationMins || SHIFT_TOTAL_MINUTES),
            lateMinutes: totalLateMinutes,
            progress,
            hasWorkingData: workingRecords.length > 0,
        };
    }, [records, selectedDate]);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <h3 className="text-lg font-extrabold text-slate-700 mb-4">Timings</h3>

            <div className="flex items-center gap-2 mb-10">
                {DAYS.map((day, index) => {
                    const active = index === mondayFirstIndex;
                    return (
                        <div
                            key={`${day}-${index}`}
                            className={`w-7 h-7 rounded-full border text-xs font-bold flex items-center justify-center ${
                                active
                                    ? "bg-cyan-400 border-cyan-400 text-white"
                                    : "bg-white border-slate-200 text-slate-400"
                            }`}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>

            <p className="text-sm font-bold text-slate-600">
                Today ({timingStats.earliestCheckIn} - {timingStats.latestCheckOut})
            </p>

            <div className="mt-2 h-3 rounded-full bg-cyan-100 overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${timingStats.progress}%` }} />
            </div>

            <div className="mt-2 flex items-center justify-between text-sm text-slate-400 font-semibold">
                <span>Duration: {timingStats.durationLabel}</span>
                <span className="inline-flex items-center gap-1"><FaRegClock /> {timingStats.lateMinutes} min</span>
            </div>

            {!timingStats.hasWorkingData && (
                <p className="mt-2 text-xs text-slate-400">No present/late attendance records for selected date.</p>
            )}
        </div>
    );
}
