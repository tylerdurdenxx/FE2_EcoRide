import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for React Native
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (name, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://ecoride1-backend.onrender.com/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const json = await response.json();
      console.log('Signup Response:', json); // Log response to check

      if (!response.ok) {
        setIsLoading(false);
        setError(json.message || 'An error occurred during signup');
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        // Save user data to AsyncStorage without token
        await AsyncStorage.setItem('user', JSON.stringify(json));

        // Update the auth context (if needed)
        dispatch({ type: 'LOGIN', payload: json });

        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setError('An error occurred while signing up.');
      console.error(error);
    }
  };

  return { signup, isLoading, error };
};
