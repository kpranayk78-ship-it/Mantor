import React from 'react';
import { Tabs, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Button, Dropdown, Badge } from '../components/common';
import { FaFilePdf, FaFileWord, FaFileExcel, FaDownload, FaShareAlt, FaPlus, FaEllipsisV } from 'react-icons/fa';

const mockDocs = [
  { id: 1, title: 'Safety Protocols 2026', type: 'PDF', category: 'Manuals', date: '2 days ago', size: '2.4 MB', icon: FaFilePdf },
  { id: 2, title: 'Turbine X9 Maintenance', type: 'DOCX', category: 'Manuals', date: '1 week ago', size: '1.1 MB', icon: FaFileWord },
  { id: 3, title: 'Q1 Incident Reports', type: 'XLSX', category: 'Logs', date: '1 month ago', size: '4.8 MB', icon: FaFileExcel },
  { id: 4, title: 'Sector 4 Network Schema', type: 'PDF', category: 'Schematics', date: '3 months ago', size: '12.5 MB', icon: FaFilePdf },
];

const DocumentTable = ({ documents }) => {
  const dropdownItems = [{ label: 'Download', icon: <FaDownload /> }, { label: 'Share', icon: <FaShareAlt /> }];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Document Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Modified</TableHead>
          <TableHead>Size</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => {
          const Icon = doc.icon;
          return (
            <TableRow key={doc.id} className="group">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Icon className="text-industrial-400 group-hover:text-industrial-100 transition-colors" size={16} />
                  <span>{doc.title}</span>
                </div>
              </TableCell>
              <TableCell><Badge variant="neutral">{doc.type}</Badge></TableCell>
              <TableCell><Badge variant="info">{doc.category}</Badge></TableCell>
              <TableCell className="text-industrial-400">{doc.date}</TableCell>
              <TableCell className="text-industrial-400">{doc.size}</TableCell>
              <TableCell className="text-right">
                <Dropdown items={dropdownItems} trigger={<Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-md text-industrial-400 opacity-0 group-hover:opacity-100 transition-opacity"><FaEllipsisV /></Button>} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default function Knowledge() {
  const tabsData = [
    { id: 'all', label: 'All Documents', content: <DocumentTable documents={mockDocs} /> },
    { id: 'manuals', label: 'Manuals', content: <DocumentTable documents={mockDocs.filter(d => d.category === 'Manuals')} /> },
    { id: 'schematics', label: 'Schematics', content: <DocumentTable documents={mockDocs.filter(d => d.category === 'Schematics')} /> },
    { id: 'logs', label: 'Incident Logs', content: <DocumentTable documents={mockDocs.filter(d => d.category === 'Logs')} /> },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-medium text-industrial-100 tracking-tight">Knowledge Base</h2>
          <p className="text-industrial-400 mt-1 text-sm">Access and manage all industrial documentation.</p>
        </div>
        <Button variant="primary" icon={<FaPlus />}>Upload Document</Button>
      </div>
      <Tabs items={tabsData} />
    </div>
  );
}