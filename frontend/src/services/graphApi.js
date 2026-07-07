import apiClient from './apiClient';

/**
 * Retrieves graph data from the API.
 * 
 * The response should ideally contain data structures that are easily mappable 
 * to the `nodes` and `edges` format expected by React Flow.
 * 
 * @param {Object} [params={}] - Optional query parameters (e.g., filtering by depth, specific types).
 * @param {Object} [options={}] - Additional Axios configuration options.
 * @returns {Promise} The response from the server.
 */
export const getGraphData = async (params = {}, options = {}) => {
  return apiClient.get('/graph', {
    ...options,
    params: {
      ...options.params,
      ...params,
    },
  });
};

/**
 * Retrieves localized graph data specifically centered around a particular document or node.
 * 
 * @param {string|number} documentId - The ID of the document to use as the center/root of the graph.
 * @param {Object} [params={}] - Optional query parameters.
 * @param {Object} [options={}] - Additional Axios configuration options.
 * @returns {Promise} The response from the server.
 */
export const getGraphDataByDocument = async (documentId, params = {}, options = {}) => {
  return apiClient.get(`/graph/${documentId}`, {
    ...options,
    params: {
      ...options.params,
      ...params,
    },
  });
};
