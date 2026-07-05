const fs = require('fs');
const path = require('path');

const files = {
  'src/pages/Home.jsx': `import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent } from '../components/common';
import { FaDatabase, FaSearch, FaRobot } from 'react-icons/fa';
export default function Home() {
  const features = [
    { icon: FaRobot, title: 'AI Assistant', desc: 'Real-time contextual assistance for all facility operations and protocols.' },
    { icon: FaSearch, title: 'Semantic Search', desc: 'Instantly query decades of maintenance logs, manuals, and schematics.' },
    { icon: FaDatabase, title: 'Knowledge Graph', desc: 'Interconnected data points visualizing component dependencies.' },
  ];
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="text-center max-w-4xl mx-auto space-y-6 mb-16">
        <div className="inline-block px-4 py-1.5 rounded-full bg-ai-core/10 border border-ai-core/20 text-ai-core text-sm font-medium mb-4">System v2.4.0 Online</div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">The Future of <br className="hidden md:block"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-ai-core to-ai-accent text-glow">Industrial Knowledge</span></h1>
        <p className="text-industrial-300 text-lg md:text-xl max-w-2xl mx-auto">Empower your workforce with AI-driven insights, semantic search, and an intelligent chat assistant trained on your secure industrial data.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link to="/login"><Button size="lg" className="w-full sm:w-auto px-8">Access Platform</Button></Link>
          <Link to="/dashboard"><Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">View Demo</Button></Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {features.map((feat, idx) => (
          <Card key={idx} className="bg-industrial-900/50 hover:border-ai-core/50 transition-colors">
            <CardContent className="p-6 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-industrial-800 flex items-center justify-center text-ai-core mb-4 shadow-glow-blue"><feat.icon size={24} /></div>
              <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-industrial-400 text-sm leading-relaxed">{feat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}`,
  'src/pages/Login.jsx': `import React, { useState } from 'react';
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
}`,
  'src/pages/Signup.jsx': `import React, { useState } from 'react';
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
}`
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.join(__dirname, 'frontend', filepath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created:', filepath);
});
