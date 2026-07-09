import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common';
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-8xl font-black text-industrial-800 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-industrial-50 mb-2">Sector Not Found</h2>
      <p className="text-industrial-400 max-w-md mx-auto mb-8">The requested module or database index does not exist. Please verify your clearance and try again.</p>
      <Link to="/"><Button variant="primary">Return to Base</Button></Link>
    </div>
  );
}