import React from 'react';
import { Card, CardContent } from '../components/common';

export default function Compliance() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-industrial-700 pb-4">
        <h2 className="text-xl font-medium text-industrial-100">Compliance & Audit</h2>
        <p className="text-industrial-400 mt-1 text-sm">Regulatory checklists and audit logs.</p>
      </div>
      
      <Card>
        <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
          <p className="text-industrial-400 mb-2">Compliance module is under construction.</p>
          <p className="text-sm text-industrial-500">This view will prioritize dense, verifiable audit checklists and completion logs.</p>
        </CardContent>
      </Card>
    </div>
  );
}
