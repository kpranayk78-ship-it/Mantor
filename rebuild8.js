const fs = require('fs');
const path = require('path');

const files = {
  'src/pages/Dashboard.jsx': `import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Badge } from '../components/common';
import { FaServer, FaNetworkWired, FaDatabase } from 'react-icons/fa';
const recentIncidents = [
  { id: 'INC-2041', title: 'Turbine Pressure Anomaly', time: '10 mins ago', severity: 'error', status: 'Investigating' },
  { id: 'INC-2040', title: 'Network Latency Spike (Sector 4)', time: '1 hour ago', severity: 'warning', status: 'Resolved' },
  { id: 'INC-2039', title: 'Routine Maintenance DB Backup', time: '3 hours ago', severity: 'info', status: 'Completed' },
  { id: 'INC-2038', title: 'Cooling System Re-calibration', time: '5 hours ago', severity: 'success', status: 'Completed' },
];
export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardContent className="p-6 flex items-center justify-between"><div><p className="text-sm font-medium text-industrial-400 uppercase tracking-wider mb-1">System Status</p><h3 className="text-3xl font-bold text-white flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-ai-success animate-pulse"></span>Optimal</h3></div><div className="w-12 h-12 rounded-lg bg-ai-success/10 flex items-center justify-center text-ai-success text-xl"><FaServer /></div></CardContent></Card>
        <Card><CardContent className="p-6 flex items-center justify-between"><div><p className="text-sm font-medium text-industrial-400 uppercase tracking-wider mb-1">Active Nodes</p><h3 className="text-3xl font-bold text-white">1,248</h3></div><div className="w-12 h-12 rounded-lg bg-ai-core/10 flex items-center justify-center text-ai-core text-xl"><FaNetworkWired /></div></CardContent></Card>
        <Card><CardContent className="p-6 flex items-center justify-between"><div><p className="text-sm font-medium text-industrial-400 uppercase tracking-wider mb-1">AI Queries Today</p><div className="flex items-baseline gap-2"><h3 className="text-3xl font-bold text-white">8,432</h3><span className="text-sm text-ai-success font-medium">+14%</span></div></div><div className="w-12 h-12 rounded-lg bg-ai-warning/10 flex items-center justify-center text-ai-warning text-xl"><FaDatabase /></div></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2"><CardHeader><CardTitle>Recent Activity & Incidents</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="w-[100px]">ID</TableHead><TableHead>Event</TableHead><TableHead>Time</TableHead><TableHead className="text-right">Severity</TableHead></TableRow></TableHeader><TableBody>{recentIncidents.map((incident) => (<TableRow key={incident.id}><TableCell className="font-mono text-industrial-400">{incident.id}</TableCell><TableCell className="font-medium">{incident.title}</TableCell><TableCell className="text-industrial-400">{incident.time}</TableCell><TableCell className="text-right"><Badge variant={incident.severity}>{incident.severity.toUpperCase()}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
        <Card><CardHeader><CardTitle>AI Insights</CardTitle></CardHeader><CardContent className="space-y-4"><div className="p-4 bg-industrial-900 rounded-lg border border-industrial-700 relative overflow-hidden group hover:border-ai-core transition-colors cursor-pointer"><div className="absolute top-0 left-0 w-1 h-full bg-ai-warning"></div><h4 className="font-medium text-white mb-1">Maintenance Predicted</h4><p className="text-sm text-industrial-400">Based on vibration patterns, Conveyor C4 will require belt replacement within 72 hours.</p></div><div className="p-4 bg-industrial-900 rounded-lg border border-industrial-700 relative overflow-hidden group hover:border-ai-core transition-colors cursor-pointer"><div className="absolute top-0 left-0 w-1 h-full bg-ai-success"></div><h4 className="font-medium text-white mb-1">Efficiency Optimization</h4><p className="text-sm text-industrial-400">Cooling tower cycle modified. Estimated energy saving: 4.2% daily.</p></div></CardContent></Card>
      </div>
    </div>
  );
}`,
  'src/pages/Search.jsx': `import React, { useState } from 'react';
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
}`,
  'src/pages/Chat.jsx': `import React, { useState, useRef, useEffect } from 'react';
import { Avatar, Input, Button, Spinner } from '../components/common';
import { FaPaperPlane, FaMicrophone } from 'react-icons/fa';
const initialMessages = [
  { id: 1, sender: 'ai', text: 'Terminal access granted. I am the Industrial Knowledge Engine. How can I assist with your operations today?' },
  { id: 2, sender: 'user', text: 'What is the standard operating pressure for Reactor B?' },
  { id: 3, sender: 'ai', text: 'According to the safety manual updated last month, the standard operating pressure for Reactor B should be maintained between **45.2 and 48.5 PSI**.\\n\\nIf it exceeds 50 PSI, emergency venting protocols must be initiated immediately.' },
];
export default function Chat() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: inputValue }]);
    setInputValue('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: 'Analyzing query... I have cross-referenced your input with the live sensor data. Please ensure you are wearing Class 3 PPE before proceeding to that sector.' }]);
    }, 1500);
  };
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto">
      <div className="bg-industrial-800 border-b border-industrial-700 p-4 rounded-t-xl flex justify-between items-center"><div className="flex items-center gap-3"><Avatar size="sm" fallbackInitials="AI" status="online" className="ring-2 ring-ai-core" /><div><h2 className="font-semibold text-white leading-tight">Engine Core Alpha</h2><p className="text-xs text-ai-success">Online • Ready</p></div></div><Button variant="ghost" size="sm">Clear History</Button></div>
      <div className="flex-1 bg-industrial-900/50 border-x border-industrial-700 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.map(msg => {
          const isAi = msg.sender === 'ai';
          return (
            <div key={msg.id} className={\`flex gap-4 \${!isAi ? 'flex-row-reverse' : ''}\`}><Avatar size="sm" fallbackInitials={isAi ? 'AI' : 'JD'} className={!isAi ? 'border-industrial-600' : 'border-ai-core'} /><div className={\`p-4 rounded-xl max-w-[85%] md:max-w-[75%] shadow-sm \${isAi ? 'bg-industrial-800 border border-industrial-700 text-industrial-100 rounded-tl-none' : 'bg-ai-core text-white rounded-tr-none'}\`}><p className="whitespace-pre-wrap">{msg.text}</p></div></div>
          );
        })}
        {isTyping && (<div className="flex gap-4"><Avatar size="sm" fallbackInitials="AI" className="border-ai-core" /><div className="p-4 rounded-xl bg-industrial-800 border border-industrial-700 rounded-tl-none flex items-center gap-2 text-industrial-400"><Spinner size="sm" /><span className="text-sm italic">Analyzing knowledge base...</span></div></div>)}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="bg-industrial-800 border border-industrial-700 p-3 rounded-b-xl flex gap-2"><Button type="button" variant="ghost" className="p-3"><FaMicrophone /></Button><Input className="flex-1 bg-industrial-900 border-none" placeholder="Ask the AI Engine..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} autoComplete="off" /><Button type="submit" variant="primary" className="px-6" disabled={isTyping || !inputValue.trim()}><FaPaperPlane className="md:mr-2" /><span className="hidden md:inline">Transmit</span></Button></form>
    </div>
  );
}`,
  'src/pages/Knowledge.jsx': `import React from 'react';
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
}`,
  'src/pages/Profile.jsx': `import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Avatar, Input, Button, Alert } from '../components/common';
import { useToast } from '../context/ToastContext';
export default function Profile() {
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();
  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); toast.success("Profile preferences saved successfully!"); }, 1000);
  };
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Alert type="warning" title="Security Clearance Renewal Required" message="Your Tier 4 security clearance will expire in 14 days. Please contact the security administrator." dismissible />
      <Card><CardContent className="p-6"><div className="flex flex-col sm:flex-row items-center sm:items-start gap-6"><Avatar size="xl" fallbackInitials="JD" status="online" /><div className="text-center sm:text-left flex-1"><h2 className="text-2xl font-bold text-white mb-1">John Doe</h2><p className="text-ai-core font-medium mb-3">Senior Plant Operator</p><div className="grid grid-cols-2 gap-4 max-w-sm mx-auto sm:mx-0 bg-industrial-900 p-4 rounded-lg border border-industrial-700"><div><p className="text-xs text-industrial-500 uppercase">Clearance</p><p className="font-semibold text-industrial-100">Tier 4</p></div><div><p className="text-xs text-industrial-500 uppercase">ID Number</p><p className="font-semibold text-industrial-100 font-mono">OP-8924</p></div></div></div><Button variant="secondary">Change Avatar</Button></div></CardContent></Card>
      <form onSubmit={handleSave}>
        <Card><CardHeader><CardTitle>Personal Information</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><Input label="Full Name" defaultValue="John Doe" /><Input label="Email Address" type="email" defaultValue="jdoe@industrial-corp.com" readOnly helperText="Email cannot be changed." /><Input label="Department" defaultValue="Reactor Maintenance" readOnly /><Input label="Phone Number" type="tel" defaultValue="+1 (555) 123-4567" /></div></CardContent><CardFooter className="justify-end gap-3 bg-industrial-800/50"><Button type="button" variant="ghost">Cancel</Button><Button type="submit" variant="primary" isLoading={isSaving}>Save Changes</Button></CardFooter></Card>
      </form>
    </div>
  );
}`
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.join(__dirname, 'frontend', filepath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created:', filepath);
});
