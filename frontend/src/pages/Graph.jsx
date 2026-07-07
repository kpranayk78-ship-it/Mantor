import React from 'react';
import { Card, CardContent } from '../components/common';

export default function Graph() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-industrial-700 pb-4">
        <h2 className="text-xl font-medium text-industrial-100">Knowledge Graph</h2>
        <p className="text-industrial-400 mt-1 text-sm">Entity relationships and dependencies.</p>
      </div>
      
      <Card>
        <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
          <p className="text-industrial-400 mb-2">Knowledge Graph visualization is under construction.</p>
          <p className="text-sm text-industrial-500">This view will focus on structural relationships and dependency chains rather than visual effects.</p>
        </CardContent>
      </Card>
    </div>
  );
}
