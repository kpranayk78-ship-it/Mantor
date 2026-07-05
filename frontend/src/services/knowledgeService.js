import api, { delay } from './api';
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
    if (!MOCK_MODE) return api.delete(`/knowledge/documents/${id}`);
    await delay(600);
    return { data: { success: true } };
  }
};