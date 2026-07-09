import apiClient from "./apiClient";

export const uploadFile = async (file, onProgress) => {
  console.log("uploadFile() entered");

  const formData = new FormData();
  formData.append("file", file);

  console.log("Making axios request...");

  const response = await apiClient.post("/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: onProgress,
  });

  console.log("Response received:", response);

  return response;
};