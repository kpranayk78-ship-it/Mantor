import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '../components/common';
import { useToast } from '../context/ToastContext';
import { FaLock } from 'react-icons/fa';

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); toast.success("Authentication successful."); navigate('/dashboard'); }, 1200);
  };
  
  return (
    <div className="flex items-center justify-center flex-1 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center pb-6 pt-8 border-b border-industrial-700">
          <div className="mx-auto w-10 h-10 bg-industrial-800 border border-industrial-700 text-industrial-300 rounded-md flex items-center justify-center mb-4">
            <FaLock size={16} />
          </div>
          <CardTitle className="text-xl font-medium text-industrial-100 tracking-tight">System Authentication</CardTitle>
          <p className="mt-2 text-sm text-industrial-400">Authorized personnel only.</p>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input label="Clearance ID (Email)" id="email-address" type="email" required placeholder="operator@industrial.net" />
              <Input label="Access Key (Password)" id="password" type="password" required placeholder="••••••••" />
            </div>
            <div className="pt-2">
              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>Authenticate</Button>
            </div>
            <p className="text-center text-xs text-industrial-500 pt-2 border-t border-industrial-700 mt-6">
              Require access? <Link to="/signup" className="font-medium text-industrial-300 hover:text-industrial-100 transition-colors">Request clearance</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}