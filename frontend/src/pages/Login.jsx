import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '../components/common';
import { useToast } from '../context/ToastContext';
import { FaTerminal } from 'react-icons/fa';
export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); toast.success("Authentication successful. Welcome."); navigate('/dashboard'); }, 1200);
  };
  return (
    <div className="flex items-center justify-center flex-1 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full bg-industrial-900/80 backdrop-blur-md">
        <CardHeader className="text-center pb-2 border-none pt-8">
          <div className="mx-auto w-12 h-12 bg-ai-core/10 text-ai-core rounded-full flex items-center justify-center mb-4"><FaTerminal size={24} /></div>
          <CardTitle className="text-2xl font-bold">Secure Terminal Access</CardTitle>
          <p className="mt-2 text-sm text-industrial-400">Or <Link to="/signup" className="font-medium text-ai-core hover:text-ai-glow transition-colors">request clearance for a new account</Link></p>
        </CardHeader>
        <CardContent>
          <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input label="Clearance Code (Email)" id="email-address" type="email" required placeholder="operator@industrial.net" />
              <Input label="Access Key (Password)" id="password" type="password" required placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>Authenticate</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}