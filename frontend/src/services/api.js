import axios from 'axios';
import { dashboardStatsData } from '../data/dashboardStats';
import { scanActivityData } from '../data/scanActivity';
import { scamCategoriesData } from '../data/scamCategories';
import { recentScansData } from '../data/recentScans';
import { recentReportsData } from '../data/recentReports';
import { riskDistributionData } from '../data/riskDistribution';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('scam_shield_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const scanText = async (text) => {
  const response = await api.post('/scan/text', { text });
  return response.data;
};

export const scanEmail = async (subject, body, sender) => {
  const response = await api.post('/scan/email', { subject, body, sender });
  return response.data;
};

export const scanUrl = async (url) => {
  const response = await api.post('/scan/url', { url });
  return response.data;
};

export const scanImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/scan/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getScansHistory = async () => {
  try {
    const response = await api.get('/scans');
    return response.data;
  } catch (e) {
    return recentScansData;
  }
};

export const getScanDetails = async (id) => {
  const response = await api.get(`/scans/${id}`);
  return response.data;
};

export const deleteScan = async (id) => {
  const response = await api.delete(`/scans/${id}`);
  return response.data;
};

export const submitReport = async (reportData) => {
  const response = await api.post('/reports', reportData);
  return response.data;
};

export const getReports = async () => {
  try {
    const response = await api.get('/reports');
    return response.data;
  } catch (e) {
    return recentReportsData;
  }
};

export const submitFeedback = async (scanId, userFeedback, comments = '') => {
  const response = await api.post('/feedback', {
    scan_id: scanId,
    user_feedback: userFeedback,
    comments,
  });
  return response.data;
};

// API Service getters with mock fallback for seamless dashboard rendering
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard');
    return response.data;
  } catch (e) {
    return dashboardStatsData;
  }
};

export const getRecentScans = async () => {
  try {
    const response = await api.get('/scans?limit=5');
    return response.data;
  } catch (e) {
    return recentScansData;
  }
};

export const getRecentReports = async () => {
  try {
    const response = await api.get('/reports?limit=4');
    return response.data;
  } catch (e) {
    return recentReportsData;
  }
};

export const getScanActivity = async () => {
  return scanActivityData;
};

export const getScamCategories = async () => {
  return scamCategoriesData;
};

export const getRiskDistribution = async () => {
  return riskDistributionData;
};

export const getEducationData = async () => {
  const response = await api.get('/education');
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  if (response.data.access_token) {
    localStorage.setItem('scam_shield_token', response.data.access_token);
    localStorage.setItem('scam_shield_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.access_token) {
    localStorage.setItem('scam_shield_token', response.data.access_token);
    localStorage.setItem('scam_shield_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('scam_shield_token');
  localStorage.removeItem('scam_shield_user');
};

export default api;
