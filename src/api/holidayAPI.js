// client/src/api/holidayAPI.js

import API from "./axios";

/**
 * Get all approved holidays
 * @param {Object} filters - Filter options (year, type)
 * @returns {Promise}
 */
export const getAllHolidays = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.year) params.append("year", filters.year);
    if (filters.type) params.append("type", filters.type);

    const response = await API.get(`/holidays?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get calendar holidays for a specific month
 * @param {number} year
 * @param {number} month - 1-12
 * @returns {Promise}
 */
export const getCalendarHolidays = async (year, month) => {
  try {
    const response = await API.get(`/holidays/calendar?year=${year}&month=${month}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get holidays by date range
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD
 * @returns {Promise}
 */
export const getHolidaysByDateRange = async (startDate, endDate) => {
  try {
    const response = await API.get(
      `/holidays/range?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get a specific holiday by ID
 * @param {string} holidayId
 * @returns {Promise}
 */
export const getHolidayById = async (holidayId) => {
  try {
    const response = await API.get(`/holidays/${holidayId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Create a new holiday (Admin only)
 * @param {Object} holidayData
 * @returns {Promise}
 */
export const createHoliday = async (holidayData) => {
  try {
    const response = await API.post("/holidays", holidayData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update a holiday (Admin only)
 * @param {string} holidayId
 * @param {Object} updateData
 * @returns {Promise}
 */
export const updateHoliday = async (holidayId, updateData) => {
  try {
    const response = await API.put(`/holidays/${holidayId}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Delete a holiday (Admin only)
 * @param {string} holidayId
 * @returns {Promise}
 */
export const deleteHoliday = async (holidayId) => {
  try {
    const response = await API.delete(`/holidays/${holidayId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Toggle holiday approval (Admin only)
 * @param {string} holidayId
 * @param {boolean} isApproved
 * @returns {Promise}
 */
export const toggleHolidayApproval = async (holidayId, isApproved) => {
  try {
    const response = await API.patch(`/holidays/${holidayId}/approve`, {
      isApproved,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  getAllHolidays,
  getCalendarHolidays,
  getHolidaysByDateRange,
  getHolidayById,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  toggleHolidayApproval,
};
