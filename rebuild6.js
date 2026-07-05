const fs = require('fs');
const path = require('path');

const files = {
  'src/services/api.js': `import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1', timeout: 10000, headers: { 'Content-Type': 'application/json' } });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
}, (error) => Promise.reject(error));
api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) console.warn('Unauthorized request intercepted.');
  return Promise.reject(error);
});
export const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));
export default api;`,
  'src/services/authService.js': `import api, { delay } from './api';
const MOCK_MODE = true;
export const authService = {
  login: async (credentials) => {
    if (!MOCK_MODE) return api.post('/auth/login', credentials);
    await delay(1000);
    const mockUser = { id: 'OP-8924', name: 'John Doe', email: credentials.email, role: 'Senior Plant Operator', clearance: 'Tier 4' };
    localStorage.setItem('auth_token', 'mock_jwt_token_12345');
    return { data: { user: mockUser, token: 'mock_jwt_token_12345' } };
  },
  signup: async (userData) => {
    if (!MOCK_MODE) return api.post('/auth/register', userData);
    await delay(1500);
    return { data: { message: 'Clearance requested successfully.' } };
  },
  logout: async () => {
    if (!MOCK_MODE) return api.post('/auth/logout');
    await delay(500);
    localStorage.removeItem('auth_token');
    return { data: { message: 'Logged out' } };
  },
  getProfile: async () => {
    if (!MOCK_MODE) return api.get('/auth/me');
    await delay(800);
    return { data: { id: 'OP-8924', name: 'John Doe', email: 'jdoe@industrial-corp.com', department: 'Reactor Maintenance', clearance: 'Tier 4' } };
  }
};`,
  'src/services/searchService.js': `import api, { delay } from './api';
const MOCK_MODE = true;
const mockSearchResults = [
  { id: 1, title: 'Turbine X9 Pressure Anomaly Resolution Guide', type: 'Manual', match: '98%', snippet: '...when pressure exceeds 45 PSI, immediate calibration of the secondary valve is required to prevent...' },
  { id: 2, title: 'Q3 Conveyor Belt Maintenance Schedule', type: 'Spreadsheet', match: '85%', snippet: '...scheduled downtime for sectors 4 through 7 will occur on the third weekend of...' },
  { id: 3, title: 'Emergency Shut-off Protocol V2.1', type: 'PDF', match: '72%', snippet: '...in the event of catastrophic cooling failure, engage the manual override located at...' },
];
export const searchService = {
  search: async (query, page = 1, filters = {}) => {
    if (!MOCK_MODE) return api.get('/search', { params: { q: query, page, ...filters } });
    await delay(600);
    if (!query) return { data: { results: [], total: 0, page } };
    return { data: { results: mockSearchResults, total: 32, page, processingTimeMs: 142 } };
  },
  getTrendingTopics: async () => {
    if (!MOCK_MODE) return api.get('/search/trending');
    await delay(300);
    return { data: ['Reactor limits', 'Cooling fail-safes', 'Belt tension'] };
  }
};`,
  'src/services/chatService.js': `import api, { delay } from './api';
const MOCK_MODE = true;
export const chatService = {
  sendMessage: async (messageText, sessionId = null) => {
    if (!MOCK_MODE) return api.post('/chat/message', { text: messageText, sessionId });
    await delay(1500);
    const mockResponses = [
      "Analyzing query... I have cross-referenced your input with the live sensor data. Please ensure you are wearing Class 3 PPE before proceeding to that sector.",
      "Based on the historical maintenance logs, this issue typically arises from a faulty gasket in valve section C.",
      "I cannot authorize that action without managerial override. Please contact your shift supervisor."
    ];
    return { data: { id: Date.now(), sender: 'ai', text: mockResponses[Math.floor(Math.random() * mockResponses.length)], timestamp: new Date().toISOString() } };
  },
  getChatHistory: async (sessionId) => {
    if (!MOCK_MODE) return api.get(\`/chat/session/\${sessionId}\`);
    await delay(500);
    return { data: [
      { id: 1, sender: 'ai', text: 'Terminal access granted. I am the Industrial Knowledge Engine. How can I assist with your operations today?' },
      { id: 2, sender: 'user', text: 'What is the standard operating pressure for Reactor B?' },
      { id: 3, sender: 'ai', text: 'According to the safety manual updated last month, the standard operating pressure for Reactor B should be maintained between 45.2 and 48.5 PSI.' },
    ] };
  }
};`,
  'src/services/knowledgeService.js': `import api, { delay } from './api';
const MOCK_MODE = true;
const mockDocuments = [
  { id: 1, title: 'Safety Protocols 2026', type: 'PDF', category: 'Manuals', date: '2 days ago', size: '2.4 MB' },
  { id: 2, title: 'Turbine X9 Maintenance', type: 'DOCX', category: 'Manuals', date: '1 week ago', size: '1.1 MB' },
  { id: 3, title: 'Q1 Incident Reports', type: 'XLSX', category: 'Logs', date: '1 month ago', size: '4.8 MB' },
  { id: 4, title: 'Sector 4 Network Schema', type: 'PDF', category: 'Schematics', date: '3 months ago', size: '12.5 MB' },
];
export const knowledgeService = {
  getDocuments: async (category = 'all') => {
    if (!MOCK_MODE) return api.get('/knowledge/documents', { params: { category } });
    await delay(800);
    return { data: category === 'all' ? mockDocuments : mockDocuments.filter(doc => doc.category.toLowerCase() === category.toLowerCase()) };
  },
  uploadDocument: async (file, metadata) => {
    if (!MOCK_MODE) {
      const formData = new FormData(); formData.append('file', file); formData.append('metadata', JSON.stringify(metadata));
      return api.post('/knowledge/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    await delay(2000);
    return { data: { message: 'Document uploaded successfully', id: Date.now() } };
  },
  deleteDocument: async (id) => {
    if (!MOCK_MODE) return api.delete(\`/knowledge/documents/\${id}\`);
    await delay(600);
    return { data: { success: true } };
  }
};`,
  'src/pages/NotFound.jsx': `import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common';
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-8xl font-black text-industrial-800 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-2">Sector Not Found</h2>
      <p className="text-industrial-400 max-w-md mx-auto mb-8">The requested module or database index does not exist. Please verify your clearance and try again.</p>
      <Link to="/"><Button variant="primary">Return to Base</Button></Link>
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
