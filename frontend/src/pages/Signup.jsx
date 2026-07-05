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
      <Card className="max-w-md w-full bg-industrial-900/80 backdrop-blur-md">
        <CardHeader className="text-center pb-2 border-none pt-8">
          <div className="mx-auto w-12 h-12 bg-ai-core/10 text-ai-core rounded-full flex items-center justify-center mb-4"><FaUserPlus size={24} /></div>
          <CardTitle className="text-2xl font-bold">Request Access</CardTitle>
          <p className="mt-2 text-sm text-industrial-400">Already have clearance? <Link to="/login" className="font-medium text-ai-core hover:text-ai-glow transition-colors">Authenticate here</Link></p>
        </CardHeader>
        <CardContent>
          <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input label="Operator Name" type="text" required placeholder="Full Name" />
              <Input label="Clearance Code (Email)" type="email" required placeholder="operator@industrial.net" />
              <Input label="Access Key (Password)" type="password" required placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>Submit Request</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}