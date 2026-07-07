import React, { useState } from 'react';
import { SearchBar, Badge, Pagination, Button, Dropdown } from '../components/common';
import { FaFilePdf, FaFileExcel, FaBookOpen, FaDownload, FaShareAlt, FaEllipsisV } from 'react-icons/fa';

const mockResults = [
  { id: 1, title: 'Turbine X9 Pressure Anomaly Resolution Guide', type: 'Manual', match: '98%', icon: FaBookOpen, snippet: '...when pressure exceeds 45 PSI, immediate calibration of the secondary valve is required to prevent...' },
  { id: 2, title: 'Q3 Conveyor Belt Maintenance Schedule', type: 'Spreadsheet', match: '85%', icon: FaFileExcel, snippet: '...scheduled downtime for sectors 4 through 7 will occur on the third weekend of...' },
  { id: 3, title: 'Emergency Shut-off Protocol V2.1', type: 'PDF', match: '72%', icon: FaFilePdf, snippet: '...in the event of catastrophic cooling failure, engage the manual override located at...' },
];

export default function Search() {
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownItems = [{ label: 'View Document', icon: <FaBookOpen /> }, { label: 'Download PDF', icon: <FaDownload /> }, { label: 'Share Link', icon: <FaShareAlt /> }];
  
  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-industrial-700">
        <div>
          <h2 className="text-xl font-medium text-industrial-100">Search</h2>
        </div>
        <div className="w-full md:w-96">
          <SearchBar placeholder="Search manuals, logs, blueprints..." />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm text-industrial-400">
          <span>Found 32 results (0.14 seconds)</span>
          <span className="flex items-center gap-2">Sort by: <select className="bg-transparent border-none text-industrial-100 font-medium focus:outline-none"><option>Relevance</option><option>Date</option></select></span>
        </div>
        
        <div className="divide-y divide-industrial-700 border-t border-industrial-700">
          {mockResults.map(result => {
            const Icon = result.icon;
            return (
              <div key={result.id} className="py-5 flex gap-4 group">
                <div className="mt-1 flex-shrink-0 text-industrial-400">
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-medium text-industrial-100 group-hover:text-ai-core transition-colors cursor-pointer truncate">{result.title}</h3>
                    <Dropdown items={dropdownItems} trigger={<Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-md text-industrial-400 opacity-0 group-hover:opacity-100 transition-opacity"><FaEllipsisV /></Button>} />
                  </div>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="neutral">{result.type}</Badge>
                    <Badge variant="success">{result.match} Match</Badge>
                  </div>
                  <p className="text-sm text-industrial-400 leading-relaxed">{result.snippet}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-center pt-4">
        <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}