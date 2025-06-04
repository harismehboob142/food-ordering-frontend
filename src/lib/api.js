// This file contains utility functions for API calls

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
};

// User API calls
export const userAPI = {
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

// Restaurant API calls
export const restaurantAPI = {
  getAllRestaurants: async () => {
    const response = await api.get('/restaurants');
    return response.data;
  },
  getRestaurantById: async (id) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  },
  createRestaurant: async (restaurantData) => {
    const response = await api.post('/restaurants', restaurantData);
    return response.data;
  },
  updateRestaurant: async (id, restaurantData) => {
    const response = await api.put(`/restaurants/${id}`, restaurantData);
    return response.data;
  },
  deleteRestaurant: async (id) => {
    const response = await api.delete(`/restaurants/${id}`);
    return response.data;
  },
};

// Food Item API calls
export const foodItemAPI = {
  getAllFoodItems: async () => {
    const response = await api.get('/fooditems');
    return response.data;
  },
  getFoodItemById: async (id) => {
    const response = await api.get(`/fooditems/${id}`);
    return response.data;
  },
  createFoodItem: async (foodItemData) => {
    const response = await api.post('/fooditems', foodItemData);
    return response.data;
  },
  updateFoodItem: async (id, foodItemData) => {
    const response = await api.put(`/fooditems/${id}`, foodItemData);
    return response.data;
  },
  deleteFoodItem: async (id) => {
    const response = await api.delete(`/fooditems/${id}`);
    return response.data;
  },
};

// Order API calls
export const orderAPI = {
  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  cancelOrder: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },
  updatePaymentMethod: async (id, paymentMethod) => {
    const response = await api.put(`/orders/${id}/payment`, { paymentMethod });
    return response.data;
  },
};

export default api;
