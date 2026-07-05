import React, { useState } from 'react';
import { SearchBar, Card, CardContent, Badge, Pagination, Button, Dropdown } from '../components/common';
import { FaFilePdf, FaFileExcel, FaBookOpen, FaDownload, FaShareAlt } from 'react-icons/fa';
const mockResults = [
  { id: 1, title: 'Turbine X9 Pressure Anomaly Resolution Guide', type: 'Manual', match: '98%', icon: FaBookOpen, snippet: '...when pressure exceeds 45 PSI, immediate calibration of the secondary valve is required to prevent...' },
  { id: 2, title: 'Q3 Conveyor Belt Maintenance Schedule', type: 'Spreadsheet', match: '85%', icon: FaFileExcel, snippet: '...scheduled downtime for sectors 4 through 7 will occur on the third weekend of...' },
  { id: 3, title: 'Emergency Shut-off Protocol V2.1', type: 'PDF', match: '72%', icon: FaFilePdf, snippet: '...in the event of catastrophic cooling failure, engage the manual override located at...' },
];
export default function Search() {
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownItems = [{ label: 'View Document', icon: <FaBookOpen /> }, { label: 'Download PDF', icon: <FaDownload /> }, { label: 'Share Link', icon: <FaShareAlt /> }];
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4 py-8"><h2 className="text-3xl font-bold text-white">Semantic Knowledge Search</h2><p className="text-industrial-400">Search across millions of industrial manuals, logs, and blueprints.</p><div className="flex justify-center mt-6"><SearchBar className="max-w-2xl w-full" placeholder="E.g., How to resolve Turbine X9 pressure anomaly..." /></div><div className="flex items-center justify-center gap-2 mt-4 flex-wrap"><span className="text-sm text-industrial-500">Trending:</span><Badge variant="neutral" className="cursor-pointer hover:bg-industrial-600">Reactor limits</Badge><Badge variant="neutral" className="cursor-pointer hover:bg-industrial-600">Cooling fail-safes</Badge><Badge variant="neutral" className="cursor-pointer hover:bg-industrial-600">Belt tension</Badge></div></div>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm text-industrial-400 border-b border-industrial-700 pb-2"><span>Found 32 results (0.14 seconds)</span><span>Sort by: <strong className="text-white cursor-pointer hover:text-ai-core">Relevance</strong></span></div>
        {mockResults.map(result => {
          const Icon = result.icon;
          return (
            <Card key={result.id} className="hover:border-ai-core/50 transition-colors group"><CardContent className="p-5 flex gap-4"><div className="w-12 h-12 rounded bg-industrial-900 border border-industrial-700 flex items-center justify-center flex-shrink-0 text-industrial-300 group-hover:text-ai-core group-hover:border-ai-core/50 transition-colors"><Icon size={24} /></div><div className="flex-1 min-w-0"><div className="flex justify-between items-start mb-1"><h3 className="text-lg font-semibold text-white group-hover:text-ai-core transition-colors cursor-pointer truncate">{result.title}</h3><Dropdown items={dropdownItems} trigger={<Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">•••</Button>} /></div><div className="flex gap-2 mb-2"><Badge variant="info">{result.type}</Badge><Badge variant="success">{result.match} Match</Badge></div><p className="text-sm text-industrial-400 line-clamp-2">{result.snippet}</p></div></CardContent></Card>
          );
        })}
      </div>
      <div className="flex justify-center pt-6"><Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} /></div>
    </div>
  );
}