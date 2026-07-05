import api, { delay } from './api';
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
};