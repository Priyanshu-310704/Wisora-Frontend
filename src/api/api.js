import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ───────────────────────────────────────────
export const registerUser = (username, email, password) =>
  API.post('/auth/register', { username, email, password });

export const loginUser = (email, password) =>
  API.post('/auth/login', { email, password });

export const getMe = () =>
  API.get('/auth/me');

// ─── Users ──────────────────────────────────────────
export const getUserProfile = (userId) =>
  API.get(`/users/${userId}`);

export const updateUserProfile = (userId, data) =>
  API.put(`/users/${userId}`, data);

export const toggleFollow = (targetUserId) =>
  API.post(`/users/follow/${targetUserId}`);

// ─── Questions ──────────────────────────────────────
export const createQuestion = (title, body, topics) =>
  API.post('/questions', { title, body, topics });

export const getQuestions = (page = 1) =>
  API.get(`/questions?page=${page}`);

export const getQuestionById = (id) =>
  API.get(`/questions/${id}`);

export const searchQuestions = (text = '', tag = '') =>
  API.get('/questions/search', { params: { text, tag } });

export const getUserQuestions = (userId) =>
  API.get(`/questions/user/${userId}`);

// ─── Answers ────────────────────────────────────────
export const postAnswer = (questionId, text) =>
  API.post(`/answers/${questionId}`, { text });

export const getAnswersByQuestion = (questionId) =>
  API.get(`/answers/question/${questionId}`);

export const editAnswer = (answerId, text) =>
  API.put(`/answers/${answerId}`, { text });

export const deleteAnswer = (answerId) =>
  API.delete(`/answers/${answerId}`);

// ─── Comments ───────────────────────────────────────
export const commentOnAnswer = (answerId, text) =>
  API.post(`/comments/answer/${answerId}`, { text });

export const replyToComment = (commentId, text) =>
  API.post(`/comments/comment/${commentId}`, { text });

export const getCommentsByParent = (parentId) =>
  API.get(`/comments/${parentId}`);

// ─── Likes ──────────────────────────────────────────
export const toggleLike = (targetId, targetType) =>
  API.post('/likes/toggle', { targetId, targetType });

export const getLikeInfo = (targetId, targetType) =>
  API.get(`/likes/${targetId}`, { params: { targetType } });

// ─── Topics ─────────────────────────────────────────
export const getTopics = () =>
  API.get('/topics');

export const createTopic = (name) =>
  API.post('/topics', { name });

export default API;
