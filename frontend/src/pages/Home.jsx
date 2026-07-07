import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="text-center max-w-3xl mx-auto space-y-8">
        <div>
          <div className="inline-block px-3 py-1 rounded-sm bg-industrial-800 border border-industrial-700 text-industrial-400 text-xs font-medium uppercase tracking-wider mb-6">
            Internal Systems Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-industrial-100 leading-tight">
            Industrial Knowledge Platform
          </h1>
          <p className="mt-4 text-industrial-400 text-lg max-w-xl mx-auto leading-relaxed">
            Access secure facility operations, standard operating procedures, and maintenance logs. Authorized personnel only.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 border-t border-industrial-800">
          <Link to="/login" className="w-full sm:w-auto">
            <Button size="lg" className="w-full">Authenticate via SSO</Button>
          </Link>
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full">Guest Access</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}