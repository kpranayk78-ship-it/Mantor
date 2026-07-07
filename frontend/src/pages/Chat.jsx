import React, { useState, useRef, useEffect } from 'react';
import { Avatar, Input, Button, Spinner } from '../components/common';
import { FaPaperPlane, FaMicrophone } from 'react-icons/fa';

const initialMessages = [
  { id: 1, sender: 'ai', text: 'Hello. I am the industrial operations assistant. How can I help you today?' },
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
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto bg-industrial-900 border border-industrial-700 rounded-lg overflow-hidden shadow-sm">
      <div className="bg-industrial-800 border-b border-industrial-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar size="sm" fallbackInitials="AI" status="online" />
          <div>
            <h2 className="font-medium text-industrial-100 text-sm">Copilot Assistant</h2>
            <p className="text-xs text-industrial-400">Online</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-industrial-400 hover:text-industrial-100">Clear History</Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth bg-industrial-900/50">
        {messages.map(msg => {
          const isAi = msg.sender === 'ai';
          return (
            <div key={msg.id} className={`flex gap-4 ${!isAi ? 'flex-row-reverse' : ''}`}>
              <Avatar size="sm" fallbackInitials={isAi ? 'AI' : 'JD'} />
              <div className={`p-4 rounded-lg max-w-[85%] md:max-w-[75%] ${isAi ? 'bg-industrial-800 border border-industrial-700 text-industrial-100 rounded-tl-none' : 'bg-industrial-200 text-industrial-900 rounded-tr-none'}`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex gap-4">
            <Avatar size="sm" fallbackInitials="AI" />
            <div className="p-4 rounded-lg bg-industrial-800 border border-industrial-700 rounded-tl-none flex items-center gap-2 text-industrial-400">
              <Spinner size="sm" />
              <span className="text-sm">Analyzing documentation...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      
      <form onSubmit={handleSend} className="bg-industrial-800 border-t border-industrial-700 p-3 md:p-4 flex gap-2">
        <Button type="button" variant="ghost" className="p-2.5 text-industrial-400 hover:text-industrial-100"><FaMicrophone size={18} /></Button>
        <Input className="flex-1" placeholder="Message the assistant..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} autoComplete="off" />
        <Button type="submit" variant="primary" className="px-6" disabled={isTyping || !inputValue.trim()}>
          <span className="hidden md:inline">Send</span>
          <FaPaperPlane className="md:ml-2" size={14} />
        </Button>
      </form>
    </div>
  );
}