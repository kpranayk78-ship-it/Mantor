import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '../components/common';
import { useToast } from '../context/ToastContext';
import { FaUserPlus } from 'react-icons/fa';

export default function Signup() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); toast.success("Clearance requested. Awaiting administrator approval."); navigate('/login'); }, 1500);
  };
  
  return (
    <div className="flex items-center justify-center flex-1 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center pb-6 pt-8 border-b border-industrial-700">
          <div className="mx-auto w-10 h-10 bg-industrial-800 border border-industrial-700 text-industrial-300 rounded-md flex items-center justify-center mb-4">
            <FaUserPlus size={16} />
          </div>
          <CardTitle className="text-xl font-medium text-industrial-100 tracking-tight">Request Clearance</CardTitle>
          <p className="mt-2 text-sm text-industrial-400">Submit details for administrator review.</p>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input label="Operator Name" type="text" required placeholder="Full Name" />
              <Input label="Clearance ID (Email)" type="email" required placeholder="operator@industrial.net" />
              <Input label="Access Key (Password)" type="password" required placeholder="••••••••" />
            </div>
            <div className="pt-2">
              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>Submit Request</Button>
            </div>
            <p className="text-center text-xs text-industrial-500 pt-2 border-t border-industrial-700 mt-6">
              Already have clearance? <Link to="/login" className="font-medium text-industrial-300 hover:text-industrial-100 transition-colors">Authenticate</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}