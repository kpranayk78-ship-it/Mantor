import apiClient from './apiClient';

/**
 * Retrieves a list of documents from the API.
 * 
 * @param {Object} [params={}] - Optional query parameters for the request.
 *                               This object is designed to easily accept pagination, 
 *                               filtering, and sorting keys in the future 
 *                               (e.g., { page: 1, limit: 10, search: 'invoice' }).
 * @param {Object} [options={}] - Additional Axios configuration options.
 * @returns {Promise} The response from the server containing the documents.
 */
export const getDocuments = async (params = {}, options = {}) => {
  return apiClient.get('/documents', {
    ...options,
    // Axios will automatically serialize the `params` object into URL query string parameters.
    params: {
      ...options.params,
      ...params,
    },
  });
};

/**
 * Retrieves a single document by its ID.
 * 
 * @param {string|number} id - The ID of the document to retrieve.
 * @param {Object} [options={}] - Additional Axios configuration options.
 * @returns {Promise} The response from the server.
 */
export const getDocumentById = async (id, options = {}) => {
  return apiClient.get(`/documents/${id}`, options);
};
