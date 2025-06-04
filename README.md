# Food Ordering System - User Guide

This document provides a comprehensive guide to using the Food Ordering System application.

## Installation and Usage Locally

> npm i --legacy-peer-deps

> npm run dev

## Overview

The Food Ordering System is a web-based application that allows users to browse restaurants, view menus, create food items, and place orders. The system implements role-based and country-based access control to ensure users can only access data relevant to their role and country.

## User Roles

The system supports three user roles:

1. **Admin** - Full access to all features and data from all countries
2. **Manager** - Can view restaurants/menu, create food items, place/cancel orders (limited to their country)
3. **Team Member** - Can view restaurants/menu and create food items only (limited to their country)

## Getting Started

1. Open your web browser and navigate to the application URL
2. Log in with your credentials on the login page
3. You will be redirected to the dashboard based on your role

## Dashboard

The dashboard provides an overview of the system with statistics relevant to your role and country:

- **Admin**: Shows statistics for all users, restaurants, food items, and orders across all countries
- **Manager**: Shows statistics for restaurants, food items, and orders in your country
- **Team Member**: Shows statistics for restaurants and food items in your country

The dashboard also displays your access permissions based on your role.

## Restaurants

The Restaurants page allows you to:

1. View a list of restaurants (filtered by your country if you're not an admin)
2. Click on a restaurant to view its menu
3. Create new restaurants (admin only)

### Viewing Restaurant Menu

When viewing a restaurant's details, you can:

1. See all food items available at that restaurant
2. Add new food items to the restaurant
3. Edit or delete existing food items
4. Place orders for food items (admin and manager only)

## Food Items

All users can create food items, but they are restricted to restaurants in their country:

1. Navigate to the "Create Food Item" page
2. Fill in the food item details:
   - Name
   - Description
   - Price
   - Select a restaurant (only restaurants from your country will be available)
3. Submit the form to create the food item

## Orders

The Orders page allows admin and manager users to:

1. View all orders (filtered by country for managers)
2. Create new orders
3. Cancel existing orders
4. Update payment methods (admin only)

### Creating an Order

To create a new order:

1. Navigate to the "Create Order" page
2. Select food items from the available list
3. Adjust quantities as needed
4. Select a payment method
5. Submit the order

## Admin Panel

The Admin Panel is only accessible to users with the admin role and provides:

1. User Management

   - View all users
   - Create new users
   - Edit existing users
   - Delete users

2. Payment Settings
   - Configure default payment methods
   - Update payment methods for existing orders

### Creating a New User

To create a new user:

1. Navigate to the Admin Panel
2. Click "Add User"
3. Fill in the user details:
   - Username
   - Password
   - Role (admin, manager, or member)
   - Country (required for manager and member roles)
4. Submit the form to create the user

## Country-Based Access Control

The system enforces country-based access restrictions:

1. Admin users can access data from all countries
2. Manager and Team Member users can only access data from their assigned country
3. When viewing restaurants, food items, or orders, the data is automatically filtered based on your country
4. When creating food items or orders, you can only select restaurants from your country

## Troubleshooting

### Login Issues

If you're having trouble logging in:

1. Verify that your username and password are correct
2. Check that the backend server is running
3. Clear your browser cache and try again

### Missing Data

If you can't see certain restaurants, food items, or orders:

1. Check your assigned country - you can only see data from your country
2. Verify your role permissions - certain features are restricted based on role
3. Confirm that the data exists in the system

### Other Issues

For any other issues, please contact harismehboob2019@gmail.com.
