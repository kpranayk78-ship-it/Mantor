import React from 'react';
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
}