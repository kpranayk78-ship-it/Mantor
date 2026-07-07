import apiClient from './apiClient';

/**
 * Submits data for compliance checks, processing, or auditing.
 * 
 * @param {Object} payload - The data payload for the compliance operation.
 *                           Typically includes details like { reportType: 'annual', data: {} }.
 * @param {Object} [options={}] - Additional Axios configuration options.
 * @returns {Promise} The response from the server regarding the compliance operation.
 */
export const submitComplianceData = async (payload, options = {}) => {
  return apiClient.post('/compliance', payload, options);
};

/**
 * Retrieves compliance status, logs, or generated reports.
 * 
 * @param {Object} [params={}] - Optional query parameters for filtering (e.g., { year: 2026 }).
 * @param {Object} [options={}] - Additional Axios configuration options.
 * @returns {Promise} The response from the server containing the compliance data.
 */
export const getComplianceStatus = async (params = {}, options = {}) => {
  return apiClient.get('/compliance', {
    ...options,
    params: {
      ...options.params,
      ...params,
    },
  });
};
