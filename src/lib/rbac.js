// This file contains utility functions for handling role-based and country-based access control

// Check if user has required role
export const hasRole = (user, allowedRoles = ['admin', 'manager', 'member']) => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};

// Check if user has access to a specific country's data
export const hasCountryAccess = (user, country) => {
  if (!user) return false;
  
  // Admin has access to all countries
  if (user.role === 'admin') return true;
  
  // Other roles only have access to their own country
  return user.country === country;
};

// Check if user can perform specific actions
export const canPerformAction = {
  // View restaurants and menu - All roles
  viewRestaurants: (user) => {
    return !!user;
  },
  
  // Create food items - All roles
  createFoodItems: (user) => {
    return !!user;
  },
  
  // Place orders - Admin and Manager only
  placeOrders: (user) => {
    if (!user) return false;
    return user.role === 'admin' || user.role === 'manager';
  },
  
  // Cancel orders - Admin and Manager only
  cancelOrders: (user) => {
    if (!user) return false;
    return user.role === 'admin' || user.role === 'manager';
  },
  
  // Update payment method - Admin only
  updatePayment: (user) => {
    if (!user) return false;
    return user.role === 'admin';
  },
  
  // Manage users - Admin only
  manageUsers: (user) => {
    if (!user) return false;
    return user.role === 'admin';
  },
  
  // Create restaurants - Admin only
  createRestaurants: (user) => {
    if (!user) return false;
    return user.role === 'admin';
  }
};

// Filter data based on user's country access
export const filterByCountry = (user, data) => {
  if (!user || !data) return [];
  
  // Admin can see all data
  if (user.role === 'admin') return data;
  
  // Other roles can only see data from their country
  return data.filter(item => item.country === user.country);
};
