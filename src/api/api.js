import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── User Actions ───────────────────────────────────
export const registerUser = (username, email) =>
  API.post('/users', { username, email });

export const getUserProfile = (userId) =>
  API.get(`/users/${userId}`);

export const updateUserProfile = (userId, data) =>
  API.put(`/users/${userId}`, data);

// ─── Question Management ────────────────────────────
export const createQuestion = (userId, title, body, topicTags) =>
  API.post('/questions', { userId, title, body, topicTags });

export const searchQuestions = (text = '', tag = '') =>
  API.get('/questions/search', { params: { text, tag } });

// ─── Answer Management ─────────────────────────────
export const postAnswer = (questionId, userId, text) =>
  API.post(`/questions/${questionId}/answers`, { userId, text });

export const editAnswer = (answerId, text) =>
  API.put(`/answers/${answerId}`, { text });

// ─── Comment Management ─────────────────────────────
export const commentOnAnswer = (answerId, userId, text) =>
  API.post(`/answers/${answerId}/comments`, { userId, text });

export const replyToComment = (commentId, userId, text) =>
  API.post(`/comments/${commentId}/comments`, { userId, text });

// ─── Like Management ────────────────────────────────
export const likeEntity = (type, id, userId) =>
  API.post(`/${type}/${id}/likes`, { userId });

// ─── Follow Management ─────────────────────────────
export const followUser = (userId, targetUserId) =>
  API.post(`/users/${userId}/follow/${targetUserId}`);

// ─── Topic Management ──────────────────────────────
export const getTopics = () =>
  API.get('/topics');

export const createTopic = (name) =>
  API.post('/topics', { name });

export default API;
