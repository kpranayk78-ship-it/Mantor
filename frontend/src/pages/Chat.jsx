import React, { useState, useRef, useEffect } from 'react';
import { Avatar, Input, Button, Spinner } from '../components/common';
import { FaPaperPlane, FaMicrophone } from 'react-icons/fa';
const initialMessages = [
  { id: 1, sender: 'ai', text: 'Terminal access granted. I am the Industrial Knowledge Engine. How can I assist with your operations today?' },
  { id: 2, sender: 'user', text: 'What is the standard operating pressure for Reactor B?' },
  { id: 3, sender: 'ai', text: 'According to the safety manual updated last month, the standard operating pressure for Reactor B should be maintained between **45.2 and 48.5 PSI**.\n\nIf it exceeds 50 PSI, emergency venting protocols must be initiated immediately.' },
];
export default function Chat() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: inputValue }]);
    setInputValue('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: 'Analyzing query... I have cross-referenced your input with the live sensor data. Please ensure you are wearing Class 3 PPE before proceeding to that sector.' }]);
    }, 1500);
  };
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto">
      <div className="bg-industrial-800 border-b border-industrial-700 p-4 rounded-t-xl flex justify-between items-center"><div className="flex items-center gap-3"><Avatar size="sm" fallbackInitials="AI" status="online" className="ring-2 ring-ai-core" /><div><h2 className="font-semibold text-white leading-tight">Engine Core Alpha</h2><p className="text-xs text-ai-success">Online • Ready</p></div></div><Button variant="ghost" size="sm">Clear History</Button></div>
      <div className="flex-1 bg-industrial-900/50 border-x border-industrial-700 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.map(msg => {
          const isAi = msg.sender === 'ai';
          return (
            <div key={msg.id} className={`flex gap-4 ${!isAi ? 'flex-row-reverse' : ''}`}><Avatar size="sm" fallbackInitials={isAi ? 'AI' : 'JD'} className={!isAi ? 'border-industrial-600' : 'border-ai-core'} /><div className={`p-4 rounded-xl max-w-[85%] md:max-w-[75%] shadow-sm ${isAi ? 'bg-industrial-800 border border-industrial-700 text-industrial-100 rounded-tl-none' : 'bg-ai-core text-white rounded-tr-none'}`}><p className="whitespace-pre-wrap">{msg.text}</p></div></div>
          );
        })}
        {isTyping && (<div className="flex gap-4"><Avatar size="sm" fallbackInitials="AI" className="border-ai-core" /><div className="p-4 rounded-xl bg-industrial-800 border border-industrial-700 rounded-tl-none flex items-center gap-2 text-industrial-400"><Spinner size="sm" /><span className="text-sm italic">Analyzing knowledge base...</span></div></div>)}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="bg-industrial-800 border border-industrial-700 p-3 rounded-b-xl flex gap-2"><Button type="button" variant="ghost" className="p-3"><FaMicrophone /></Button><Input className="flex-1 bg-industrial-900 border-none" placeholder="Ask the AI Engine..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} autoComplete="off" /><Button type="submit" variant="primary" className="px-6" disabled={isTyping || !inputValue.trim()}><FaPaperPlane className="md:mr-2" /><span className="hidden md:inline">Transmit</span></Button></form>
    </div>
  );
}