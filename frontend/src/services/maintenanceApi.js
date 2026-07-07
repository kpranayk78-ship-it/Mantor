import apiClient from './apiClient';

/**
 * Triggers a maintenance task on the backend.
 * 
 * @param {Object} payload - The data specifying the maintenance operation to perform.
 *                           Typically includes details like { action: 'clear_cache', target: 'all' }.
 * @param {Object} [options={}] - Additional Axios configuration options.
 * @returns {Promise} The response from the server indicating the status of the operation.
 */
export const runMaintenance = async (payload, options = {}) => {
  return apiClient.post('/maintenance', payload, options);
};

/**
 * Retrieves the current maintenance status or logs.
 * 
 * @param {Object} [params={}] - Optional query parameters for filtering the status.
 * @param {Object} [options={}] - Additional Axios configuration options.
 * @returns {Promise} The response from the server containing the maintenance status.
 */
export const getMaintenanceStatus = async (params = {}, options = {}) => {
  return apiClient.get('/maintenance', {
    ...options,
    params: {
      ...options.params,
      ...params,
    },
  });
};
