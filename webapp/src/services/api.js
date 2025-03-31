import axios from 'axios';

// Create axios instance with base URL from environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const getSubscriptionPlans = async () => {
  try {
    const response = await api.get('/plans');
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    throw error;
  }
};

export const createInvoice = async (planId, userId) => {
  try {
    const response = await api.post('/create_invoice', {
      plan_id: planId,
      user_id: userId,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

export const getSubscriptionStatus = async (userId) => {
  try {
    const response = await api.get(`/subscription_status?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    throw error;
  }
};

// Create an API object before exporting as default
const apiService = {
  getSubscriptionPlans,
  createInvoice,
  getSubscriptionStatus,
};

export default apiService; 