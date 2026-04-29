/**
 * Frontend date utilities for handling IST timezone properly
 * Prevents date shifting issues when comparing dates
 */

/**
 * Format a Date object to YYYY-MM-DD string (local date)
 * @param {Date} date - Date object
 * @returns {string} Formatted date string (YYYY-MM-DD)
 */
export const formatDateToString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Extract date from ISO string or Date object
 * Handles both ISO strings and Date objects consistently
 * @param {string|Date} dateInput - ISO string or Date object
 * @returns {string} Date in YYYY-MM-DD format
 */
export const extractDate = (dateInput) => {
  if (!dateInput) return null;

  if (typeof dateInput === "string") {
    // If it's already a YYYY-MM-DD format, return as-is
    if (dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateInput;
    }
    // If it's an ISO string, extract the date part
    return dateInput.split("T")[0];
  }

  if (dateInput instanceof Date) {
    return formatDateToString(dateInput);
  }

  return null;
};

/**
 * Compare two dates ignoring time component
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {boolean} True if dates are the same day
 */
export const isSameDay = (date1, date2) => {
  const d1 = extractDate(date1);
  const d2 = extractDate(date2);
  return d1 === d2;
};

/**
 * Get all holidays for a specific date
 * @param {number} day - Calendar day (1-31)
 * @param {Date} currentDate - Current month date reference
 * @param {Array} holidays - Array of holiday objects
 * @returns {Array} Holidays on that date
 */
export const getHolidaysForDate = (day, currentDate, holidays) => {
  const targetDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    day
  );
  const dateStr = formatDateToString(targetDate);

  return holidays.filter((h) => extractDate(h.date) === dateStr);
};

/**
 * Check if date1 is before date2 (ignoring time)
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {boolean}
 */
export const isDateBefore = (date1, date2) => {
  const d1 = new Date(extractDate(date1));
  const d2 = new Date(extractDate(date2));
  return d1 < d2;
};

/**
 * Check if date1 is after date2 (ignoring time)
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {boolean}
 */
export const isDateAfter = (date1, date2) => {
  const d1 = new Date(extractDate(date1));
  const d2 = new Date(extractDate(date2));
  return d1 > d2;
};

/**
 * Check if date is within range (inclusive)
 * @param {Date|string} date - Date to check
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {boolean}
 */
export const isDateInRange = (date, startDate, endDate) => {
  const d = new Date(extractDate(date));
  const s = new Date(extractDate(startDate));
  const e = new Date(extractDate(endDate));
  return d >= s && d <= e;
};
