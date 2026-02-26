import apiService from './apiService';

const BASE_URL = '/api/leaves';

export const leaveService = {
  /**
   * Get all leaves or filtered by criteria
   * @param {Object} filters - Optional filters like employeeId, status, etc.
   * @returns {Promise} - Promise with leave data
   */
  getLeaves: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      return await apiService.get(`${BASE_URL}${queryString}`);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      return { success: false, message: error.message || 'Failed to fetch leaves' };
    }
  },
  
  /**
   * Get a single leave by ID
   * @param {String} id - Leave ID
   * @returns {Promise} - Promise with leave data
   */
  getLeaveById: async (id) => {
    try {
      return await apiService.get(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error fetching leave ${id}:`, error);
      return { success: false, message: error.message || 'Failed to fetch leave' };
    }
  },
  
  /**
   * Create a new leave request
   * @param {Object} leaveData - Leave request data
   * @returns {Promise} - Promise with created leave data
   */
  createLeave: async (leaveData) => {
    try {
      return await apiService.post(BASE_URL, leaveData);
    } catch (error) {
      console.error('Error creating leave:', error);
      return { success: false, message: error.message || 'Failed to create leave' };
    }
  },
  
  /**
   * Update a leave record
   * @param {String} id - Leave ID
   * @param {Object} leaveData - Updated leave data
   * @returns {Promise} - Promise with updated leave data
   */
  updateLeave: async (id, leaveData) => {
    try {
      return await apiService.put(`${BASE_URL}/${id}`, leaveData);
    } catch (error) {
      console.error(`Error updating leave ${id}:`, error);
      return { success: false, message: error.message || 'Failed to update leave' };
    }
  },
  
  /**
   * Update leave status
   * @param {String} id - Leave ID
   * @param {String} status - New status ('pending', 'approved', 'rejected')
   * @returns {Promise} - Promise with updated leave data
   */
  updateLeaveStatus: async (id, status) => {
    try {
      return await apiService.patch(`${BASE_URL}/${id}/status`, { status });
    } catch (error) {
      console.error(`Error updating leave status for ${id}:`, error);
      return { success: false, message: error.message || 'Failed to update leave status' };
    }
  },
  
  /**
   * Delete a leave record
   * @param {String} id - Leave ID
   * @returns {Promise} - Promise with success status
   */
  deleteLeave: async (id) => {
    try {
      return await apiService.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting leave ${id}:`, error);
      return { success: false, message: error.message || 'Failed to delete leave' };
    }
  }
};

export default leaveService; 