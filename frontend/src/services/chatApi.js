import apiClient from './apiClient';

/**
 * Sends a message to the chat API.
 * 
 * @param {Object} payload - The payload for the chat message.
 *                           Typically includes { message: string, history: array, etc. }.
 * @param {Object} [options] - Additional Axios configuration options (e.g., abort signal).
 * @returns {Promise} The response from the server.
 */
export const sendMessage = async (payload, options = {}) => {
  return apiClient.post('/chat', payload, options);
};

/**
 * Sends a message to the chat API with streaming support.
 * 
 * Note: While Axios can track download progress via `onDownloadProgress`, handling true 
 * Server-Sent Events (SSE) or chunked streams for AI text generation is often handled
 * better with native `fetch` or the EventSource API. 
 * 
 * This implementation provides a foundation using Axios. If the backend streams a 
 * chunked HTTP response, `progressEvent.event.target.responseText` will contain the 
 * accumulated text thus far.
 * 
 * @param {Object} payload - The payload for the chat message.
 * @param {Function} onChunkReceived - Callback that is fired when a chunk of data is received.
 * @param {Object} [options] - Additional Axios configuration options.
 * @returns {Promise} The final response from the server.
 */
export const sendMessageStream = async (payload, onChunkReceived, options = {}) => {
  return apiClient.post('/chat', payload, {
    ...options,
    // By providing this configuration, you can hook into the stream of data 
    // as it arrives from the server.
    onDownloadProgress: (progressEvent) => {
      if (onChunkReceived && progressEvent.event.target) {
        // Contains the accumulated text stream
        const accumulatedResponse = progressEvent.event.target.responseText;
        onChunkReceived(accumulatedResponse);
      }
    },
  });
};
