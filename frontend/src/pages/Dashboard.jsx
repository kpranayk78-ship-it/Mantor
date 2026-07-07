import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Badge, Button } from '../components/common';
import { FaFilePdf, FaFileWord, FaCheckSquare, FaExclamationTriangle } from 'react-icons/fa';

const recentIncidents = [
  { id: 'INC-2041', title: 'Turbine Pressure Anomaly', time: '10 mins ago', severity: 'danger', status: 'Investigating' },
  { id: 'INC-2040', title: 'Network Latency Spike (Sector 4)', time: '1 hour ago', severity: 'warning', status: 'Resolved' },
  { id: 'INC-2039', title: 'Routine Maintenance DB Backup', time: '3 hours ago', severity: 'info', status: 'Completed' },
  { id: 'INC-2038', title: 'Cooling System Re-calibration', time: '5 hours ago', severity: 'success', status: 'Completed' },
];

const pendingTasks = [
  { id: 1, title: 'Review Q2 Maintenance Logs', priority: 'High', type: 'Review' },
  { id: 2, title: 'Approve Pipeline C Rerouting', priority: 'Critical', type: 'Approval' },
  { id: 3, title: 'Update Conveyor Belt Tension Specs', priority: 'Normal', type: 'Documentation' },
];

const recentDocs = [
  { id: 1, title: 'Safety Protocols 2026', type: 'PDF', icon: FaFilePdf },
  { id: 2, title: 'Turbine X9 Maintenance', type: 'DOCX', icon: FaFileWord },
  { id: 3, title: 'Sector 4 Network Schema', type: 'PDF', icon: FaFilePdf },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* What changed? */}
      <section className="space-y-4">
        <div className="flex justify-between items-end border-b border-industrial-700 pb-2">
          <h2 className="text-xl font-medium text-industrial-100 tracking-tight">What changed?</h2>
          <Button variant="ghost" size="sm">View All Activity</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentIncidents.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell className="font-mono text-xs text-industrial-400">{incident.id}</TableCell>
                <TableCell className="font-medium">{incident.title}</TableCell>
                <TableCell>
                  <Badge variant={incident.severity}>{incident.status}</Badge>
                </TableCell>
                <TableCell className="text-right text-industrial-400">{incident.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* What needs attention? */}
        <section className="space-y-4">
          <div className="flex justify-between items-end border-b border-industrial-700 pb-2">
            <h2 className="text-xl font-medium text-industrial-100 tracking-tight">What needs attention?</h2>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-industrial-700">
                {pendingTasks.map(task => (
                  <div key={task.id} className="p-4 flex items-start gap-4 hover:bg-industrial-800/50 transition-colors cursor-pointer group">
                    <div className="mt-0.5 text-industrial-400 group-hover:text-ai-core transition-colors">
                      {task.priority === 'Critical' ? <FaExclamationTriangle className="text-ai-danger" /> : <FaCheckSquare />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-industrial-100">{task.title}</h4>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="neutral">{task.type}</Badge>
                        {task.priority === 'Critical' && <Badge variant="danger">Critical</Badge>}
                        {task.priority === 'High' && <Badge variant="warning">High</Badge>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Where should I continue? */}
        <section className="space-y-4">
          <div className="flex justify-between items-end border-b border-industrial-700 pb-2">
            <h2 className="text-xl font-medium text-industrial-100 tracking-tight">Where should I continue?</h2>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-industrial-700">
                {recentDocs.map(doc => {
                  const Icon = doc.icon;
                  return (
                    <div key={doc.id} className="p-4 flex items-center gap-4 hover:bg-industrial-800/50 transition-colors cursor-pointer group">
                      <div className="text-industrial-400 group-hover:text-industrial-100 transition-colors">
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-industrial-100">{doc.title}</h4>
                        <p className="text-xs text-industrial-400 mt-0.5">Last opened 2 hours ago</p>
                      </div>
                      <Button variant="secondary" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">Open</Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}