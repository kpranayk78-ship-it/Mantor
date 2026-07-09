import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt, FaFileAlt, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../components/common';
import { useToast } from '../context/ToastContext';
import { uploadFile } from '../services/uploadApi';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const fileInputRef = useRef(null);
  const toast = useToast();
  const navigate = useNavigate();

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setUploadResult(null);
      setProgress(0);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadResult(null);
      setProgress(0);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current && !isUploading) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
  console.log("=== handleUpload started ===");

  if (!file) {
    console.log("No file selected");
    return;
  }

  console.log("Selected file:", file);

  setIsUploading(true);

  try {
    console.log("About to call uploadFile()");

    const response = await uploadFile(file);

    console.log("Upload success:", response);

  } catch (err) {
    console.error("Upload error:", err);
  } finally {
    console.log("Finished");
    setIsUploading(false);
  }
};

  const resetUpload = () => {
    setFile(null);
    setUploadResult(null);
    setProgress(0);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-industrial-700 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-medium text-industrial-100 tracking-tight">Upload Document</h2>
          <p className="text-industrial-400 mt-1 text-sm">Upload manuals, schematics, and logs for indexing.</p>
        </div>
        <Button variant="ghost" onClick={() => navigate('/knowledge')}>Back to Knowledge</Button>
      </div>

      <Card>
        <CardContent className="p-8">
          {!uploadResult ? (
            <div className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center transition-colors ${isDragActive
                  ? 'border-ai-core bg-industrial-800/80'
                  : 'border-industrial-700 hover:border-industrial-500 bg-industrial-900'
                  } ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />

                <FaCloudUploadAlt className="text-industrial-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-industrial-100 mb-2">
                  {isDragActive ? "Drop file here" : "Click or drag file to upload"}
                </h3>
                <p className="text-sm text-industrial-400 max-w-sm">
                  Supported formats: PDF, DOCX, XLSX, TXT. Maximum file size: 50MB.
                </p>
              </div>

              {file && (
                <div className="bg-industrial-800 border border-industrial-700 rounded-md p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FaFileAlt className="text-industrial-400 flex-shrink-0" size={20} />
                    <div className="truncate">
                      <p className="text-sm font-medium text-industrial-100 truncate">{file.name}</p>
                      <p className="text-xs text-industrial-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  {!isUploading && (
                    <Button variant="ghost" size="sm" onClick={resetUpload} className="text-industrial-400 hover:text-industrial-100">
                      Remove
                    </Button>
                  )}
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-industrial-400">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-industrial-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-ai-core h-1.5 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-industrial-700">
                <Button
                  variant="primary"
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="min-w-[120px]"
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                      <FaSpinner className="animate-spin" /> Uploading
                    </span>
                  ) : (
                    "Upload File"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <FaCheckCircle className="text-ai-success mb-4" size={48} />
                <h3 className="text-xl font-medium text-industrial-100 mb-2">Upload Complete</h3>
                <p className="text-industrial-400 text-sm max-w-md">
                  The document has been securely stored and queued for processing.
                </p>
              </div>

              <div className="bg-industrial-900 border border-industrial-700 rounded-md overflow-hidden">
                <div className="px-4 py-3 bg-industrial-800 border-b border-industrial-700">
                  <h4 className="text-sm font-medium text-industrial-100">Document Metadata</h4>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-xs text-industrial-500 uppercase tracking-wider mb-1">Original Filename</p>
                    <p className="text-sm text-industrial-100 font-medium">{uploadResult.original_filename}</p>
                  </div>
                  <div>
                    <p className="text-xs text-industrial-500 uppercase tracking-wider mb-1">Document ID</p>
                    <p className="text-sm text-industrial-100 font-mono">{uploadResult.document_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-industrial-500 uppercase tracking-wider mb-1">Stored Filename</p>
                    <p className="text-sm text-industrial-100 font-mono text-industrial-400">{uploadResult.stored_filename}</p>
                  </div>
                  <div>
                    <p className="text-xs text-industrial-500 uppercase tracking-wider mb-1">Storage Path</p>
                    <p className="text-sm text-industrial-100 font-mono text-industrial-400 break-all">{uploadResult.file_path}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <Button variant="secondary" onClick={resetUpload}>Upload Another File</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
