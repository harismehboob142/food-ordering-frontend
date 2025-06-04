'use client';

import { useState } from 'react';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { FiShoppingBag, FiDollarSign, FiInfo } from 'react-icons/fi';

// Types
type CreateFoodItemFormInputs = {
  name: string;
  description: string;
  price: number;
  restaurant: string;
};

type Restaurant = {
  _id: string;
  name: string;
  country: string;
};

export default function CreateFoodItemPage() {
  const { user, token } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateFoodItemFormInputs>();

  // Fetch restaurants on component mount
  useState(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/restaurants`, {
          headers: {
            'x-auth-token': token
          }
        });
        
        // Filter restaurants by user's country if not admin
        const filteredRestaurants = user?.role === 'admin' 
          ? res.data 
          : res.data.filter((restaurant: Restaurant) => restaurant.country === user?.country);
        
        setRestaurants(filteredRestaurants);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch restaurants');
      }
    };

    if (token) {
      fetchRestaurants();
    }
  }, [token, user]);

  // Handle form submission
  const onSubmit = async (data: CreateFoodItemFormInputs) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/fooditems`,
        data,
        {
          headers: {
            'x-auth-token': token
          }
        }
      );
      
      setSuccess('Food item created successfully!');
      reset(); // Reset form
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create food item');
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto">
          <h1 className="mb-6 text-2xl font-bold">Create Food Item</h1>
          
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
          
          {/* Create food item form */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Food Item Name
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiShoppingBag className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter food item name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiInfo className="text-gray-400" />
                  </div>
                  <textarea
                    id="description"
                    {...register('description', { required: 'Description is required' })}
                    rows={3}
                    className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter food item description"
                  />
                </div>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiDollarSign className="text-gray-400" />
                  </div>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' },
                      valueAsNumber: true
                    })}
                    className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter price"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="restaurant" className="block text-sm font-medium text-gray-700">
                  Restaurant
                </label>
                <select
                  id="restaurant"
                  {...register('restaurant', { required: 'Restaurant is required' })}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select a restaurant</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant._id} value={restaurant._id}>
                      {restaurant.name} ({restaurant.country})
                    </option>
                  ))}
                </select>
                {errors.restaurant && (
                  <p className="mt-1 text-sm text-red-600">{errors.restaurant.message}</p>
                )}
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Food Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
