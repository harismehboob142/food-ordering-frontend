'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { FiUser, FiUsers, FiMapPin } from 'react-icons/fi';

// Types
type CreateUserFormInputs = {
  username: string;
  password: string;
  role: 'admin' | 'manager' | 'member';
  country?: 'India' | 'America';
};

export default function CreateUserPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormInputs>();

  // Watch the role field to determine if country is required
  const selectedRole = watch('role');
  const isCountryRequired = selectedRole !== 'admin';

  // Handle form submission
  const onSubmit = async (data: CreateUserFormInputs) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // If role is admin, remove country field
      if (data.role === 'admin') {
        delete data.country;
      }
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        data,
        {
          headers: {
            'x-auth-token': token
          }
        }
      );
      
      setSuccess('User created successfully!');
      reset(); // Reset form
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <MainLayout>
        <div className="container mx-auto">
          <h1 className="mb-6 text-2xl font-bold">Create User</h1>
          
          {/* Error message */}
          {error && (
            <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          
          {/* Success message */}
          {success && (
            <div className="p-4 mb-6 text-sm text-green-700 bg-green-100 rounded-md">
              {success}
            </div>
          )}
          
          {/* Create user form */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    {...register('username', { required: 'Username is required' })}
                    className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter username"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    id="password"
                    type="password"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter password"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiUsers className="text-gray-400" />
                  </div>
                  <select
                    id="role"
                    {...register('role', { required: 'Role is required' })}
                    className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select a role</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="member">Team Member</option>
                  </select>
                </div>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>
              
              {isCountryRequired && (
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiMapPin className="text-gray-400" />
                    </div>
                    <select
                      id="country"
                      {...register('country', { 
                        required: isCountryRequired ? 'Country is required for non-admin roles' : false
                      })}
                      className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select a country</option>
                      <option value="India">India</option>
                      <option value="America">America</option>
                    </select>
                  </div>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                  )}
                </div>
              )}
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
