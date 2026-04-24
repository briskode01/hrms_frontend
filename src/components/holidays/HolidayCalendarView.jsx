import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCalendarHolidays } from "../../api/holidayAPI";
import { getHolidaysForDate } from "../../utils/dateUtils";
import HolidayDetailsSidebar from "./HolidayDetailsSidebar";

const HolidayCalendarView = ({ onSelectHoliday, onNavigateToForm }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateHolidays, setDateHolidays] = useState([]);

  // Fetch holidays for current month
  useEffect(() => {
    fetchHolidays();
  }, [currentDate]);

  // Make sure to recalculate selected date holidays when the holidays array changes
  useEffect(() => {
    if (selectedDate) {
        setDateHolidays(getHolidaysForDate(selectedDate.getDate(), selectedDate, holidays));
    }
  }, [holidays, selectedDate]);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const response = await getCalendarHolidays(year, month);
      setHolidays(response.data || []);
    } catch (error) {
      console.error("Fetch calendar holidays error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
    setDateHolidays([]);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
    setDateHolidays([]);
  };

  const handleDateClick = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
  };

  const monthYear = currentDate.toLocaleString("default", { month: "long", year: "numeric" });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  
  const days = Array.from({ length: firstDay }, () => null).concat(
      Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  return (
    <div className="w-full bg-transparent flex flex-col lg:flex-row">
      <div className="flex-1 p-6 sm:p-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-slate-800">{monthYear}</h2>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full p-1 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-full transition-all"
              title="Previous month"
            >
              <ChevronLeft size={20} className="stroke-[3]" />
            </button>
            <div className="w-[1px] h-4 bg-slate-300"></div>
            <button
              onClick={handleNextMonth}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-full transition-all"
              title="Next month"
            >
              <ChevronRight size={20} className="stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-bold text-slate-400 text-xs sm:text-sm uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {days.map((day, idx) => {
            const holidaysOnDay = day ? getHolidaysForDate(day, currentDate, holidays) : [];
            const isSelected = selectedDate && day === selectedDate.getDate();
            const hasHoliday = holidaysOnDay.length > 0;
            const today = new Date();
            const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
            
            // Primary holiday color if exists
            const dominantHolidayColor = hasHoliday ? (holidaysOnDay[0].color || "#6366f1") : null;

            return (
              <div
                key={idx}
                onClick={() => day && handleDateClick(day)}
                className={`
                  relative aspect-square flex flex-col rounded-2xl font-bold cursor-pointer transition-all duration-300 border-2
                  ${!day ? "bg-transparent border-transparent cursor-default pointer-events-none" : ""}
                  ${day && !isSelected && !hasHoliday ? "bg-slate-50 border-transparent hover:border-indigo-200 hover:bg-indigo-50/50 text-slate-700" : ""}
                  ${day && isSelected ? "border-indigo-500 shadow-md shadow-indigo-200 bg-white z-10 scale-105" : ""}
                  ${day && hasHoliday && !isSelected ? "bg-white border-transparent hover:scale-105 shadow-sm" : ""}
                `}
                style={day && hasHoliday && !isSelected ? { borderBottomColor: dominantHolidayColor, borderBottomWidth: '4px' } : {}}
              >
                {day && (
                  <>
                    <div className={`p-2 sm:p-3 flex items-start justify-between w-full h-full`}>
                       <span className={`text-sm sm:text-base ${isToday ? 'bg-indigo-600 text-white rounded-full w-7 h-7 flex items-center justify-center -ml-1 -mt-1' : ''}`}>
                          {day}
                       </span>
                    </div>
                    {/* Event indicators dot summary */}
                    {hasHoliday && (
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                            {holidaysOnDay.slice(0, 3).map((h, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full shadow-sm" style={{ backgroundColor: h.color || "#6366f1" }}></div>
                            ))}
                        </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
        </div>
      </div>

      <HolidayDetailsSidebar 
        selectedDate={selectedDate}
        dateHolidays={dateHolidays}
        onSelectHoliday={onSelectHoliday}
        onNavigateToForm={onNavigateToForm}
      />
    </div>
  );
};

export default HolidayCalendarView;
