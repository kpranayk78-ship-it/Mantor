import apiClient from './apiClient';

/**
 * Uploads a file to the server.
 * 
 * @param {File} file - The file to upload.
 * @param {Function} onProgress - Optional callback function to track upload progress. 
 *                                It will receive the Axios ProgressEvent.
 * @returns {Promise} The response from the server.
 */
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  
  // The 'file' key here must match what your backend expects for the file field.
  formData.append('file', file);

  const config = {
    headers: {
      // Override the application/json default set in the apiClient
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        onProgress(progressEvent);
      }
    },
  };

  // The response interceptor in apiClient will unwrap or return the response based on its configuration
  return apiClient.post('/upload', formData, config);
};
