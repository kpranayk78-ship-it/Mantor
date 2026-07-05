import React from 'react';
import { Tabs, Card, CardContent, Button, Dropdown, Badge } from '../components/common';
import { FaFilePdf, FaFileWord, FaFileExcel, FaDownload, FaShareAlt, FaPlus, FaEllipsisV } from 'react-icons/fa';
const mockDocs = [
  { id: 1, title: 'Safety Protocols 2026', type: 'PDF', category: 'Manuals', date: '2 days ago', size: '2.4 MB', icon: FaFilePdf },
  { id: 2, title: 'Turbine X9 Maintenance', type: 'DOCX', category: 'Manuals', date: '1 week ago', size: '1.1 MB', icon: FaFileWord },
  { id: 3, title: 'Q1 Incident Reports', type: 'XLSX', category: 'Logs', date: '1 month ago', size: '4.8 MB', icon: FaFileExcel },
  { id: 4, title: 'Sector 4 Network Schema', type: 'PDF', category: 'Schematics', date: '3 months ago', size: '12.5 MB', icon: FaFilePdf },
];
const DocumentGrid = ({ documents }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {documents.map((doc) => {
      const Icon = doc.icon;
      return (
        <Card key={doc.id} className="hover:border-ai-core/50 transition-all hover:shadow-glow-blue group"><CardContent className="p-5 flex flex-col h-full"><div className="flex justify-between items-start mb-4"><div className="w-12 h-12 rounded bg-industrial-900 border border-industrial-700 flex items-center justify-center text-ai-core"><Icon size={24} /></div><Dropdown trigger={<button className="text-industrial-400 hover:text-white p-1 rounded transition-colors"><FaEllipsisV /></button>} items={[{ label: 'Download', icon: <FaDownload /> }, { label: 'Share', icon: <FaShareAlt /> }]} /></div><h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-ai-core transition-colors">{doc.title}</h3><div className="mt-auto pt-4 space-y-2"><div className="flex justify-between text-xs text-industrial-400"><span>{doc.date}</span><span>{doc.size}</span></div><div className="flex gap-2"><Badge variant="neutral">{doc.type}</Badge><Badge variant="info">{doc.category}</Badge></div></div></CardContent></Card>
      );
    })}
  </div>
);
export default function Knowledge() {
  const tabsData = [
    { id: 'all', label: 'All Documents', content: <DocumentGrid documents={mockDocs} /> },
    { id: 'manuals', label: 'Manuals', content: <DocumentGrid documents={mockDocs.filter(d => d.category === 'Manuals')} /> },
    { id: 'schematics', label: 'Schematics', content: <DocumentGrid documents={mockDocs.filter(d => d.category === 'Schematics')} /> },
    { id: 'logs', label: 'Incident Logs', content: <DocumentGrid documents={mockDocs.filter(d => d.category === 'Logs')} /> },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div><h2 className="heading-2 text-white">Knowledge Base</h2><p className="text-industrial-400 mt-1">Access and manage all industrial documentation.</p></div><Button variant="primary" icon={<FaPlus />}>Upload Document</Button></div>
      <Tabs items={tabsData} />
    </div>
  );
}