import api, { delay } from './api';
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
};