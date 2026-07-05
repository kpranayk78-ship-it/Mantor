import api, { delay } from './api';
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
    if (!MOCK_MODE) return api.get(`/chat/session/${sessionId}`);
    await delay(500);
    return { data: [
      { id: 1, sender: 'ai', text: 'Terminal access granted. I am the Industrial Knowledge Engine. How can I assist with your operations today?' },
      { id: 2, sender: 'user', text: 'What is the standard operating pressure for Reactor B?' },
      { id: 3, sender: 'ai', text: 'According to the safety manual updated last month, the standard operating pressure for Reactor B should be maintained between 45.2 and 48.5 PSI.' },
    ] };
  }
};