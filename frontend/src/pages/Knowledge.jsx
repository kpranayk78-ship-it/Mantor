import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import { useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Button, Dropdown, StatusBadge, ProcessingTimeline, Modal, SearchBar, Spinner, Alert } from '../components/common';
import { FaFilePdf, FaDownload, FaShareAlt, FaPlus, FaEllipsisV, FaFileAlt, FaInbox } from 'react-icons/fa';

const DocumentTable = ({ documents }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-industrial-700 rounded-lg">
        <FaInbox className="text-industrial-600 mb-4" size={48} />
        <h3 className="text-lg font-medium text-industrial-100">No documents found</h3>
        <p className="text-industrial-400 mt-1 max-w-sm">There are no documents matching your search criteria, or your knowledge base is currently empty.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Filename</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Upload Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => {
              const dropdownItems = [
                { label: 'View Status', icon: <FaFileAlt />, onClick: () => setSelectedDoc(doc) },
                { label: 'Download', icon: <FaDownload /> }, 
                { label: 'Share', icon: <FaShareAlt /> }
              ];
              // Temporary mock values
              const mockStatus = ['Uploaded', 'Parsing', 'Parsed', 'Chunked', 'Embedded', 'Indexed', 'Failed'][doc.document_id % 7] || 'Uploaded';
              const mockTime = 'Just now';

              return (
                <TableRow key={doc.document_id} className="group hover:bg-industrial-800/50 transition-colors">
                  <TableCell className="font-medium cursor-pointer" onClick={() => setSelectedDoc(doc)}>
                    <div className="flex items-center gap-3">
                      <FaFilePdf className="text-industrial-400 group-hover:text-industrial-100 transition-colors" size={16} />
                      <span className="truncate">{doc.original_filename}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={mockStatus} />
                  </TableCell>

                  <TableCell className="text-industrial-400 whitespace-nowrap">
                    {mockTime}
                  </TableCell>

                  <TableCell className="text-right">
                    <Dropdown
                      items={dropdownItems}
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-md text-industrial-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaEllipsisV />
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {selectedDoc && (
        <Modal 
          isOpen={!!selectedDoc} 
          onClose={() => setSelectedDoc(null)} 
          title="Document Processing Status"
          description={`Pipeline progress for ${selectedDoc.original_filename}`}
        >
          <ProcessingTimeline 
            currentStatus={['Uploaded', 'Parsing', 'Parsed', 'Chunked', 'Embedded', 'Indexed', 'Failed'][selectedDoc.document_id % 7] || 'Uploaded'} 
            isFailed={(['Uploaded', 'Parsing', 'Parsed', 'Chunked', 'Embedded', 'Indexed', 'Failed'][selectedDoc.document_id % 7] || 'Uploaded') === 'Failed'}
          />
        </Modal>
      )}
    </>
  );
};

export default function Knowledge() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    apiClient
      .get('/documents/')
      .then((res) => {
        setDocuments(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load documents. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredDocuments = documents.filter(doc => 
    doc.original_filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-medium text-industrial-100 tracking-tight">Knowledge Base</h2>
          <p className="text-industrial-400 mt-1 text-sm">Access and manage all industrial documentation.</p>
        </div>
        <Button variant="primary" icon={<FaPlus />} onClick={() => navigate('/upload')}>
          Upload Document
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-full sm:w-96">
          <SearchBar 
            placeholder="Search by filename..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Spinner size="lg" className="mb-4" />
            <p className="text-industrial-400">Loading documents...</p>
          </div>
        ) : error ? (
          <Alert variant="error" title="Error Loading Documents">
            {error}
          </Alert>
        ) : (
          <DocumentTable documents={filteredDocuments} />
        )}
      </div>
    </div>
  );
}