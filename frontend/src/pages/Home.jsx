import React from 'react';
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
}